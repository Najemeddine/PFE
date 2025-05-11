import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Panel = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userId, setUserId] = useState(null); // Add userId state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const searchRef = useRef(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

  // Initialize user data and quantities only once when component mounts
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom + " " + user.Nom);
      setUserType(user.typeuser);
      setUserId(user.id); // Set userId
      if (user.photo) {
        setUserPhoto(user.photo);
      }
    }

    // Initialize quantities only once when cart is first loaded
    if (cart.length > 0 && Object.keys(quantities).length === 0) {
      const initialQuantities = {};
      cart.forEach(item => {
        initialQuantities[item.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, []);

  // Calculate total price whenever cart or quantities change
  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      return sum + (item.prix * (quantities[item.id] || 1));
    }, 0);
    setTotalPrice(total);
  }, [cart, quantities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, searchRef]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName("");
    setUserType("");
    setUserPhoto("");
    setUserId(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
    if (!showSearchBox) {
      setTimeout(() => {
        const searchInput = document.getElementById("searchInput");
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
      setShowSearchBox(false);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: newQuantity
    }));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    navigate("/panel", { state: { cart: updatedCart } });
  };

  const placeOrder = async () => {
    if (!userId) {
      alert("Vous devez être connecté pour passer une commande.");
      return;
    }
  
    const produits = cart.map(item => ({
      produit_id: item.id,
      quantite: quantities[item.id] || 1
    }));
  
    const commandeData = {
      Client: userId,
      details: JSON.stringify({
        totalPrice: totalPrice + (cart.length > 0 ? 7 : 0),
        items: cart.map(item => ({
          id: item.id,
          nom: item.Nom,
          prix: item.prix,
          quantite: quantities[item.id] || 1
        }))
      }),
      produits
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commandeData),
      });
  
      if (response.ok) {
        setShowSuccessPopup(true);
        // Clear the cart after successful order
        navigate("/panel", { state: { cart: [] } });
        setQuantities({});
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erreur lors de la création de la commande.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Erreur lors de la création de la commande.");
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate("/my-orders"); // Redirect to the orders page after closing the popup
  };

  const renderNavButtons = () => {
    const commonButtons = (
      <>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/acceuil")}>Acceuil</button>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/acceuil")}>Produits</button>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/my-orders")}>Mes Commandes</button>
        <div className="relative" ref={searchRef}>
          <button
            className="hover:text-[#FFC107] flex items-center"
            onClick={toggleSearchBox}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Rechercher
          </button>
          {showSearchBox && (
            <div className="absolute right-0 mt-2 w-72 bg-[#F9F9F9] rounded-md shadow-lg py-2 z-50">
              <form onSubmit={handleSearchSubmit} className="px-3 py-2">
                <div className="flex">
                  <input
                    id="searchInput"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher des produits..."
                    className="w-full p-2 bg-white border border-[#A9CBA4] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFC107] text-black p-2 rounded-r-md hover:bg-yellow-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </>
    );

    return (
      <>
        {commonButtons}
        <button className="relative font-bold text-[#FFC107]" onClick={() => navigate("/panel", { state: { cart } })}>
          Panier
          <span className="ml-1 bg-[#FFC107] text-black px-2 rounded-full text-sm font-semibold">{cart.length}</span>
        </button>
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#F9F9F9] rounded-md shadow-lg py-1 z-50">
              <button onClick={goToProfile} className="block px-4 py-2 text-[#2F4F4F] hover:bg-gray-100 w-full text-left">
                Profil
              </button>
              <button onClick={handleLogout} className="block px-4 py-2 text-[#6B8E23] hover:bg-gray-100 w-full text-left">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-gray-900">
      <nav className="bg-[#2F4F4F] text-white p-4 shadow-md w-full fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <div
            className="text-3xl font-extrabold text-white cursor-pointer tracking-tight hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            Weefarm
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            {renderNavButtons()}
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="w-full md:w-8/12">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-[#2F4F4F] border-b border-gray-200 pb-4 mb-6">Votre Panier</h2>
              
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-xl text-gray-600 mb-6">Votre panier est vide</p>
                  <button 
                    onClick={() => navigate("/acceuil")}
                    className="bg-[#FFC107] text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition shadow-md"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <div>
                  {cart.map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row items-center sm:items-start border-b border-gray-200 py-6 last:border-b-0">
                      <div className="w-full sm:w-32 h-32 mb-4 sm:mb-0 sm:mr-6">
                        <img
                          src={product.photo.startsWith('data:image') ? product.photo : `data:image/jpeg;base64,${product.photo}`}
                          alt={product.Nom}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-[#2F4F4F]">{product.Nom}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <p className="text-[#6B8E23] font-bold">dt {product.prix}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center gap-4 mt-4 sm:mt-0">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l-md"
                            onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{quantities[product.id] || 1}</span>
                          <button 
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r-md"
                            onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="text-red-500 hover:text-red-700 flex items-center"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">Besoin d'aide?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6B8E23] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">weefarms8@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6B8E23] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-gray-600">+216 XX XXX XXX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-4/12 sticky top-24">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-4 border-b border-gray-200 pb-4">Récapitulatif</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Nombre de produits:</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span className="font-semibold">dt {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison:</span>
                  <span className="font-semibold">dt {cart.length > 0 ? "7.00" : "0.00"}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-[#6B8E23]">dt {cart.length > 0 ? (totalPrice + 7).toFixed(2) : "0.00"}</span>
                  </div>
                </div>
                <button 
                  onClick={placeOrder}
                  disabled={cart.length === 0}
                  className={`w-full py-3 rounded-full font-bold text-center mt-4 ${
                    cart.length === 0 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-[#FFC107] text-black hover:bg-yellow-300 shadow-md"
                  }`}
                >
                  Passer la commande
                </button>
                <button 
                  onClick={() => navigate("/acceuil")}
                  className="w-full py-3 border border-[#2F4F4F] text-[#2F4F4F] rounded-full font-bold text-center hover:bg-[#2F4F4F] hover:text-white transition mt-2"
                >
                  Continuer vos achats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#F9F9F9] rounded-xl shadow-2xl p-8 max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#2F4F4F] text-center mb-4">Commande bien enregistrée en attente</h2>
            <button
              onClick={closeSuccessPopup}
              className="w-full bg-[#FFC107] text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition"
            >
              Voir mes commandes
            </button>
          </div>
        </div>
      )}

      <footer className="bg-[#2F4F4F] shadow-lg border-t border-[#6B8E23] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">WeeFarm</h3>
            <p className="text-[#A9CBA4]">Votre marché agricole en ligne, connectant producteurs et consommateurs.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Contact</h3>
            <p className="text-[#A9CBA4]">Email: weefarms8@gmail.com</p>
            <p className="text-[#A9CBA4]">Téléphone: +216 XX XXX XXX</p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">À propos de nous</h3>
            <p className="text-[#A9CBA4]">WeeFarm soutient l'agriculture locale et les pratiques durables.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-[#6B8E23] text-center">
          <p className="text-sm text-[#A9CBA4]">© 2025 WeeFarm. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Panel;