import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Bonjour ! Je suis votre assistant WeeFarm. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  // Predefined questions and answers
  const suggestions = [
    {
      question: "Quels sont vos produits les plus populaires ?",
      answer: "Nos produits phares incluent les engrais organiques, les semences bio et les pulvérisateurs agricoles. Jetez un œil à la section 'Nos Produits' pour en savoir plus !"
    },
    {
      question: "Livrez-vous à domicile ?",
      answer: "Oui, nous livrons partout dans le pays ! Les frais varient selon la région. Ajoutez des produits au panier pour voir les options de livraison."
    },
    {
      question: "Comment choisir le bon engrais ?",
      answer: "Cela dépend de votre sol et de vos cultures. Par exemple, un engrais riche en azote est idéal pour les légumes verts. Besoin de conseils personnalisés ? Contactez-nous !"
    },
    {
      question: "Proposez-vous des produits bio ?",
      answer: "Bien sûr ! Nous offrons une large gamme de produits bio : semences, engrais et pesticides naturels. Filtrez par 'Fournitures agricoles' pour les découvrir."
    }
  ];

  // Scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: suggestion.question },
      { sender: "bot", text: suggestion.answer }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: trimmedInput },
      { sender: "bot", text: "Merci pour votre question ! Essayez une suggestion pour une réponse rapide ou contactez notre support pour plus de détails." }
    ]);
    setUserInput("");
  };

  const handleKeyDownSuggestion = (e, suggestion) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-5 rounded-full shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
          aria-label="Ouvrir le chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="bg-white rounded-2xl shadow-2xl w-80 h-[500px] flex flex-col transform transition-all duration-300 scale-100 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Fenêtre de chatbot WeeFarm"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-base">WeeFarm Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition"
              aria-label="Fermer le chatbot"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto chatbot-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-slideIn`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2 mb-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyDown={(e) => handleKeyDownSuggestion(e, suggestion)}
                  className="w-full text-left text-sm text-gray-700 px-3 py-2 border border-blue-300 rounded-md hover:bg-blue-50 transition-all duration-200 shadow-sm animate-fadeInSuggestion"
                  aria-label={`Suggestion: ${suggestion.question}`}
                >
                  {suggestion.question}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Posez une question..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                maxLength={200}
                aria-label="Saisir un message"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-all duration-200 shadow-sm"
                aria-label="Envoyer le message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
      <style>
        {`
          .chatbot-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .chatbot-scrollbar::-webkit-scrollbar {
            display: none;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInSuggestion {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-slideIn {
            animation: slideIn 0.2s ease-out;
          }
          .animate-fadeInSuggestion {
            animation: fadeInSuggestion 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

const Dashboard = () => {
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userId, setUserId] = useState(null);
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

  // State for modal, comments, and ratings
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom + " " + user.Nom);
      setUserType(user.typeuser);
      setUserId(user.id);
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

  const [promoProducts, setPromoProducts] = useState([]);
  const carousel = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
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

  // Fetch comments when a product modal is opened
  useEffect(() => {
    if (selectedProduct) {
      const fetchComments = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/comments/${selectedProduct.id}`);
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }
  }, [selectedProduct]);

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

    setSearchResults(filteredProducts.slice(0, 5));
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

  const getItemWidth = () => {
    if (!carousel.current || !carousel.current.children.length) return 0;
    return carousel.current.children[0].offsetWidth + 24;
  };

  const getVisibleItems = () => {
    if (!carousel.current) return 0;
    return Math.floor(carousel.current.offsetWidth / getItemWidth());
  };

  useEffect(() => {
    if (!promoProducts.length) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [promoProducts, isAnimating, currentPosition]);

  const handleNext = () => {
    if (isAnimating || !carousel.current || !promoProducts.length) return;

    setIsAnimating(true);

    const itemWidth = getItemWidth();
    const visibleItems = getVisibleItems();
    const totalItems = promoProducts.length;

    if (currentPosition >= (totalItems - visibleItems) * itemWidth) {
      carousel.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
      setTimeout(() => {
        carousel.current.scrollTo({ left: 0, behavior: 'auto' });
        setCurrentPosition(0);
        setIsAnimating(false);
      }, 500);
    } else {
      carousel.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
      setCurrentPosition(prev => prev + itemWidth);
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

    if (currentPosition <= 0) {
      const endPosition = (totalItems - getVisibleItems()) * itemWidth;
      carousel.current.scrollTo({ left: endPosition, behavior: 'auto' });
      setCurrentPosition(endPosition);
      setTimeout(() => {
        carousel.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        setCurrentPosition(prev => prev - itemWidth);
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }, 50);
    } else {
      carousel.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      setCurrentPosition(prev => prev - itemWidth);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const categories = [
    "all",
    "Fournitures agricoles",
    "Équipements et machines agricoles",
    "Alimentation animale",
    "Engrais"
  ];

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.categorie === selectedCategory);

  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

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
      const firstMatch = products.find(product =>
        product.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (firstMatch) {
        goToProduct(firstMatch.id);
      }
      setShowSearchBox(false);
    }
  };

  const goToProduct = (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setShowSearchBox(false);
    setSearchTerm("");
  };

  // Handle opening the modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setComment("");
    setUserRating(0);
  };

  // Handle closing the modal
  const closeProductModal = () => {
    setSelectedProduct(null);
    setComment("");
    setComments([]);
    setUserRating(0);
  };

  // Handle adding a comment
  const addComment = async (productId) => {
    if (comment.trim() === "") return;
    if (!userId) {
      alert("Vous devez être connecté pour ajouter un commentaire.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produit_id: productId,
          client_id: userId,
          contenu: comment,
        }),
      });

      if (response.ok) {
        const commentsResponse = await fetch(`http://localhost:3000/api/comments/${productId}`);
        const updatedComments = await commentsResponse.json();
        setComments(updatedComments);
        setComment("");
      } else {
        console.error("Error adding comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle submitting a rating
  const submitRating = async (productId) => {
    if (userRating === 0) {
      alert("Veuillez sélectionner une note entre 1 et 5 étoiles.");
      return;
    }
    if (!userId) {
      alert("Vous devez être connecté pour noter un produit.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/produits/${productId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: userId,
          rating: userRating,
        }),
      });

      if (response.ok) {
        const updatedProductsResponse = await fetch("http://localhost:3000/api/produits");
        const updatedProducts = await updatedProductsResponse.json();
        setProducts(updatedProducts);

        const updatedProduct = updatedProducts.find((p) => p.id === productId);
        setSelectedProduct(updatedProduct);

        setUserRating(0);
        alert("Note soumise avec succès !");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erreur lors de la soumission de la note.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Erreur lors de la soumission de la note.");
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} className="text-[#FFC107]">★</span>);
      } else if (i - 0.5 <= roundedRating) {
        stars.push(<span key={i} className="text-[#FFC107]">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  const renderNavButtons = () => {
    const commonButtons = (
      <>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/acceuil")}>Acceuil</button>
        <button
          className="hover:text-[#FFC107]"
          onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Produits
        </button>
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
              <div className="px-3 py-2">
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
                    onClick={handleSearchSubmit}
                    className="bg-[#FFC107] text-black p-2 rounded-r-md hover:bg-yellow-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => goToProduct(product.id)}
                    >
                      <div className="w-10 h-10 mr-2">
                        <img
                          src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                          alt={product.Nom}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-[#2F4F4F]">{product.Nom}</div>
                        <div className="text-sm text-[#2F4F4F]">dt {product.prix}</div>
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

    if (!userName) {
      return (
        <>
          {commonButtons}
          <button
            className="bg-[#FFC107] text-black px-4 py-2 rounded-full hover:bg-yellow-300 font-medium"
            onClick={() => navigate("/register")}
          >
            S'inscrire
          </button>
        </>
      );
    }

    if (userType === "admin") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-[#FFC107]" onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
          <button className="hover:text-[#FFC107]" onClick={() => navigate("/manage-users")}>Utilisateurs</button>
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                  {userName.charAt(0)}
                </div>
              )}
              <span>{userName}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-[#F9F9F9] rounded-md shadow-lg py-1 z-50">
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
    }

    if (userType === "fournisseur") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-[#FFC107]" onClick={() => navigate("/Fourndashboard")}>Tableau de bord</button>
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

    return (
      <>
        {commonButtons}
        <button className="relative" onClick={() => navigate("/panel", { state: { cart } })}>
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
    <div className="min-h-screen bg-white text-gray-900">
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

      <header className="pt-24 bg-white text-gray-900 text-center py-16 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/images/farm-pattern.png')] opacity-10"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">Bienvenue dans le monde Agroalimentaire</h1>
          <p className="text-xl mb-6 text-[#2F4F4F]">Des produits naturels directement des fermes locales</p>
          <button className="bg-[#FFC107] text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition shadow-md">
            Découvrir nos produits
          </button>
        </div>
      </header>

      <section className="py-12 bg-[#f9f9f9f8]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 text-center">Nos promotions</h2>
          {promoProducts.length > 0 ? (
            <div className="relative">
              {promoProducts.length > 3 && (
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#F9F9F9] border border-[#2F4F4F] shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:block disabled:opacity-50"
                >
                  ◀
                </button>
              )}
              <div
                ref={carousel}
                className="flex overflow-x-auto space-x-6 scroll-smooth no-scrollbar px-8"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onScroll={(e) => {
                  setCurrentPosition(e.currentTarget.scrollLeft);
                }}
              >
                {promoProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="min-w-[280px] bg-[#F9F9F9] rounded-xl shadow-xl p-6 relative flex-shrink-0"
                  >
                    <div className="absolute top-2 right-2 bg-[#6B8E23] text-white text-sm font-bold py-1 px-3 rounded-full">
                      Promo
                    </div>
                    <img
                      src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                      alt={product.name}
                      className="rounded-md h-40 w-full object-cover mb-4"
                    />
                    <h3 className="text-lg font-bold text-[#2F4F4F]">{product.Nom}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-[#2F4F4F] font-bold">dt {product.prix}</span>
                        <span className="text-gray-500 line-through ml-2">dt {product.oldPrice}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1 bg-[#FFC107] text-black rounded-md hover:bg-yellow-300 transition text-sm"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {promoProducts.length > 3 && (
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#F9F9F9] border border-[#2F4F4F] shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:block disabled:opacity-50"
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

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-[#2F4F4F]">Filtres</h3>
            <select
              className="mt-2 sm:mt-0 p-2 bg-white border border-gray-300 rounded-md shadow-sm text-[#2F4F4F]"
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

      <section ref={productsRef} className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 text-center">Nos Produits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                id={`product-${product.id}`}
                key={product.id}
                className="bg-[#F9F9F9] rounded-xl shadow-xl hover:shadow-lg transform hover:scale-[1.02] transition duration-300 p-6 flex flex-col justify-between cursor-pointer"
                onClick={() => openProductModal(product)}
              >
                <img
                  src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                  alt={product.Nom}
                  className="rounded-md h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-[#2F4F4F]">{product.Nom}</h3>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating || 0)}
                  <span className="ml-2 text-sm text-gray-600">({product.rating || 0})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2F4F4F] font-bold">dt {product.prix}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="px-4 py-2 bg-[#FFC107] text-black rounded-md hover:bg-yellow-300 transition"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-[#F9F9F9] rounded-xl shadow-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style>
              {`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div className="hide-scrollbar">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#2F4F4F]">{selectedProduct.Nom}</h2>
                <button
                  onClick={closeProductModal}
                  className="text-[#6B8E23] hover:text-red-500"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedProduct.photo || `/src/assets/images/produits/${selectedProduct.Nom}.jpg`}
                alt={selectedProduct.Nom}
                className="rounded-md h-48 w-full object-cover mb-4"
              />
              <p className="text-gray-600 mb-4">{selectedProduct.description || "Aucune description disponible."}</p>
              <p className="text-[#2F4F4F] font-semibold mb-4">
                Disponibilité :{" "}
                <span className={selectedProduct.stock > 0 ? "text-[#6B8E23]" : "text-red-500"}>
                  {selectedProduct.stock > 0 ? "En stock" : "Rupture de stock"}
                </span>
              </p>

              {/* Add Rating Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#2F4F4F] mb-2">Votre note</h3>
                <div className="flex items-center justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-2xl ${
                        star <= userRating ? "text-[#FFC107]" : "text-gray-300"
                      }`}
                      onClick={() => setUserRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => submitRating(selectedProduct.id)}
                  className="bg-[#FFC107] text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition"
                >
                  Soumettre la note
                </button>
              </div>

              {/* Comments Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#2F4F4F] mb-2">Commentaires</h3>
                {comments.length > 0 ? (
                  <ul 
                    className="space-y-4 max-h-40 overflow-y-auto"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <style>
                      {`
                        .hide-scrollbar-nested::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    <div className="hide-scrollbar-nested">
                      {comments.map((comment, index) => (
                        <li key={index} className="border-b border-gray-200 pb-2 flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {comment.photo ? (
                              <img
                                src={comment.photo}
                                alt={`${comment.Prenom} ${comment.Nom}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                                {comment.Prenom.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-[#2F4F4F]">{comment.Prenom} {comment.Nom}</span>
                              <span className="text-sm text-gray-500">{new Date(comment.date_creation).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{comment.contenu}</p>
                          </div>
                        </li>
                      ))}
                    </div>
                  </ul>
                ) : (
                  <p className="text-gray-500">Aucun commentaire pour ce produit.</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full p-2 border border-[#A9CBA4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  rows="3"
                />
                <button
                  onClick={() => addComment(selectedProduct.id)}
                  className="bg-[#FFC107] text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition"
                >
                  Ajouter un commentaire
                </button>
              </div>
            </div>
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

      <Chatbot />
    </div>
  );
};

export default Dashboard;