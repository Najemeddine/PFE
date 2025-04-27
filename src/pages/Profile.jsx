import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    Nom: "",
    Prenom: "",
    Adresse: "",
    numtel: "",
    dateNaissance: "",
    genre: "",
    photo: "",
    typeuser: "",
    emailPro: "",
    Entreprise: "",
    matricule: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Load user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData({
        id: user.id || "",
        email: user.email || "",
        Nom: user.Nom || "",
        Prenom: user.Prenom || "",
        Adresse: user.Adresse || "",
        numtel: user.numtel || "",
        dateNaissance: user.dateNaissance ? user.dateNaissance.split("T")[0] : "",
        genre: user.genre || "",
        photo: user.photo || "",
        typeuser: user.typeuser || "",
        emailPro: user.emailPro || "",
        Entreprise: user.Entreprise || "",
        matricule: user.matricule || "",
      });
      if (user.photo) {
        setPreviewUrl(user.photo);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle file selection and convert to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setUserData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords if provided
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }
      if (newPassword.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour mettre à jour votre profil");
        navigate("/login");
        return;
      }

      // Prepare data to send (align with database schema)
      const updateData = {
        id: userData.id,
        Nom: userData.Nom,
        Prenom: userData.Prenom,
        email: userData.email,
        numtel: userData.numtel,
        Adresse: userData.Adresse,
        dateNaissance: userData.dateNaissance,
        genre: userData.genre,
        photo: userData.photo,
        typeuser: userData.typeuser,
      };
      if (newPassword) {
        updateData.password = newPassword;
      }

      // Send update request to backend
      const response = await fetch(`http://localhost:3000/api/clients/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (response.ok) {
        // Update localStorage
        localStorage.setItem("user", JSON.stringify({ ...userData }));
        setSuccess("Profil mis à jour avec succès");

        // Show SweetAlert confirmation
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Votre profil a été mis à jour avec succès !",
          confirmButtonColor: "#6B8E23",
          confirmButtonText: "OK",
        });

        setNewPassword("");
        setConfirmPassword("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(result.message || "Erreur lors de la mise à jour du profil");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.error("Update error:", err);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/");
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearchBox(false);
    setSearchTerm("");
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    const commonButtons = (
      <>
        <button className="hover:text-[#FFC107]" onClick={() => navigate("/acceuil")}>Accueil</button>
        <button
          className="hover:text-[#FFC107]"
          onClick={() => navigate("/acceuil")}
        >
          Produits
        </button>
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
                          src={product.imageUrl || `/src/assets/images/produits/${product.Nom}.jpg`}
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

    if (userData.typeuser === "admin") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-[#FFC107]" onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
          <button className="hover:text-[#FFC107]" onClick={() => navigate("/manage-users")}>Utilisateurs</button>
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
              {userData.photo ? (
                <img src={userData.photo} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                  {userData.Prenom.charAt(0)}
                </div>
              )}
              <span>{userData.Prenom} {userData.Nom}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-[#F9F9F9] rounded-md shadow-lg py-1 z-50">
                <button onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-[#2F4F4F] hover:bg-gray-100 w-full text-left">
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

    if (userData.typeuser === "fournisseur") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-[#FFC107]" onClick={() => navigate("/Fourndashboard")}>
            Tableau de bord
          </button>
          <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
              {userData.photo ? (
                <img
                  src={userData.photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                  {userData.Prenom.charAt(0)}
                </div>
              )}
              <span>{userData.Prenom} {userData.Nom}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-[#F9F9F9] rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-[#2F4F4F] hover:bg-gray-100 w-full text-left"
                >
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

    return (
      <>
        {commonButtons}
        <button className="relative" onClick={() => navigate("/panel")}>
          Panier
          <span className="ml-1 bg-[#FFC107] text-black px-2 rounded-full text-sm font-semibold">0</span>
        </button>
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
            {userData.photo ? (
              <img
                src={userData.photo}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold">
                {userData.Prenom.charAt(0)}
              </div>
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#F9F9F9] rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-[#2F4F4F] hover:bg-gray-100 w-full text-left"
              >
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
      {/* Navbar */}
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

      {/* Header Banner */}

      {/* Profile Content */}
      <section className="py-12">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#2F4F4F]">Mon Profil</h1>
          <p className="text-lg text-[#6B8E23]">Gérez vos informations personnelles</p>
        </div>
        <div className="max-w-3xl mx-auto px-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#A9CBA4] shadow-md mb-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F9F9F9] flex items-center justify-center text-[#6B8E23] font-bold text-2xl">
                    {userData.Prenom?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="photo"
                  className="cursor-pointer bg-[#FFC107] text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition font-medium shadow-sm"
                >
                  Modifier la photo
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-xl font-semibold text-[#2F4F4F] mb-4 border-b border-gray-200 pb-2">
                  Informations personnelles
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="Prenom"
                  value={userData.Prenom}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="Nom"
                  value={userData.Nom}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="numtel"
                  value={userData.numtel}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="Adresse"
                  value={userData.Adresse}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={userData.dateNaissance}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={userData.genre}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Security Information */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-xl font-semibold text-[#2F4F4F] mb-4 border-b border-gray-200 pb-2">
                  Sécurité
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  placeholder="Laisser vide pour ne pas changer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F4F4F] mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  placeholder="Confirmer le nouveau mot de passe"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/acceuil")}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#6B8E23] text-white rounded-md hover:bg-green-700 transition font-medium shadow-md"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2F4F4F] shadow-lg border-t border-[#6B8E23] text-white py-8 mt-12">
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

export default Profile;