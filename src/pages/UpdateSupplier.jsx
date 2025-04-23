import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateSupplier = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null); // State to hold the supplier data
  const [formData, setFormData] = useState({
    Nom: "",
    Prenom: "",
    email: "",
    Dateinsc: "",
    Entreprise: "",
    Adresse: "",
    numtel: "",
  });

  // Fetch the supplier data based on the ID
  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/getfourn/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSupplier(data);
          setFormData({
            Nom: data.Nom,
            Prenom: data.Prenom,
            email: data.email,
            Dateinsc: data.Dateinsc,
            Entreprise: data.Entreprise,
            Adresse: data.Adresse,
            numtel: data.numtel,
          });
        } else {
          console.error("Failed to fetch supplier data:", response.status);
          alert("Supplier not found");
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        alert("Error fetching supplier data");
      }
    };
    
    fetchSupplierData();
  }, [id]); // This effect runs when the component mounts or when the id changes

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit for updating supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/fournisseurs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Supplier updated successfully");
        navigate("/AdminDashboard"); // Redirect back to the dashboard after successful update
      } else {
        console.error("Failed to update supplier");
        alert("Failed to update supplier");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Error updating supplier");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-green-700 mb-4">Update Supplier</h2>
      {supplier ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="Nom"
              value={formData.Nom}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="Prenom"
              value={formData.Prenom}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Inscription</label>
            <input
              type="date"
              name="Dateinsc"
              value={formData.Dateinsc}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Entreprise</label>
            <input
              type="text"
              name="Entreprise"
              value={formData.Entreprise}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="Adresse"
              value={formData.Adresse}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de Téléphone</label>
            <input
              type="text"
              name="numtel"
              value={formData.numtel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
          >
            Update Supplier
          </button>
        </form>
      ) : (
        <p>Loading supplier data...</p>
      )}
    </div>
  );
};

export default UpdateSupplier;
