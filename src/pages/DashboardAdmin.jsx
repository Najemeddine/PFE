import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserTie, FaBox, FaShoppingCart, FaChartBar, FaUser, FaSignOutAlt, FaEdit, FaTrashAlt, FaExclamationCircle, FaCheckCircle, FaChartLine, FaSave, FaTimes } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Swal from 'sweetalert2';

const COLORS = ['#22C55E', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#6B7280'];

const Dashboardadmin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("statistiques");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSuppliers: 0,
    totalOrders: 0,
    totalSales: 0,
    dailyOrders: 0,
    weeklyOrders: 0,
    monthlyOrders: 0,
    orderTrends: [],
    topProducts: [],
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

  const [supplierStats, setSupplierStats] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.Prenom);
      setUserId(user.id);
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
      fetch("http://localhost:3000/api/commandes", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
      fetch("http://localhost:3000/api/admin-statistics", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
      fetch("http://localhost:3000/api/supplier-statistics", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
    ])
      .then(([suppliersData, clientsData, productsData, ordersData, statsData, supplierStatsData]) => {
        setSuppliers(suppliersData);
        setClients(clientsData);
        setProducts(productsData);
        setOrders(ordersData);
        setStats(statsData);
        const sortedProducts = [...productsData].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
        setBestRatedProducts(sortedProducts);
        setSupplierStats(supplierStatsData); // New state for supplier stats
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Erreur de date";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getFournisseurName = (fournisseurId) => {
    const fournisseur = suppliers.find(s => s.id === fournisseurId);
    return fournisseur ? `${fournisseur.Nom} ${fournisseur.Prenom}` : 'Inconnu';
  };

  const tableContainerStyles = "bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-[1200px] mx-auto";
  const tableStyles = "w-full table-fixed border-collapse";
  const thStyles = "py-3 px-2 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap";
  const tdStyles = "py-3 px-2 border-b text-left border-gray-200 text-[#2F4F4F]";

  return (
    <div className="min-h-screen bg-[#f9f9f9f8] text-gray-900 font-sans flex">
      <div className="fixed left-0 top-0 h-full w-64 bg-[#2F4F4F] text-white shadow-lg z-10">
        <h2 className="text-2xl font-extrabold text-center p-4 border-b border-[#6B8E23]">
          Welcome {userName}
        </h2>
        <nav className="p-4">
          <ul className="space-y-3">
            {[
              { tab: "statistiques", icon: <FaChartBar />, label: "Statistiques" },
              { tab: "utilisateurs", icon: <FaUsers />, label: "Utilisateurs" },
              { tab: "fournisseurs", icon: <FaUserTie />, label: "Fournisseurs" },
              { tab: "produits", icon: <FaBox />, label: "Produits" },
              { tab: "commandes", icon: <FaShoppingCart />, label: "Commandes" },
              { tab: "compte", icon: <FaUser />, label: "Mon Compte" },
            ].map((item) => (
              <li
                key={item.tab}
                onClick={() => setSelectedTab(item.tab)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedTab === item.tab
                  ? 'bg-[#FFC107] text-[#2F4F4F] shadow-md'
                  : 'hover:bg-[#6B8E23] text-white'
                  }`}
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
          className="p-4 bg-red-500 text-white text-center font-bold hover:bg-red-600 transition-all duration-300 w-full"
          data-tooltip-id="logout-tooltip"
          data-tooltip-content="Se déconnecter"
        >
          <FaSignOutAlt className="inline mr-2" /> Déconnexion
        </button>
        {[
          "statistiques", "utilisateurs", "fournisseurs", "produits", "commandes", "compte"
        ].map((tab) => (
          <ReactTooltip key={tab} id={`sidebar-tooltip-${tab}`} place="right" effect="solid" className="text-sm" />
        ))}
        <ReactTooltip id="logout-tooltip" place="top" effect="solid" className="text-sm" />
      </div>

      <div className="flex-1 p-6 ml-64 max-w-7xl mx-auto">
        {selectedTab === "statistiques" && (
          <div>
            <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
              <FaChartBar className="mr-2 text-[#6B8E23]" /> Statistiques
            </h2>
            {isLoading ? (
              <div className="text-center text-gray-500 animate-pulse">Chargement des statistiques...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Total Clients", value: stats.totalClients, color: 'bg-[#6B8E23]', icon: <FaUsers /> },
                    { label: "Total Fournisseurs", value: stats.totalSuppliers, color: 'bg-[#2F4F4F]', icon: <FaUserTie /> },
                    { label: "Total Commandes", value: stats.totalOrders, color: 'bg-[#FFC107]', icon: <FaShoppingCart /> },
                    { label: "Total Ventes", value: `${stats.totalSales.toLocaleString()} DT`, color: 'bg-[#A9CBA4]', icon: <FaChartLine /> },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.color} text-white p-6 rounded-xl shadow-xl flex items-center space-x-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-[#6B8E23]" /> Évolution des Commandes
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.orderTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#6B8E23" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                      <FaChartBar className="mr-2 text-[#6B8E23]" /> Répartition des Fournisseurs
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={supplierStats} dataKey="value" nameKey="name" outerRadius={100} label>
                          {supplierStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                      <FaShoppingCart className="mr-2 text-[#6B8E23]" /> Commandes par Période
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#F9F9F9] rounded-lg">
                        <p className="text-[#2F4F4F] font-medium">Commandes du Jour</p>
                        <p className="text-2xl font-bold text-[#2F4F4F]">{stats.dailyOrders}</p>
                      </div>
                      <div className="p-4 bg-[#F9F9F9] rounded-lg">
                        <p className="text-[#2F4F4F] font-medium">Commandes de la Semaine</p>
                        <p className="text-2xl font-bold text-[#2F4F4F]">{stats.weeklyOrders}</p>
                      </div>
                      <div className="p-4 bg-[#F9F9F9] rounded-lg">
                        <p className="text-[#2F4F4F] font-medium">Commandes du Mois</p>
                        <p className="text-2xl font-bold text-[#2F4F4F]">{stats.monthlyOrders}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                      <FaBox className="mr-2 text-[#6B8E23]" /> Top 5 Produits les Plus Commandés
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#6B8E23" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {selectedTab === "utilisateurs" && (
          <div>
            <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
              <FaUsers className="mr-2 text-[#6B8E23]" /> Liste des Utilisateurs
            </h2>
            <div className={tableContainerStyles}>
              <div className="overflow-x-auto">
                <table className={tableStyles}>
                  <thead className="bg-[#2F4F4F] text-white">
                    <tr>
                      <th className={`${thStyles} w-[14%]`}>Nom</th>
                      <th className={`${thStyles} w-[14%]`}>Prénom</th>
                      <th className={`${thStyles} w-[18%]`}>Email</th>
                      <th className={`${thStyles} w-[14%]`}>Date Inscription</th>
                      <th className={`${thStyles} w-[18%]`}>Adresse</th>
                      <th className={`${thStyles} w-[14%]`}>Téléphone</th>
                      <th className={`${thStyles} w-[8%] text-center`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => (
                      <tr
                        key={client.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'} hover:bg-gray-100 transition-all duration-200`}
                      >
                        <td className={`${tdStyles} font-medium`}>{client.Nom}</td>
                        <td className={tdStyles}>{client.Prenom}</td>
                        <td className={tdStyles}>{client.email}</td>
                        <td className={tdStyles}>{formatDate(client.Dateinsc)}</td>
                        <td className={tdStyles}>{client.Adresse}</td>
                        <td className={tdStyles}>{client.numtel}</td>
                        <td className={`${tdStyles} text-center`}>
                          <button
                            onClick={() => deleteClient(client.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                            data-tooltip-id={`delete-client-tooltip-${client.id}`}
                            data-tooltip-content="Supprimer le client"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                          <ReactTooltip id={`delete-client-tooltip-${client.id}`} place="top" effect="solid" className="text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "fournisseurs" && (
          <div>
            <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
              <FaUserTie className="mr-2 text-[#6B8E23]" /> Liste des Fournisseurs
            </h2>
            <div className={tableContainerStyles}>
              <div className="overflow-x-auto w-full">
                <table className={`${tableStyles} min-w-full`}>
                  <thead className="bg-[#2F4F4F] text-white">
                    <tr>
                      <th className={`${thStyles} w-[12%]`}>Nom</th>
                      <th className={`${thStyles} w-[12%]`}>Prénom</th>
                      <th className={`${thStyles} w-[20%]`}>Email</th>
                      <th className={`${thStyles} w-[10%]`}>Date</th>
                      <th className={`${thStyles} w-[12%]`}>Entreprise</th>
                      <th className={`${thStyles} w-[14%]`}>Adresse</th>
                      <th className={`${thStyles} w-[10%]`}>Téléphone</th>
                      <th className={`${thStyles} w-[8%] text-center`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier, index) => (
                      <tr
                        key={supplier.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'} hover:bg-gray-100 transition-all duration-200`}
                      >
                        <td className={`${tdStyles} font-medium`}>{supplier.Nom}</td>
                        <td className={tdStyles}>{supplier.Prenom}</td>
                        <td className={`${tdStyles} break-words`}>{supplier.email}</td>
                        <td className={tdStyles}>{formatDate(supplier.Dateinsc)}</td>
                        <td className={tdStyles}>{supplier.Entreprise}</td>
                        <td className={tdStyles}>{supplier.Adresse}</td>
                        <td className={tdStyles}>{supplier.numtel}</td>
                        <td className={`${tdStyles} text-center`}>
                          <button
                            onClick={() => deleteSupplier(supplier.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                            data-tooltip-id={`delete-supplier-tooltip-${supplier.id}`}
                            data-tooltip-content="Supprimer le fournisseur"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                          <ReactTooltip id={`delete-supplier-tooltip-${supplier.id}`} place="top" effect="solid" className="text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "produits" && (
          <div>
            <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
              <FaBox className="mr-2 text-[#6B8E23]" /> Liste des Produits
            </h2>
            <div className={tableContainerStyles}>
              <div className="overflow-x-auto">
                <table className={tableStyles}>
                  <thead className="bg-[#2F4F4F] text-white">
                    <tr>
                      <th className={`${thStyles} w-[10%]`}>Photo</th>
                      <th className={`${thStyles} w-[20%]`}>Nom</th>
                      <th className={`${thStyles} w-[15%]`}>Catégorie</th>
                      <th className={`${thStyles} w-[15%]`}>Fournisseur</th>
                      <th className={`${thStyles} w-[15%]`}>Prix</th>
                      <th className={`${thStyles} w-[15%]`}>Stock</th>
                      <th className={`${thStyles} w-[10%] text-center`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr
                        key={product.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'} hover:bg-gray-100 transition-all duration-200`}
                      >
                        <td className={tdStyles}>
                          <img
                            src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                            alt={product.Nom}
                            className="w-10 h-10 object-cover rounded-full shadow-sm"
                          />
                        </td>
                        <td className={`${tdStyles} font-medium`}>{product.Nom}</td>
                        <td className={tdStyles}>{product.categorie}</td>
                        <td className={tdStyles}>{getFournisseurName(product.fournisseur)}</td>
                        <td className={tdStyles}>{product.prix} DT</td>
                        <td className={tdStyles}>
                          <div className="flex items-center space-x-2">
                            <span>{product.stock}</span>
                            {product.stock <= 10 ? (
                              <FaExclamationCircle
                                className="text-red-500"
                                data-tooltip-id={`stock-tooltip-${product.id}`}
                                data-tooltip-content="Stock faible"
                              />
                            ) : (
                              <FaCheckCircle
                                className="text-[#6B8E23]"
                                data-tooltip-id={`stock-tooltip-${product.id}`}
                                data-tooltip-content="Stock suffisant"
                              />
                            )}
                            <ReactTooltip id={`stock-tooltip-${product.id}`} place="top" effect="solid" className="text-sm" />
                          </div>
                        </td>
                        <td className={`${tdStyles} text-center`}>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                            data-tooltip-id={`delete-product-tooltip-${product.id}`}
                            data-tooltip-content="Supprimer le produit"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                          <ReactTooltip id={`delete-product-tooltip-${product.id}`} place="top" effect="solid" className="text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "commandes" && (
          <div>
            <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
              <FaShoppingCart className="mr-2 text-[#6B8E23]" /> Liste des Commandes
            </h2>
            <div className={tableContainerStyles}>
              <div className="overflow-x-auto">
                <table className={tableStyles}>
                  <thead className="bg-[#2F4F4F] text-white">
                    <tr>
                      <th className={`${thStyles} w-[15%]`}>ID Commande</th>
                      <th className={`${thStyles} w-[20%]`}>Client</th>
                      <th className={`${thStyles} w-[15%]`}>Date</th>
                      <th className={`${thStyles} w-[15%]`}>Total (DT)</th>
                      <th className={`${thStyles} w-[20%]`}>Produits</th>
                      <th className={`${thStyles} w-[15%]`}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'} hover:bg-gray-100 transition-all duration-200`}
                      >
                        <td className={`${tdStyles} font-medium`}>{order.id}</td>
                        <td className={tdStyles}>{order.Client}</td>
                        <td className={tdStyles}>{formatDate(order.date_creation)}</td>
                        <td className={tdStyles}>{order.total}</td>
                        <td className={tdStyles}>
                          {order.produits && order.produits.length > 0 ? (
                            order.produits.map((produit, idx) => (
                              <span key={idx}>
                                {produit.Nom}
                                {idx < order.produits.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          ) : (
                            <span>Aucun produit</span>
                          )}
                        </td>
                        <td className={tdStyles}>
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold ${order.status === 2
                              ? "bg-[#A9CBA4] text-[#2F4F4F]"
                              : order.status === 1
                                ? "bg-[#FFC107] text-[#2F4F4F]"
                                : "bg-red-200 text-red-800"
                              }`}
                          >
                            {order.status === 1 ? "En Attente" : order.status === 2 ? "Livrée" : "Annulé"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "compte" && (
          <div>
            <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
              <FaUser className="mr-2 text-[#6B8E23]" /> Mon Compte
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-[#2F4F4F]">
                      {formData.Nom} {formData.Prenom}
                    </h3>
                    <p className="text-[#2F4F4F] text-sm">Administrateur</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2F4F4F]">
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> <strong>Nom:</strong> {formData.Nom}
                  </p>
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> <strong>Prénom:</strong> {formData.Prenom}
                  </p>
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> <strong>Email:</strong> {formData.email}
                  </p>
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> <strong>Adresse:</strong> {formData.Adresse || 'Non spécifié'}
                  </p>
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> <strong>Téléphone:</strong> {formData.numtel || 'Non spécifié'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center px-4 py-2 bg-[#FFC107] text-[#2F4F4F] rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-md hover:shadow-lg"
                  data-tooltip-id="edit-profile-tooltip"
                  data-tooltip-content="Modifier votre profil"
                >
                  <FaEdit className="mr-2" /> Modifier le Profil
                </button>
                <ReactTooltip id="edit-profile-tooltip" place="top" effect="solid" className="text-sm" />
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
              <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4 flex items-center">
                <FaEdit className="mr-2 text-[#6B8E23]" /> Modifier le Profil
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> Nom
                  </label>
                  <input
                    type="text"
                    name="Nom"
                    value={formData.Nom}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> Prénom
                  </label>
                  <input
                    type="text"
                    name="Prenom"
                    value={formData.Prenom}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> Adresse
                  </label>
                  <input
                    type="text"
                    name="Adresse"
                    value={formData.Adresse}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                    <FaUser className="mr-2 text-[#6B8E23]" /> Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    name="numtel"
                    value={formData.numtel}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#55701C] transition-all duration-300 shadow-md hover:shadow-lg"
                    data-tooltip-id="save-profile-tooltip"
                    data-tooltip-content="Enregistrer les modifications"
                  >
                    <FaSave className="mr-2" /> Enregistrer
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    data-tooltip-id="cancel-profile-tooltip"
                    data-tooltip-content="Annuler les modifications"
                  >
                    <FaTimes className="mr-2" /> Annuler
                  </button>
                </div>
                <ReactTooltip id="save-profile-tooltip" place="top" effect="solid" className="text-sm" />
                <ReactTooltip id="cancel-profile-tooltip" place="top" effect="solid" className="text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardadmin;