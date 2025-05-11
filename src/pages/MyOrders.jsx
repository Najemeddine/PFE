import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userId, setUserId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const searchRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:3000/api/commandes/client/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch orders");
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          setError(error.message);
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [userId]);

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
  }, []);

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

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return { label: "En attente", color: "bg-yellow-100 text-yellow-800" };
      case 2:
        return { label: "Confirmée", color: "bg-blue-100 text-blue-800" };
      case 3:
        return { label: "Expédiée", color: "bg-orange-100 text-orange-800" };
      case 4:
        return { label: "Livrée", color: "bg-green-100 text-green-800" };
      default:
        return { label: "Inconnu", color: "bg-gray-100 text-gray-800" };
    }
  };

  const renderNavButtons = () => {
    const buttons = [
      { label: "Accueil", path: "/acceuil" },
      { label: "Produits", path: "/acceuil" },
      { label: "Mes Commandes", path: "/my-orders", active: true },
    ];

    return (
      <>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className={`hover:text-[#FFC107] transition-colors ${
              btn.active ? "text-[#FFC107] font-semibold" : ""
            }`}
            onClick={() => navigate(btn.path)}
          >
            {btn.label}
          </button>
        ))}
        <div className="relative" ref={searchRef}>
          <button
            className="hover:text-[#FFC107] flex items-center transition-colors"
            onClick={toggleSearchBox}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
                    className="bg-[#FFC107] text-black p-2 rounded-r-md hover:bg-yellow-300 transition"
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-[#2F4F4F] text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <div
            className="text-3xl font-extrabold text-white cursor-pointer tracking-tight hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            WeeFarm
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            {renderNavButtons()}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                    {userName.charAt(0)}
                  </div>
                )}
                <span className="text-sm">{userName}</span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#F9F9F9] rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={goToProfile}
                    className="block px-4 py-2 text-[#2F4F4F] hover:bg-gray-100 w-full text-left"
                  >
                    Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-[#6B8E23] hover:bg-gray-100 w-full text-left"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            className="md:hidden text-white hover:text-[#FFC107]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {renderNavButtons()}
            <button
              onClick={goToProfile}
              className="block px-4 py-2 text-white hover:text-[#FFC107] w-full text-left"
            >
              Profil
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-white hover:text-[#6B8E23] w-full text-left"
            >
              Déconnexion
            </button>
          </div>
        )}
      </nav>

      <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center">
          <svg
            className="h-8 w-8 text-yellow-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Mes Commandes
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid"></div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <svg
              className="h-16 w-16 mx-auto text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl text-gray-600 mb-6">Erreur: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition"
            >
              Réessayer
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <svg
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-xl text-gray-600 mb-6">Vous n'avez aucune commande</p>
            <button
              onClick={() => navigate("/acceuil")}
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition shadow-md"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Client</th>
                  <th className="py-3 px-4 text-right">Total (DT)</th>
                  <th className="py-3 px-4 text-left">Date Création</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                  <th className="py-3 px-4 text-left">Détails</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = getStatusLabel(order.status);
                  return (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{order.id}</td>
                      <td className="py-3 px-4">{order.Client}</td>
                      <td className="py-3 px-4 text-right">{order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {new Date(order.date_creation).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.details.items.length > 0 ? (
                          <table className="w-full text-sm text-gray-600">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="py-1 px-2 text-left">Produit</th>
                                <th className="py-1 px-2 text-right">Prix Unitaire</th>
                                <th className="py-1 px-2 text-right">Quantité</th>
                                <th className="py-1 px-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.details.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="py-1 px-2">{item.nom}</td>
                                  <td className="py-1 px-2 text-right">{item.prix.toFixed(2)} DT</td>
                                  <td className="py-1 px-2 text-right">{item.quantite}</td>
                                  <td className="py-1 px-2 text-right">{(item.prix * item.quantite).toFixed(2)} DT</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500">Aucun produit</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl text-yellow-400 mb-4">WeeFarm</h3>
            <p className="text-gray-300">
              Votre marché agricole en ligne, connectant producteurs et consommateurs.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl text-yellow-400 mb-4">Contact</h3>
            <p className="text-gray-300">Email: weefarms8@gmail.com</p>
            <p className="text-gray-300">Téléphone: +216 XX XXX XXX</p>
          </div>
          <div>
            <h3 className="font-bold text-xl text-yellow-400 mb-4">À propos de nous</h3>
            <p className="text-gray-300">
              WeeFarm soutient l'agriculture locale et les pratiques durables.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-300">© 2025 WeeFarm. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default MyOrders;