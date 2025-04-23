import React, { useState } from "react";
import registerBackground from "../assets/images/nature.png";
import clientIcon from "../assets/images/client-icon.png";
import fournisseurIcon from "../assets/images/fournisseur-icon.png";

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
    photo: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      
      setFormData({
        ...formData,
        photo: file
      });
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

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas!");
      return;
    }

    // Vérifier que la date d'inscription n'est pas dans le futur
    const inscDate = new Date(formData.Dateinsc);
    const currentDate = new Date();
    if (inscDate > currentDate) {
      setError("La date d'inscription ne peut pas être dans le futur!");
      return;
    }

    // Créer un FormData pour gérer l'upload de fichier
    const formDataToSend = new FormData();
    
    // Ajouter le matricule pour les fournisseurs
    let matricule = "";
    if (userType === "fournisseur") {
      matricule = generateMatricule();
      formDataToSend.append("matricule", matricule);
    }

    // Ajouter tous les champs du formulaire
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword' && key !== 'photo') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Ajouter la photo si présente
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }
    
    // Ajouter le type d'utilisateur
    formDataToSend.append("typeuser", userType);

    try {
      // Déterminer l'URL de l'API selon le type d'utilisateur
      let apiUrl = "http://localhost:3000/api/register";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDataToSend, // Envoyer FormData au lieu de JSON
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "L'inscription a échoué");

      // Message de succès spécifique pour les fournisseurs (mention du matricule envoyé par email)
      if (userType === "fournisseur") {
        setSuccess("Inscription réussie ! Un email contenant votre matricule vous a été envoyé. Redirection vers la page de connexion...");
      } else {
        setSuccess("Inscription réussie ! Redirection vers la page de connexion...");
      }
      
      setTimeout(() => (window.location.href = "/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Si le type d'utilisateur n'est pas encore choisi, afficher la sélection
  if (!userType) {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${registerBackground})` }}
      >
        <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl max-w-lg w-full border border-green-300">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
            Bienvenue sur WeeFarm
          </h2>
          
          <p className="text-center text-gray-600 mb-8">
            Choisissez votre type de compte pour commencer
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div 
              className="border-2 border-green-200 hover:border-green-500 rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all hover:bg-green-50"
              onClick={() => setUserType("client")}
            >
              <img 
                src={clientIcon} 
                alt="Client" 
                className="w-32 h-32 mb-4" 
              />
              <h3 className="text-xl font-semibold text-green-700">Client</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Achetez des produits agricoles
              </p>
            </div>
            
            <div 
              className="border-2 border-green-200 hover:border-green-500 rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all hover:bg-green-50"
              onClick={() => setUserType("fournisseur")}
            >
              <img 
                src={fournisseurIcon} 
                alt="Fournisseur" 
                className="w-32 h-32 mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700">Fournisseur</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Vendez vos produits agricoles
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <a href="/login" className="text-green-600 hover:underline">
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
      className="fixed inset-0 bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${registerBackground})` }}
    >
      <div className="flex items-center justify-center min-h-screen py-10">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl max-w-md w-full border border-green-300 my-8">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            {userType === "client" ? "Créer un compte client" : "Créer un compte fournisseur"}
          </h2>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Prénom
                </label>
                <input
                  type="text"
                  name="Prenom"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  value={formData.Prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nom
                </label>
                <input
                  type="text"
                  name="Nom"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  value={formData.Nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {userType === "fournisseur" && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email professionnel
                </label>
                <input
                  type="email"
                  name="emailPro"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  value={formData.emailPro}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Adresse
              </label>
              <input
                type="text"
                name="Adresse"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.Adresse}
                onChange={handleChange}
                required
              />
            </div>

            {userType === "fournisseur" && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Adresse de l'entreprise
                </label>
                <input
                  type="text"
                  name="Entreprise"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  value={formData.Entreprise}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Numéro de téléphone
              </label>
              <input
                type="text"
                name="numtel"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.numtel}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Date de naissance
              </label>
              <input
                type="date"
                name="dateNaissance"
                max={today}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Date d'inscription
              </label>
              <input
                type="date"
                name="Dateinsc"
                max={today}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.Dateinsc}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Genre
              </label>
              <select
                name="genre"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Photo de profil (JPG ou PNG uniquement)
              </label>
              <input
                type="file"
                name="photo"
                accept=".jpg,.jpeg,.png"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirmez le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType(null)}
                className="w-1/3 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-all"
              >
                Retour
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;