import React, { useState } from "react";
import registerBackground from "../assets/images/nature.png";
import clientImage from "../assets/images/client-image.jpg";
import fournisseurImage from "../assets/images/fournisseur-image.jpg";
import agricultureTechImage from "../assets/images/agri-tech-drone.jpg"; // Add this image to your assets

const Register = () => {
  const [userType, setUserType] = useState(null); // null, "client", ou "fournisseur"
  const [formData, setFormData] = useState({
    Nom: "",
    Prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    Adresse: "",
    numtel: "",
    dateNaissance: "",
    genre: "",
    Dateinsc: new Date().toISOString().split("T")[0],
    // Champs spécifiques au fournisseur
    Entreprise: "",
    emailPro: "",
    photo: null, // Will store base64 string
    photoName: "", // Will store the original file name
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Colors for consistent design
  const colors = {
    primary: "#3B7A57", // Sacramento green (earthier, less intense)
    accent: "#F2C94C",  // Harvest gold
    neutral: "#F5F5F0", // Off-white
    text: "#333333",    // Dark gray for text
    border: "#D1D5DB",  // Light gray for borders
  };

  // Définir la date maximale (aujourd'hui) pour le champ date d'inscription
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Vérification du type de fichier (jpg ou png uniquement)
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError("Format de fichier non valide. Veuillez sélectionner une image JPG ou PNG.");
        e.target.value = '';
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          photo: reader.result, // base64 string
          photoName: file.name // original filename
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Générer un matricule pour les fournisseurs
  const generateMatricule = () => {
    // Format: WFyyyy-MM-xxxxx (WF pour WeeFarm, année-mois, puis 5 chiffres aléatoires)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 chiffres aléatoires
    
    return `WF${year}-${month}-${randomDigits}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas!");
      setIsSubmitting(false);
      return;
    }

    // Vérifier que la date d'inscription n'est pas dans le futur
    const inscDate = new Date(formData.Dateinsc);
    const currentDate = new Date();
    if (inscDate > currentDate) {
      setError("La date d'inscription ne peut pas être dans le futur!");
      setIsSubmitting(false);
      return;
    }

    // Create a copy of formData to send (no FormData needed with base64)
    const dataToSend = { ...formData };
    
    // Remove confirmPassword from data to send
    delete dataToSend.confirmPassword;
    
    // Add matricule for suppliers
    if (userType === "fournisseur") {
      dataToSend.matricule = generateMatricule();
    }
    
    // Add user type
    dataToSend.typeuser = userType;

    try {
      // API URL
      const apiUrl = "http://localhost:3000/api/register";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Send JSON data
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "L'inscription a échoué");

      // Success message specific to user type
      if (userType === "fournisseur") {
        setSuccess("Inscription réussie ! Un email contenant votre matricule vous a été envoyé. Redirection vers la page de connexion...");
      } else {
        setSuccess("Inscription réussie ! Redirection vers la page de connexion...");
      }
      
      setTimeout(() => (window.location.href = "/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si le type d'utilisateur n'est pas encore choisi, afficher la sélection
  if (!userType) {
    return (
      <div
        className="fixed inset-0 bg-[#dcdde1] bg-cover bg-center flex items-center justify-center"
      >
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-center mb-6" style={{ color: colors.primary }}>
            Bienvenue sur WeeFarm
          </h2>
          
          <p className="text-center text-gray-600 mb-8 text-lg">
            Choisissez votre type de compte pour commencer
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="border border-gray-200 hover:border-gray-300 rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setUserType("client")}
              style={{ backgroundColor: colors.neutral }}
            >
              <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={clientImage} 
                  alt="Client" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>Client</h3>
              <p className="text-sm text-gray-500 text-center mt-2 max-w-xs">
                Achetez des produits agricoles de qualité directement auprès des producteurs
              </p>
            </div>
            
            <div 
              className="border border-gray-200 hover:border-gray-300 rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setUserType("fournisseur")}
              style={{ backgroundColor: colors.neutral }}
            >
              <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={fournisseurImage} 
                  alt="Fournisseur" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>Fournisseur</h3>
              <p className="text-sm text-gray-500 text-center mt-2 max-w-xs">
                Vendez vos produits agricoles sur notre plateforme dédiée aux professionnels
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <a href="/login" className="font-medium hover:underline" style={{ color: colors.primary }}>
                Connectez-vous ici
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire pour le type d'utilisateur sélectionné
  return (
    <div
      className="fixed inset-0 bg-[#dcdde1] bg-cover bg-center flex items-center justify-center"
    >
      <div className="flex items-center justify-center min-h-screen py-8 px-4 w-full">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl max-w-3xl w-full my-4 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar with agricultural tech image instead of green background */}
            <div className="md:w-2/5 relative overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={agricultureTechImage} 
                  alt="Agriculture Technology" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay to ensure text is readable */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              
              <div className="relative z-10 p-6 flex flex-col justify-center h-full text-white">
                <h2 className="text-2xl font-bold mb-4">
                  {userType === "client" ? "Compte Client" : "Compte Fournisseur"}
                </h2>
                <p className="text-sm opacity-90 mb-4">
                  {userType === "client" 
                    ? "Rejoignez WeeFarm pour accéder à des produits agricoles de qualité." 
                    : "Vendez vos produits agricoles sur notre plateforme dédiée aux professionnels."}
                </p>
                <div className="hidden md:block">
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Avantages</h3>
                    <ul className="text-xs space-y-2">
                      {userType === "client" ? (
                        <>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Produits agricoles frais
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Livraison rapide
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Support client dédié
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Large audience d'acheteurs
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Gestion simplifiée des commandes
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Analyse des ventes
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Form container - Modified for custom scrolling */}
            <div className="md:w-3/5 p-6 max-h-[80vh] overflow-y-auto scrollbar-hide"
                 style={{ 
                   scrollbarWidth: 'none',  /* Firefox */
                   msOverflowStyle: 'none',  /* IE and Edge */
                 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Inscription</h3>
                <button
                  type="button"
                  onClick={() => setUserType(null)}
                  className="text-sm flex items-center text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Changer de type
                </button>
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  {success}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="Prenom"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.Prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="Nom"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.Nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRing: colors.primary }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {userType === "fournisseur" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email professionnel
                    </label>
                    <input
                      type="email"
                      name="emailPro"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.emailPro}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="numtel"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.numtel}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <select
                      name="genre"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.genre}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="Adresse"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRing: colors.primary }}
                    value={formData.Adresse}
                    onChange={handleChange}
                    required
                  />
                </div>

                {userType === "fournisseur" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      name="Entreprise"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.Entreprise}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      name="dateNaissance"
                      max={today}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.dateNaissance}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date d'inscription
                    </label>
                    <input
                      type="date"
                      name="Dateinsc"
                      max={today}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.Dateinsc}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Photo de profil (JPG ou PNG uniquement)
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept=".jpg,.jpeg,.png"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRing: colors.primary }}
                    onChange={handleFileChange}
                  />
                  {formData.photo && (
                    <div className="mt-2 flex items-center">
                      <img 
                        src={formData.photo} 
                        alt="Prévisualisation" 
                        className="h-12 w-12 rounded-full object-cover border border-gray-200" 
                      />
                      <p className="text-xs text-gray-500 ml-2">
                        {formData.photoName}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirmez le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: colors.primary }}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 text-white font-medium rounded-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-70 shadow-sm text-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, #2A5E41)`,
                    }}
                  >
                    {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                  </button>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Déjà un compte ?{" "}
                    <a href="/login" className="font-medium hover:underline" style={{ color: colors.primary }}>
                      Connectez-vous ici
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;