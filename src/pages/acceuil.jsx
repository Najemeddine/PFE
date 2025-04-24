import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const productsRef = useRef(null);

  // Add states for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const searchRef = useRef(null);

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

  const [promoProducts, setPromoProducts] = useState([]);
  const carousel = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/produits");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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

  useEffect(() => {
    if (products.length > 0) {
      const promotions = products.slice(0, 6).map(product => ({
        ...product,
        oldPrice: (product.prix * 1.2).toFixed(2)
      }));
      setPromoProducts(promotions);
    }
  }, [products]);

  // Function to calculate item width and total width
  const getItemWidth = () => {
    if (!carousel.current || !carousel.current.children.length) return 0;
    return carousel.current.children[0].offsetWidth + 24; // 24 for space-x-6
  };

  const getVisibleItems = () => {
    if (!carousel.current) return 0;
    return Math.floor(carousel.current.offsetWidth / getItemWidth());
  };

  // Setup infinite carousel autoplay
  useEffect(() => {
    if (!promoProducts.length) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [promoProducts, isAnimating, currentPosition]);

  // Handling manual and auto navigation
  const handleNext = () => {
    if (isAnimating || !carousel.current || !promoProducts.length) return;

    setIsAnimating(true);

    const itemWidth = getItemWidth();
    const visibleItems = getVisibleItems();
    const totalItems = promoProducts.length;

    // Check if we're at or near the end
    if (currentPosition >= (totalItems - visibleItems) * itemWidth) {
      // First complete the animation to the end
      carousel.current.scrollBy({ left: itemWidth, behavior: 'smooth' });

      // After animation completes, snap back to the beginning
      setTimeout(() => {
        carousel.current.scrollTo({ left: 0, behavior: 'auto' });
        setCurrentPosition(0);
        setIsAnimating(false);
      }, 500); // this duration should match your scroll animation time
    } else {
      // Normal scroll to next item
      carousel.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
      setCurrentPosition(prev => prev + itemWidth);

      // Reset animation flag after scroll completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (isAnimating || !carousel.current || !promoProducts.length) return;

    setIsAnimating(true);

    const itemWidth = getItemWidth();
    const totalItems = promoProducts.length;

    // Check if we're at or near the beginning
    if (currentPosition <= 0) {
      // First jump to the end without animation
      const endPosition = (totalItems - getVisibleItems()) * itemWidth;
      carousel.current.scrollTo({ left: endPosition, behavior: 'auto' });
      setCurrentPosition(endPosition);

      // Then after a brief moment, scroll one item back with animation
      setTimeout(() => {
        carousel.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        setCurrentPosition(prev => prev - itemWidth);

        // Reset animation flag after scroll completes
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }, 50);
    } else {
      // Normal scroll to previous item
      carousel.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      setCurrentPosition(prev => prev - itemWidth);

      // Reset animation flag after scroll completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  // Define the available product categories
  const categories = [
    "all",
    "Fournitures agricoles",
    "Équipements et machines agricoles",
    "Alimentation animale",
    "Engrais"
  ];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.categorie === selectedCategory);

  const navigate = useNavigate();

  // Add product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

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

  // Render navigation buttons based on user type
  const renderNavButtons = () => {
    const commonButtons = (
      <>
        <button className="hover:text-yellow-300" onClick={() => navigate("/acceuil")}>Acceuil</button>
        <button
          className="hover:text-yellow-300"
          onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}
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
              <span>{userName}</span>
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
          <button className="hover:text-yellow-300" onClick={() => navigate("/Fourndashboard")}>tableau de board</button>
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
    <div className="min-h-screen min-h-screen bg-gradient-to-br from-sky-300 via-green-200 to-blue-100 text-gray-900">
      {/* Updated Navbar with click-based dropdown */}
      <nav className="bg-gradient-to-b from-green-600 to-teal-600 text-white p-4 shadow-md w-full fixed top-0 left-0 z-50">
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

      {/* Rest of your components remain unchanged */}
      {/* Hero Banner */}
      <header className="pt-24 bg-gradient-to-r from-green-600 to-green-800 text-white text-center py-16 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/images/farm-pattern.png')] opacity-10"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Bienvenue dans le monde Agroalimentaire</h1>
          <p className="text-xl mb-6">Des produits naturels directement des fermes locales</p>
          <button className="bg-yellow-400 text-green-800 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition shadow-md">
            Découvrir nos produits
          </button>
        </div>
      </header>

      {/* Promotions Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Nos promotions</h2>

          {promoProducts.length > 0 ? (
            <div className="relative">
              {/* Left Arrow */}
              {promoProducts.length > 3 && (
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:block disabled:opacity-50"
                >
                  ◀
                </button>
              )}

              {/* Scrollable Carousel */}
              <div
                ref={carousel}
                className="flex overflow-x-auto space-x-6 scroll-smooth no-scrollbar px-8"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onScroll={(e) => {
                  // Track current scroll position
                  setCurrentPosition(e.currentTarget.scrollLeft);
                }}
              >
                {promoProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="min-w-[280px] bg-white rounded-xl shadow-xl p-6 relative flex-shrink-0"
                  >
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                      Promo
                    </div>
                    <img
                      src={product.imageUrl || `/src/assets/images/produits/${product.Nom}.jpg`}
                      alt={product.name}
                      className="rounded-md h-40 w-full object-cover mb-4"
                    />
                    <h3 className="text-lg font-bold text-green-700">{product.Nom}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-green-700 font-bold">dt {product.prix}</span>
                        <span className="text-gray-400 line-through ml-2">dt {product.oldPrice}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1 bg-green-700 text-white rounded-md hover:bg-green-800 transition text-sm"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              {promoProducts.length > 3 && (
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:block disabled:opacity-50"
                >
                  ▶
                </button>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucune promotion disponible pour le moment.</p>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-800">Filtres</h3>
            <select
              className="mt-2 sm:mt-0 p-2 bg-white border border-green-300 rounded-md shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products */}
      <section ref={productsRef} className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Nos Produits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition duration-300 p-6 flex flex-col justify-between"
              >
                <img
                  src={product.imageUrl || `/src/assets/images/produits/${product.Nom}.jpg`}
                  alt={product.name}
                  className="rounded-md h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-green-700">{product.Nom}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-bold">dt {product.prix}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-green-600 to-teal-600 shadow-lg border-r border-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">WeeFarm</h3>
            <p className="text-green-100">Votre marché agricole en ligne, connectant producteurs et consommateurs.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Contact</h3>
            <p className="text-green-100">Email: weefarms8@gmail.com</p>
            <p className="text-green-100">Téléphone: +216 XX XXX XXX</p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">À propos de nous</h3>
            <p className="text-green-100">WeeFarm soutient l'agriculture locale et les pratiques durables.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-green-600 text-center">
          <p className="text-sm">© 2025 WeeFarm. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;