import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ cart = [], addToCart }) => {
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const searchRef = useRef(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom + " " + user.Nom);
      setUserType(user.typeuser);
      // If there's a user photo in localStorage
      if (user.photo) {
        setUserPhoto(user.photo);
      }
    }

    // Fetch products for search functionality
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/produit");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Close search box when clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, searchRef]);

  // Search products when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredProducts = products.filter(product =>
      product.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredProducts.slice(0, 5)); // Limit to 5 results for dropdown
  }, [searchTerm, products]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName("");
    setUserType("");
    setUserPhoto("");
    setDropdownOpen(false);
    navigate("/");
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Navigate to profile
  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  // Toggle search box
  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
    if (!showSearchBox) {
      // Focus the search input when opening
      setTimeout(() => {
        const searchInput = document.getElementById("searchInput");
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
      setShowSearchBox(false);
    }
  };

  // Navigate to product detail page
  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearchBox(false);
    setSearchTerm("");
  };

  // Common navigation buttons
  const commonButtons = (
    <>
      <button className="hover:text-yellow-300" onClick={() => navigate("/acceuil")}>Acceuil</button>
      <button
        className="hover:text-yellow-300"
        onClick={() => {
          const productsRef = document.getElementById("products-section");
          if (productsRef) {
            productsRef.scrollIntoView({ behavior: "smooth" });
          } else {
            navigate("/acceuil#products");
          }
        }}
      >
        Produits
      </button>
      {/* Search button - common for all user types */}
      <div className="relative" ref={searchRef}>
        <button
          className="hover:text-yellow-300 flex items-center"
          onClick={toggleSearchBox}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Rechercher
        </button>

        {/* Search dropdown */}
        {showSearchBox && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-50">
            <form onSubmit={handleSearchSubmit} className="px-3 py-2">
              <div className="flex">
                <input
                  id="searchInput"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="bg-green-700 text-white p-2 rounded-r-md hover:bg-green-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    className="px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center"
                    onClick={() => goToProduct(product.id)}
                  >
                    <div className="w-10 h-10 mr-2">
                      <img
                        src={product.imageUrl || `/src/assets/images/produits/${product.Nom}.jpg`}
                        alt={product.Nom}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{product.Nom}</div>
                      <div className="text-sm text-green-700">dt {product.prix}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && (
              <div className="px-3 py-2 text-gray-500 text-center">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  // Render user-specific navigation buttons
  const renderNavButtons = () => {
    // If user is not logged in (visitor)
    if (!userName) {
      return (
        <>
          {commonButtons}
          <button
            className="bg-yellow-300 text-green-800 px-4 py-2 rounded-full hover:bg-yellow-400 font-medium"
            onClick={() => navigate("/register")}
          >
            S'inscrire
          </button>
        </>
      );
    }

    // If user is an admin
    if (userType === "admin") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-yellow-300" onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
          <button className="hover:text-yellow-300" onClick={() => navigate("/manage-users")}>Utilisateurs</button>
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-yellow-300 text-green-800 rounded-full flex items-center justify-center font-bold">
                  {userName.charAt(0)}
                </div>
              )}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button onClick={goToProfile} className="block px-4 py-2 text-gray-800 hover:bg-green-100 w-full text-left">
                  Profil
                </button>
                <button onClick={handleLogout} className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left">
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </>
      );
    }

    // If user is a supplier (fournisseur)
    if (userType === "fournisseur") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-yellow-300" onClick={() => navigate("/Fourndashboard")}>Tableau de bord</button>
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
                <button onClick={handleLogout} className="block px-4 py-2 hover:text-red-300 w-full text-left">
                  Déconnexion
                </button>
            </div>
          </div>
        </>
      );
    }

    // Default case - regular client
    return (
      <>
        {commonButtons}
        <button className="relative" onClick={() => navigate("/panel", { state: { cart } })}>
          Panier
          <span className="ml-1 bg-yellow-300 text-green-800 px-2 rounded-full text-sm font-semibold">{cart.length}</span>
        </button>
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-yellow-300 text-green-800 rounded-full flex items-center justify-center font-bold">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button onClick={goToProfile} className="block px-4 py-2 text-gray-800 hover:bg-green-100 w-full text-left">
                Profil
              </button>
              <button onClick={handleLogout} className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <nav className="bg-gradient-to-b from-green-600 to-teal-600 shadow-lg border-r border-green-700 text-white p-4 w-full fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <div
          className="text-3xl font-extrabold text-yellow-300 cursor-pointer tracking-tight hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        >
          Weefarm
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          {renderNavButtons()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;