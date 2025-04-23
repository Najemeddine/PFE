import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Dashboardadmin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("fournisseurs");
  const [suppliers, setSuppliers] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom);
    }
  }, []);
  // Données fictives pour les statistiques
  const supplierStats = [
    { name: "Fournitures agricoles", value: 50 },
    { name: "Équipements agricoles", value: 30 },
    { name: "Alimentation animale", value: 20 },
    { name: "Produits bio", value: 25 }
  ];

  const salesData = [
    { month: "Jan", ventes: 4000 },
    { month: "Feb", ventes: 3000 },
    { month: "Mar", ventes: 2000 },
    { month: "Apr", ventes: 2780 },
    { month: "May", ventes: 1890 },
    { month: "Jun", ventes: 2390 }
  ];

  // Fetch suppliers from API
  useEffect(() => {
    fetch("http://localhost:3000/api/fournisseurs")
      .then((response) => response.json())
      .then((data) => setSuppliers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const deleteSupplier = async (id) => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?");
    
    if (!isConfirmed) {
      return; // Don't proceed if the user canceled
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/deletefourn/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete fournisseur");
      }
  
      const data = await response.json();
      console.log(data.message);
  
      // After successful deletion, refetch the data or reload the page
      fetchSuppliers();  // Re-fetch the list of suppliers
    } catch (error) {
      console.error("Error deleting fournisseur:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fournisseurs");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white flex flex-col">
        <h2 className="text-2xl font-bold text-center p-4 border-b border-green-500">
       Welcome {userName} 
        
        </h2>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li
              onClick={() => setSelectedTab("fournisseurs")}
              className={`p-2 rounded-md cursor-pointer hover:bg-green-500 transition ${selectedTab === "fournisseurs" && "bg-green-500"}`}
            >
              🏢 Liste des Fournisseurs
            </li>
            <li
              onClick={() => setSelectedTab("statistiques")}
              className={`p-2 rounded-md cursor-pointer hover:bg-green-500 transition ${selectedTab === "statistiques" && "bg-green-500"}`}
            >
              📊 Statistiques
            </li>
          </ul>
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="p-4 bg-red-500 text-white text-center font-bold hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        {selectedTab === "fournisseurs" && (
          <div>
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              🏢 Liste des Fournisseurs
            </h2>
            <button
              onClick={() => navigate("/add-fournisseur")}
              className="mb-4 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
            >
              ➕ Ajouter un Fournisseur
            </button>
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Prénom</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Date Inscription</th>
                  <th className="py-3 px-4 text-left">Entreprise</th>
                  <th className="py-3 px-4 text-left">Adresse</th>
                  <th className="py-3 px-4 text-left">Numéro de Téléphone</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, index) => (
                  <tr key={supplier.id} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                    <td className="py-3 px-4">{supplier.Nom}</td>
                    <td className="py-3 px-4">{supplier.Prenom}</td>
                    <td className="py-3 px-4">{supplier.email}</td>
                    <td className="py-3 px-4">{supplier.Dateinsc}</td>
                    <td className="py-3 px-4">{supplier.Entreprise}</td>
                    <td className="py-3 px-4">{supplier.Adresse}</td>
                    <td className="py-3 px-4">{supplier.numtel}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                      <button 
  onClick={() => navigate(`/update-fournisseur/${supplier.id}`)} 
  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 shadow-md"
  title="Modifier"
>
  <FaEdit size={16} />
</button>

<button 
  onClick={() => deleteSupplier(supplier.id)} 
  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow-md"
  title="Supprimer"
>
  <FaTrashAlt size={16} />
</button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === "statistiques" && (
          <div>
            <h2 className="text-3xl font-semibold text-green-700 mb-6">📊 Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Ventes Mensuelles</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventes" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition des Fournisseurs</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={supplierStats} dataKey="value" nameKey="name" outerRadius={100} label>
                      <Cell fill="#4CAF50" />
                      <Cell fill="#6b7280" />
                      <Cell fill="#ff9800" />
                      <Cell fill="#2196F3" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardadmin;
