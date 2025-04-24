import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaUserTie, FaBox, FaShoppingCart, FaChartBar, FaUser, FaSignOutAlt, FaEdit, FaTrashAlt, FaExclamationCircle, FaCheckCircle, FaChartLine } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Swal from 'sweetalert2';

const COLORS = ['#22C55E', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#6B7280'];

const Dashboardadmin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null); // Store admin ID for API updates
  const [suppliers, setSuppliers] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSuppliers: 0,
    totalOrders: 0,
    totalSales: 0,
    dailyOrders: 0,
    weeklyOrders: 0,
    monthlyOrders: 0,
  });
  const [bestRatedProducts, setBestRatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    email: '',
    Adresse: '',
    numtel: '',
  });

  // Static Data for Orders
  const ordersData = [
    { id: "ORD001", client: "Ahmed Ben Salah", date: "2025-04-24", total: 1500, status: "Delivered" },
    { id: "ORD002", client: "Fatima Zohra", date: "2025-04-23", total: 2300, status: "Pending" },
    { id: "ORD003", client: "Mohamed Ali", date: "2025-04-22", total: 1800, status: "Delivered" },
    { id: "ORD004", client: "Leila Haddad", date: "2025-04-21", total: 900, status: "Canceled" },
    { id: "ORD005", client: "Youssef Trabelsi", date: "2025-04-20", total: 3200, status: "Delivered" },
  ];

  // Static Data for Statistics
  const orderTrends = [
    { name: "Daily", value: 15 },
    { name: "Weekly", value: 90 },
    { name: "Monthly", value: 350 },
  ];

  const topProducts = [
    { name: "TRACTEUR", orders: 50 },
    { name: "NEW HOLLAND TC5040", orders: 40 },
    { name: "Moissonneuse-batteuse", orders: 30 },
    { name: "Pompe à eau", orders: 25 },
    { name: "ENGRAIS NPK 20-10-10", orders: 20 },
  ];

  const supplierStats = [
    { name: "Fournitures agricoles", value: 50 },
    { name: "Équipements agricoles", value: 30 },
    { name: "Alimentation animale", value: 20 },
    { name: "Produits bio", value: 25 },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom);
      setUserId(user.id); // Assuming the user object in localStorage has an 'id' field
      setFormData({
        Nom: user.Nom || '',
        Prenom: user.Prenom || '',
        email: user.email || '',
        Adresse: user.Adresse || '',
        numtel: user.numtel || '',
      });
    }

    setIsLoading(true);
    Promise.all([
      fetch("http://localhost:3000/api/fournisseurs", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
      fetch("http://localhost:3000/api/clients", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
      fetch("http://localhost:3000/api/produits", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
      fetch("http://localhost:3000/api/admin-statistics", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
    ])
      .then(([suppliersData, clientsData, productsData, statsData]) => {
        setSuppliers(suppliersData);
        setClients(clientsData);
        setProducts(productsData);
        setStats(statsData);

        // Sort products by rating for best-rated products
        const sortedProducts = [...productsData].sort((a, b) => b.rating - a.rating).slice(0, 5);
        setBestRatedProducts(sortedProducts);

        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const deleteSupplier = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous êtes sur le point de supprimer ce fournisseur. Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/fournisseurs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error("Failed to delete fournisseur");
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      Swal.fire('Supprimé !', 'Le fournisseur a été supprimé avec succès.', 'success');
    } catch (error) {
      console.error("Error deleting fournisseur:", error);
      Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression.', 'error');
    }
  };

  const deleteClient = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous êtes sur le point de supprimer ce client. Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error("Failed to delete client");
      setClients(clients.filter(client => client.id !== id));
      Swal.fire('Supprimé !', 'Le client a été supprimé avec succès.', 'success');
    } catch (error) {
      console.error("Error deleting client:", error);
      Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression.', 'error');
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous êtes sur le point de supprimer ce produit. Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/produits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter(product => product.id !== id));
      Swal.fire('Supprimé !', 'Le produit a été supprimé avec succès.', 'success');
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression.', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      Swal.fire('Erreur', 'Utilisateur non identifié. Veuillez vous reconnecter.', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/admin/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update admin profile");

      const updatedUser = await response.json();
      setUserName(updatedUser.Prenom);
      setFormData({
        Nom: updatedUser.Nom || '',
        Prenom: updatedUser.Prenom || '',
        email: updatedUser.email || '',
        Adresse: updatedUser.Adresse || '',
        numtel: updatedUser.numtel || '',
      });
      setShowModal(false);
      Swal.fire('Succès', 'Profil mis à jour avec succès !', 'success');
    } catch (error) {
      console.error("Error updating admin profile:", error);
      Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour du profil.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 to-teal-100 font-sans">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-green-600 to-teal-600 shadow-lg border-r border-green-700 z-10">
        <h2 className="text-2xl font-bold text-center p-4 text-white border-b border-green-500">
          Welcome {userName}
        </h2>
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {[
              { tab: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
              { tab: "utilisateurs", icon: <FaUsers />, label: "Utilisateurs" },
              { tab: "fournisseurs", icon: <FaUserTie />, label: "Fournisseurs" },
              { tab: "produits", icon: <FaBox />, label: "Produits" },
              { tab: "commandes", icon: <FaShoppingCart />, label: "Commandes" },
              { tab: "statistiques", icon: <FaChartBar />, label: "Statistiques" },
              { tab: "compte", icon: <FaUser />, label: "Mon Compte" },
            ].map((item) => (
              <li
                key={item.tab}
                onClick={() => setSelectedTab(item.tab)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedTab === item.tab ? 'bg-amber-400 text-gray-900 shadow-md' : 'hover:bg-green-500 text-white'}`}
                data-tooltip-id={`sidebar-tooltip-${item.tab}`}
                data-tooltip-content={item.label}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="p-4 bg-red-500 text-white text-center font-bold hover:bg-red-600 transition-all duration-200"
        >
          <FaSignOutAlt className="inline mr-2" /> Déconnexion
        </button>
        {[
          "dashboard", "utilisateurs", "fournisseurs", "produits", "commandes", "statistiques", "compte"
        ].map((tab) => (
          <ReactTooltip key={tab} id={`sidebar-tooltip-${tab}`} place="right" effect="solid" className="text-sm" />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        {selectedTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaTachometerAlt className="mr-2 text-green-600" /> Dashboard
            </h2>
            {isLoading ? (
              <div className="text-center text-gray-500 animate-pulse">Chargement...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Total Clients", value: stats.totalClients, color: 'bg-green-600', icon: <FaUsers /> },
                    { label: "Total Fournisseurs", value: stats.totalSuppliers, color: 'bg-teal-500', icon: <FaUserTie /> },
                    { label: "Total Commandes", value: stats.totalOrders, color: 'bg-amber-500', icon: <FaShoppingCart /> },
                    { label: "Total Ventes", value: `${stats.totalSales.toLocaleString()} DT`, color: 'bg-blue-500', icon: <FaChartLine /> },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.color} text-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-all duration-200 bg-opacity-90`}
                      data-tooltip-id={`stat-tooltip-${index}`}
                      data-tooltip-content={stat.label}
                    >
                      <span className="text-3xl">{stat.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-sm">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ReactTooltip key={index} id={`stat-tooltip-${index}`} place="top" effect="solid" className="text-sm" />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {selectedTab === "utilisateurs" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaUsers className="mr-2 text-green-600" /> Liste des Utilisateurs
            </h2>
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Prénom</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Date Inscription</th>
                  <th className="py-3 px-4 text-left">Adresse</th>
                  <th className="py-3 px-4 text-left">Numéro de Téléphone</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={client.id} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-green-50" : "bg-green-100"} hover:bg-green-200 transition-all duration-200`}>
                    <td className="py-3 text-gray-800 px-4">{client.Nom}</td>
                    <td className="py-3 text-gray-800 px-4">{client.Prenom}</td>
                    <td className="py-3 text-gray-800 px-4">{client.email}</td>
                    <td className="py-3 text-gray-800 px-4">{client.Dateinsc}</td>
                    <td className="py-3 text-gray-800 px-4">{client.Adresse}</td>
                    <td className="py-3 text-gray-800 px-4">{client.numtel}</td>
                    <td className="py-3 text-gray-800 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => deleteClient(client.id)}
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

        {selectedTab === "fournisseurs" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaUserTie className="mr-2 text-green-600" /> Liste des Fournisseurs
            </h2>
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
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
                  <tr key={supplier.id} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-green-50" : "bg-green-100"} hover:bg-green-200 transition-all duration-200`}>
                    <td className="py-3 text-gray-800 px-4">{supplier.Nom}</td>
                    <td className="py-3 text-gray-800 px-4">{supplier.Prenom}</td>
                    <td className="py-3 text-gray-800 px-4">{supplier.email}</td>
                    <td className="py-3 text-gray-800 px-4">{supplier.Dateinsc}</td>
                    <td className="py-3 text-gray-800 px-4">{supplier.Entreprise}</td>
                    <td className="py-3 text-gray-800 px-4">{supplier.Adresse}</td>
                    <td className="py-3 text-gray-800 px-4">{supplier.numtel}</td>
                    <td className="py-3 text-gray-800 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
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

        {selectedTab === "produits" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaBox className="mr-2 text-green-600" /> Liste des Produits
            </h2>
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Photo</th>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Catégorie</th>
                  <th className="py-3 px-4 text-left">Prix</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-green-50" : "bg-green-100"} hover:bg-green-200 transition-all duration-200`}>
                    <td className="py-3 px-4">
                      <img
                        src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                        alt={product.Nom}
                        className="w-10 h-10 object-cover rounded-full shadow-sm"
                      />
                    </td>
                    <td className="py-3 text-gray-800 px-4">{product.Nom}</td>
                    <td className="py-3 text-gray-800 px-4">{product.categorie}</td>
                    <td className="py-3 text-gray-800 px-4">{product.prix} DT</td>
                    <td className="py-3 text-gray-800 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{product.stock}</span>
                        {product.stock <= 10 ? (
                          <FaExclamationCircle className="text-red-500" data-tooltip-id={`stock-tooltip-${product.id}`} data-tooltip-content="Stock faible" />
                        ) : (
                          <FaCheckCircle className="text-green-600" data-tooltip-id={`stock-tooltip-${product.id}`} data-tooltip-content="Stock suffisant" />
                        )}
                        <ReactTooltip id={`stock-tooltip-${product.id}`} place="top" effect="solid" className="text-sm" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => deleteProduct(product.id)}
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

        {selectedTab === "commandes" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaShoppingCart className="mr-2 text-green-600" /> Liste des Commandes
            </h2>
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID Command Vtde</th>
                  <th className="py-3 px-4 text-left">Client</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Total (DT)</th>
                  <th className="py-3 px-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order, index) => (
                  <tr key={order.id} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-green-50" : "bg-green-100"} hover:bg-green-200 transition-all duration-200`}>
                    <td className="py-3 text-gray-800 px-4">{order.id}</td>
                    <td className="py-3 text-gray-800 px-4">{order.client}</td>
                    <td className="py-3 text-gray-800 px-4">{order.date}</td>
                    <td className="py-3 text-gray-800 px-4">{order.total}</td>
                    <td className="py-3 text-gray-800 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${order.status === "Delivered" ? "bg-green-200 text-green-800" : order.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === "statistiques" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartBar className="mr-2 text-green-600" /> Statistiques
            </h2>
            {isLoading ? (
              <div className="text-center text-gray-500 animate-pulse">Chargement des statistiques...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Total Clients", value: stats.totalClients, color: 'bg-green-600', icon: <FaUsers /> },
                    { label: "Total Fournisseurs", value: stats.totalSuppliers, color: 'bg-teal-500', icon: <FaUserTie /> },
                    { label: "Total Commandes", value: stats.totalOrders, color: 'bg-amber-500', icon: <FaShoppingCart /> },
                    { label: "Total Ventes", value: `${stats.totalSales.toLocaleString()} DT`, color: 'bg-blue-500', icon: <FaChartLine /> },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.color} text-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-all duration-200 bg-opacity-90`}
                      data-tooltip-id={`stat-tooltip-${index}`}
                      data-tooltip-content={stat.label}
                    >
                      <span className="text-3xl">{stat.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-sm">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ReactTooltip key={index} id={`stat-tooltip-${index}`} place="top" effect="solid" className="text-sm" />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaShoppingCart className="mr-2 text-green-600" /> Commandes (Jour/Semaine/Mois)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-green-100 rounded-lg">
                        <p className="text-gray-600">Commandes du Jour</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.dailyOrders}</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg">
                        <p className="text-gray-600">Commandes de la Semaine</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.weeklyOrders}</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg">
                        <p className="text-gray-600">Commandes du Mois</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.monthlyOrders}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-green-600" /> Évolution des Commandes
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={orderTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                        <Line type="monotone" dataKey="value" stroke="#22C55E" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaChartBar className="mr-2 text-green-600" /> Répartition des Fournisseurs
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={supplierStats}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {supplierStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaBox className="mr-2 text-green-600" /> Top 5 Produits les Plus Commandés
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#22C55E" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaChartBar className="mr-2 text-green-600" /> Produits les Mieux Notés
                    </h3>
                    <ul className="space-y-2">
                      {bestRatedProducts.map((product) => (
                        <li key={product.id} className="flex items-center justify-between p-2 bg-green-100 rounded-lg">
                          <span className="text-gray-500">{product.Nom}</span>
                          <span className="flex items-center text-gray-500">
                            <FaChartBar className="text-amber-500 mr-1" /> {product.rating}/5
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {selectedTab === "compte" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaUser className="mr-2 text-green-600" /> Mon Compte
            </h2>
            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg max-w-2xl mx-auto transform hover:shadow-xl transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {formData.Nom} {formData.Prenom}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center">
                    <FaUser className="mr-2 text-green-600" /> Admin
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <p className="flex items-center">
                  <FaUser className="mr-2 text-green-600" /> <strong>Email:</strong> {formData.email}
                </p>
                <p className="flex items-center">
                  <FaUser className="mr-2 text-green-600" /> <strong>Adresse:</strong> {formData.Adresse}
                </p>
                <p className="flex items-center">
                  <FaUser className="mr-2 text-green-600" /> <strong>Téléphone:</strong> {formData.numtel}
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaEdit className="mr-2" /> Modifier le Profil
              </button>
            </div>

            {/* Modal for Editing Profile */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Modifier le Profil</h3>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nom">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="Nom"
                        value={formData.Nom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Prenom">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="Prenom"
                        value={formData.Prenom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Adresse">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="Adresse"
                        value={formData.Adresse}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numtel">
                        Numéro de Téléphone
                      </label>
                      <input
                        type="text"
                        name="numtel"
                        value={formData.numtel}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardadmin;