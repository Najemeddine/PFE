import React, { useState } from "react";

const AjouterFournisseur = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    Nom: "",
    Prenom: "",
    Dateinsc: "",
    Adresse: "",
    numtel: "",
    typeuser: "fournisseur", // automatically set to 'fournisseur'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/fournisseurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        // Optionally reset the form after submission
        setFormData({
          email: "",
          password: "",
          Nom: "",
          Prenom: "",
          Dateinsc: "",
          Adresse: "",
          numtel: "",
          typeuser: "fournisseur",
        });
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Ajouter un Fournisseur</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            name="Nom"
            value={formData.Nom}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Prénom</label>
          <input
            type="text"
            name="Prenom"
            value={formData.Prenom}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mot de Passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date d'inscription</label>
          <input
            type="date"
            name="Dateinsc"
            value={formData.Dateinsc}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Adresse</label>
          <input
            type="text"
            name="Adresse"
            value={formData.Adresse}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Numéro de Téléphone</label>
          <input
            type="text"
            name="numtel"
            value={formData.numtel}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Hidden input for typeuser */}
        <input type="hidden" name="typeuser" value={formData.typeuser} />

        <div className="mb-4 text-center">
          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Ajouter Fournisseur
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterFournisseur;
