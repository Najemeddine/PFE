import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const Profile = () => {
  const [userData, setUserData] = useState({
    id: "", // Add id to state
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

  // Load user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData({
        id: user.id || "", // Ensure id is retrieved
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
        updateData.password = newPassword; // Send plaintext password; backend will hash it
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
          confirmButtonColor: "#3085d6",
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

  // Render navigation buttons (unchanged)
  const renderNavButtons = () => {
    const commonButtons = (
      <>
        <button className="hover:text-yellow-300" onClick={() => navigate("/acceuil")}>
          Accueil
        </button>
        <button className="hover:text-yellow-300" onClick={() => navigate("/acceuil#products")}>
          Produits
        </button>
      </>
    );

    if (userData.typeuser === "admin") {
      return (
        <>
          {commonButtons}
          <button className="hover:text-yellow-300" onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>
          <button className="hover:text-yellow-300" onClick={() => navigate("/manage-users")}>
            Utilisateurs
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
                <div className="w-8 h-8 bg-yellow-300 text-green-800 rounded-full flex items-center justify-center font-bold">
                  {userData.Prenom.charAt(0)}
                </div>
              )}
              <span>{userData.Prenom} {userData.Nom}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-green-100 w-full text-left"
                >
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                >
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
          <button className="hover:text-yellow-300" onClick={() => navigate("/Fourndashboard")}>
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
                <div className="w-8 h-8 bg-yellow-300 text-green-800 rounded-full flex items-center justify-center font-bold">
                  {userData.Prenom.charAt(0)}
                </div>
              )}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-green-100 w-full text-left"
                >
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                >
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
              <div className="w-8 h-8 bg-yellow-300 text-green-800 rounded-full flex items-center justify-center font-bold">
                {userData.Prenom.charAt(0)}
              </div>
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-16 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-gray-800 hover:bg-green-100 w-full text-left"
              >
                Profil
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-green-200 to-blue-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-gradient-to-b from-green-600 to-teal-600 text-white p-4 shadow-md w-full fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <div
            className="text-3xl font-extrabold text-yellow-300 cursor-pointer tracking-tight hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            Weefarm
          </div>
          <div className="hidden md:flex space-x-6 items-center">{renderNavButtons()}</div>
        </div>
      </nav>

      {/* Profile Content */}
      <section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Mon Profil</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">{success}</div>
          )}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Photo */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        Aucun aperçu
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
                      className="cursor-pointer bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                    >
                      Choisir une photo
                    </label>
                  </div>
                </div>
              </div>

              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="Prenom"
                  value={userData.Prenom}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="Nom"
                  value={userData.Nom}
                  onChange={handleInputChange}
                  className="w-full text-white p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="numtel"
                  value={userData.numtel}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="Adresse"
                  value={userData.Adresse}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={userData.dateNaissance}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={userData.genre}
                  onChange={handleInputChange}
                  className="w-full p-2 border text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              {/* Password Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-white p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/acceuil")}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-green-600 to-teal-600 shadow-lg border-r border-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">WeeFarm</h3>
            <p className="text-green-100">
              Votre marché agricole en ligne, connectant producteurs et consommateurs.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Contact</h3>
            <p className="text-green-100">Email: weefarms8@gmail.com</p>
            <p className="text-green-100">Téléphone: +216 XX XXX XXX</p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">À propos de nous</h3>
            <p className="text-green-100">
              WeeFarm soutient l'agriculture locale et les pratiques durables.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-green-600 text-center">
          <p className="text-sm">© 2025 WeeFarm. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;