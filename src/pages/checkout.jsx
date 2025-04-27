import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const totalPrice = location.state?.totalPrice || 0;
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Card payment states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize user data
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom + " " + user.Nom);
      setUserType(user.typeuser);
      if (user.photo) {
        setUserPhoto(user.photo);
      }
    }
  }, []);

  // Close dropdown and search when clicking outside
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

  // Validate card details
  const validateForm = () => {
    const newErrors = {};
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      newErrors.cardNumber = "Le numéro de carte doit contenir 16 chiffres";
    }
    if (!cardHolder.trim()) {
      newErrors.cardHolder = "Le nom du titulaire est requis";
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = "Date d'expiration invalide (MM/AA)";
    }
    if (!cvv.match(/^\d{3}$/)) {
      newErrors.cvv = "Le CVV doit contenir 3 chiffres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing (replace with actual payment gateway API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Paiement effectué avec succès!");
      navigate("/acceuil");
    } catch (error) {
      setErrors({ general: "Une erreur est survenue lors du paiement" });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderNavButtons = () => {
    const commonButtons = (
      <>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/acceuil")}>Acceuil</button>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/acceuil")}>Produits</button>
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
              <h2 className="text-3xl font-bold text-[#2F4F4F] border-b border-gray-200 pb-4 mb-6">Paiement</h2>
              <form onSubmit={handlePayment} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-md">
                    {errors.general}
                  </div>
                )}
                <div>
                  <label className="block text-[#2F4F4F] font-semibold mb-2">Numéro de carte</label>
                  <input
                    type="text"
                    value={formatCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full p-3 border ${errors.cardNumber ? "border-red-500" : "border-[#A9CBA4]"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]`}
                    maxLength={19}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-[#2F4F4F] font-semibold mb-2">Nom du titulaire</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Nom sur la carte"
                    className={`w-full p-3 border ${errors.cardHolder ? "border-red-500" : "border-[#A9CBA4]"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]`}
                  />
                  {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-[#2F4F4F] font-semibold mb-2">Date d'expiration</label>
                    <input
                      type="text"
                      value={formatExpiryDate(expiryDate)}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/AA"
                      className={`w-full p-3 border ${errors.expiryDate ? "border-red-500" : "border-[#A9CBA4]"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]`}
                      maxLength={5}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[#2F4F4F] font-semibold mb-2">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      className={`w-full p-3 border ${errors.cvv ? "border-red-500" : "border-[#A9CBA4]"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]`}
                      maxLength={3}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-full font-bold text-center ${isProcessing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#FFC107] text-black hover:bg-yellow-300 shadow-md"}`}
                >
                  {isProcessing ? "Traitement..." : "Payer maintenant"}
                </button>
              </form>
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
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-4 border-b border-gray-200 pb-4">Récapitulatif de la commande</h3>
              <div className="space-y-4">
                {cart.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                      alt={product.Nom}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <p className="text-[#2F4F4F] font-semibold">{product.Nom}</p>
                      <p className="text-sm text-gray-600">Quantité: {product.quantity}</p>
                    </div>
                    <p className="text-[#6B8E23] font-bold">dt {(product.prix * product.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span className="font-semibold">dt {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span className="font-semibold">dt 7.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold mt-4">
                    <span>Total:</span>
                    <span className="text-[#6B8E23]">dt {(totalPrice + 7).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-4">Moyens de paiement</h3>
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">Visa</div>
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">MC</div>
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">PayP</div>
                </div>
                <div className="text-[#6B8E23]">100% Sécurisé</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Checkout;