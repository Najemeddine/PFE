import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#4CAF50", "#6b7280", "#ff9800", "#2196F3", "#e91e63", "#00bcd4"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("statistiques");
  const [userName, setUserName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Nom);
    }
  }, []);

  const productStats = [
    { name: "Fournitures agricoles", value: 120 },
    { name: "Équipements agricoles", value: 80 },
    { name: "Alimentation animale", value: 50 },
    { name: "Produits bio", value: 70 },
  ];

  const salesData = [
    { month: "Jan", ventes: 3000 },
    { month: "Fév", ventes: 4500 },
    { month: "Mar", ventes: 3200 },
    { month: "Avr", ventes: 5000 },
    { month: "Mai", ventes: 4000 },
    { month: "Juin", ventes: 5500 },
  ];

  const [products, setProducts] = useState([
    { id: 1, name: "Tracteur agricole", category: "Équipements agricoles", price: "25,000€" },
    { id: 2, name: "Engrais bio", category: "Produits bio", price: "200€" },
    { id: 3, name: "Semences de blé", category: "Fournitures agricoles", price: "150€" },
    { id: 4, name: "Aliments pour bétail", category: "Alimentation animale", price: "300€" },
  ]);

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white flex flex-col">
        <h2 className="text-xl font-bold text-center p-4 border-b border-green-500">
          Welcome {userName}
        </h2>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li
              onClick={() => setSelectedTab("produits")}
              className={`p-2 rounded-md cursor-pointer hover:bg-green-500 transition ${
                selectedTab === "produits" && "bg-green-500"
              }`}
            >
              📦 Liste des Produits
            </li>
            <li
              onClick={() => setSelectedTab("statistiques")}
              className={`p-2 rounded-md cursor-pointer hover:bg-green-500 transition ${
                selectedTab === "statistiques" && "bg-green-500"
              }`}
            >
              📊 Statistiques
            </li>
            <li
              onClick={() => setSelectedTab("compte")}
              className={`p-2 rounded-md cursor-pointer hover:bg-green-500 transition ${
                selectedTab === "compte" && "bg-green-500"
              }`}
            >
              👤 Mon Compte
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
        {selectedTab === "statistiques" && (
          <div>
            <h2 className="text-3xl font-semibold text-green-700 mb-6">📊 Statistiques des Produits</h2>

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
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition des Produits</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productStats}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {productStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold text-green-700">320</h3>
                <p className="text-gray-600">Produits en stock</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold text-green-700">1500</h3>
                <p className="text-gray-600">Commandes passées</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold text-green-700">120</h3>
                <p className="text-gray-600">Clients actifs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold text-green-700">85%</h3>
                <p className="text-gray-600">Taux de satisfaction</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "produits" && (
          <div>
            <h2 className="text-3xl font-semibold text-green-700 mb-4">📦 Liste des Produits</h2>

            <button className="mb-4 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
              ➕ Ajouter un Produit
            </button>

            <table className="min-w-full bg-white border border-gray-300 shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border">Nom</th>
                  <th className="py-2 px-4 border">Catégorie</th>
                  <th className="py-2 px-4 border">Prix</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="text-center">
                    <td className="py-2 px-4 border">{product.name}</td>
                    <td className="py-2 px-4 border">{product.category}</td>
                    <td className="py-2 px-4 border">{product.price}</td>
                    <td className="py-2 px-4 border">
                      <button className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                        ✏ Modifier
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        ❌ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === "compte" && (
          <div>
            <h2 className="text-3xl font-semibold text-green-700">👤 Mon Compte</h2>
            <p className="text-gray-600 mt-2">(Informations sur le compte à venir...)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
