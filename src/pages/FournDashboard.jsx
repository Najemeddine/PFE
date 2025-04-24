import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaChartBar, FaBox, FaUser, FaExclamationCircle, FaCheckCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaIdCard, FaStar, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const COLORS = ['#22C55E', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#6B7280'];

const FournDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('statistiques');
  const [userData, setUserData] = useState({
    id: '',
    Nom: '',
    Prenom: '',
    email: '',
    emailPro: '',
    Adresse: '',
    numtel: '',
    dateNaissance: '',
    genre: '',
    Entreprise: '',
    matricule: '',
    photo: '',
  });
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    avgRating: 0,
  });
  const [bestRatedProducts, setBestRatedProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [newProduct, setNewProduct] = useState({
    Nom: '',
    categorie: '',
    prix: '',
    description: '',
    photo: '',
    stock: '',
  });

  const salesData = [
    { name: 'Daily', value: 15 },
    { name: 'Weekly', value: 90 },
    { name: 'Monthly', value: 350 },
  ];
  const topProducts = [
    { name: 'TRACTEUR', sales: 50 },
    { name: 'NEW HOLLAND TC5040', sales: 40 },
    { name: 'Moissonneuse-batteuse', sales: 30 },
    { name: 'Pompe à eau', sales: 25 },
    { name: 'ENGRAIS NPK 20-10-10', sales: 20 },
  ];

  const productStats = [
    { name: 'Fournitures agricoles', value: 120 },
    { name: 'Équipements agricoles', value: 80 },
    { name: 'Alimentation animale', value: 50 },
    { name: 'Produits bio', value: 70 },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData({
        id: user.id || '',
        Nom: user.Nom || '',
        Prenom: user.Prenom || '',
        email: user.email || '',
        emailPro: user.emailPro || '',
        Adresse: user.Adresse || '',
        numtel: user.numtel || '',
        dateNaissance: user.dateNaissance || '',
        genre: user.genre || '',
        Entreprise: user.Entreprise || '',
        matricule: user.matricule || '',
        photo: user.photo || '',
      });

      setIsLoading(true);
      Promise.all([
        fetch(`http://localhost:3000/api/produits?fournisseur=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((res) => {
          if (!res.ok) throw new Error('Failed to fetch products');
          return res.json();
        }),
        fetch(`http://localhost:3000/api/statistics?fournisseur=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((res) => {
          if (!res.ok) throw new Error('Failed to fetch statistics');
          return res.json();
        }),
      ])
        .then(([productsData, statsData]) => {
          setProducts(productsData);
          setStats(statsData);
          const sortedProducts = [...productsData].sort((a, b) => b.rating - a.rating).slice(0, 5);
          setBestRatedProducts(sortedProducts);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setIsLoading(false);
        });
    }
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/fournisseurs/${userData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then(() => {
        localStorage.setItem('user', JSON.stringify(userData));
        setIsEditing(false);
      })
      .catch((err) => console.error('Error updating profile:', err));
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:3000/api/produits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
        setShowDeleteConfirmModal(false);
        setProductIdToDelete(null);
      })
      .catch((err) => console.error('Error deleting product:', err));
  };

  const confirmDeleteProduct = (id) => {
    setProductIdToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const editProduct = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const productData = {
      ...newProduct,
      fournisseur: user.id,
    };

    fetch('http://localhost:3000/api/produits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(productData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, { id: data.id, ...productData }]);
        setNewProduct({
          Nom: '',
          categorie: '',
          prix: '',
          description: '',
          photo: '',
          stock: '',
        });
        setShowAddProductModal(false);
      })
      .catch((err) => console.error('Error adding product:', err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 font-sans flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-16 h-full w-64 bg-gradient-to-b from-green-600 to-teal-600 shadow-lg border-r border-green-700 z-10">
        <nav className="p-4">
          <ul className="space-y-3">
            {[
              { tab: 'statistiques', icon: <FaChartBar />, label: 'Statistiques' },
              { tab: 'produits', icon: <FaBox />, label: 'Produits' },
              { tab: 'compte', icon: <FaUser />, label: 'Compte' },
            ].map((item) => (
              <li
                key={item.tab}
                onClick={() => setSelectedTab(item.tab)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedTab === item.tab ? 'bg-amber-400 text-gray-900 shadow-md' : 'hover:bg-green-500 text-white'}`}
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content={item.label}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        <ReactTooltip id="sidebar-tooltip" place="right" effect="solid" className="text-sm" />
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 ml-64 w-full p-6">
        <NavBar />
        <div className="mt-4">
          {selectedTab === 'statistiques' && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="mr-2 text-green-600" /> Statistiques des Produits
              </h2>
              {isLoading ? (
                <div className="text-center text-gray-500 animate-pulse">Chargement des statistiques...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Produits Publiés', value: stats.totalProducts, color: 'bg-green-600', icon: <FaBox /> },
                      { label: 'En Rupture', value: stats.outOfStock, color: 'bg-red-500', icon: <FaExclamationCircle /> },
                      { label: 'Note Moyenne', value: (stats.avgRating && !isNaN(Number(stats.avgRating)) ? Number(stats.avgRating).toFixed(1) : '0.0') + '/5', color: 'bg-amber-500', icon: <FaStar /> },
                      { label: 'Revenu Total', value: `${stats.totalRevenue.toLocaleString()}DT`, color: 'bg-teal-500', icon: <FaDollarSign /> },
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
                    <ReactTooltip id="stat-tooltip-0" place="top" effect="solid" className="text-sm" />
                    <ReactTooltip id="stat-tooltip-1" place="top" effect="solid" className="text-sm" />
                    <ReactTooltip id="stat-tooltip-2" place="top" effect="solid" className="text-sm" />
                    <ReactTooltip id="stat-tooltip-3" place="top" effect="solid" className="text-sm" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartBar className="mr-2 text-green-600" /> Répartition des Produits
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={productStats} dataKey="value" nameKey="name" outerRadius={100} label>
                            {productStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-green-600" /> Ventes (Journalier/Hebdo/Mensuel)
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#22C55E" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaStar className="mr-2 text-amber-500" /> Produits les Mieux Notés
                      </h3>
                      <ul className="space-y-2">
                        {bestRatedProducts.map((product) => (
                          <li key={product.id} className="flex items-center justify-between p-2 bg-green-100 rounded-lg">
                            <span className='text-gray-500'>{product.Nom}</span>
                            <span className="flex items-center text-gray-500">
                              <FaStar className="text-amber-500 mr-1" /> {product.rating}/5
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartBar className="mr-2 text-green-600" /> Top 5 Produits les Plus Vendus
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" fill="#22C55E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {selectedTab === 'produits' && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaBox className="mr-2 text-green-600" /> Liste des Produits
              </h2>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="mb-6 flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                data-tooltip-id="add-product-tooltip"
                data-tooltip-content="Ajouter un nouveau produit"
              >
                <FaPlus className="mr-2" /> Ajouter un Produit
              </button>
              <ReactTooltip id="add-product-tooltip" place="top" effect="solid" className="text-sm" />
              <div className="rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Photo</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Nom</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Catégorie</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Prix</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Stock</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className={`${index % 2 === 0 ? 'bg-gradient-to-r from-green-50 to-teal-50' : 'bg-gradient-to-r from-green-100 to-teal-100'} hover:bg-green-200 transition-all duration-200`}
                        >
                          <td className="py-3 px-4 border-b border-gray-200">
                            <img
                              src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                              alt={product.Nom}
                              className="w-10 h-10 object-cover rounded-full shadow-sm"
                            />
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200 text-gray-800 font-medium">{product.Nom}</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-gray-600">{product.categorie}</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-gray-600">{product.prix}DT</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-gray-600 max-w-xs truncate">{product.description || 'Aucune description'}</td>
                          <td className="py-3 px-4 border-b border-gray-200">
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
                          <td className="py-3 px-4 border-b border-gray-200 flex space-x-2">
                            <button
                              onClick={() => editProduct(product.id)}
                              className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                              data-tooltip-id={`edit-tooltip-${product.id}`}
                              data-tooltip-content="Modifier le produit"
                            >
                              <FaEdit />
                            </button>
                            <ReactTooltip id={`edit-tooltip-${product.id}`} place="top" effect="solid" className="text-sm" />
                            <button
                              onClick={() => confirmDeleteProduct(product.id)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                              data-tooltip-id={`delete-tooltip-${product.id}`}
                              data-tooltip-content="Supprimer le produit"
                            >
                              <FaTrash />
                            </button>
                            <ReactTooltip id={`delete-tooltip-${product.id}`} place="top" effect="solid" className="text-sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Product Modal */}
              {showAddProductModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaPlus className="mr-2 text-green-600" /> Ajouter un Produit
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Nom du Produit</label>
                        <input
                          type="text"
                          value={newProduct.Nom}
                          onChange={(e) => setNewProduct({ ...newProduct, Nom: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Catégorie</label>
                        <select
                          value={newProduct.categorie}
                          onChange={(e) => setNewProduct({ ...newProduct, categorie: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="Fournitures agricoles">Fournitures agricoles</option>
                          <option value="Équipements et machines agricoles">Équipements et machines agricoles</option>
                          <option value="Alimentation animale">Alimentation animale</option>
                          <option value="Engrais">Engrais</option>
                          <option value="Produits bio">Produits bio</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Prix (DT)</label>
                        <input
                          type="number"
                          value={newProduct.prix}
                          onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                          rows="4"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProduct({ ...newProduct, photo: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Stock</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                          required
                          min="0"
                        />
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <FaSave className="mr-2" /> Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <FaTimes className="mr-2" /> Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteConfirmModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-95 animate-pop-up">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaTrash className="mr-2 text-red-500" /> Confirmer la Suppression
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => deleteProduct(productIdToDelete)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaTrash className="mr-2" /> Confirmer
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirmModal(false);
                          setProductIdToDelete(null);
                        }}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaTimes className="mr-2" /> Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'compte' && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-2 text-green-600" /> Mon Compte
              </h2>
              <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg max-w-2xl mx-auto transform hover:shadow-xl transition-all duration-200">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-green-600" /> Nom
                        </label>
                        <input
                          type="text"
                          value={userData.Nom}
                          onChange={(e) => setUserData({ ...userData, Nom: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-green-600" /> Prénom
                        </label>
                        <input
                          type="text"
                          value={userData.Prenom}
                          onChange={(e) => setUserData({ ...userData, Prenom: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaEnvelope className="mr-2 text-green-600" /> Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaEnvelope className="mr-2 text-green-600" /> Email Pro
                        </label>
                        <input
                          type="email"
                          value={userData.emailPro}
                          onChange={(e) => setUserData({ ...userData, emailPro: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaPhone className="mr-2 text-green-600" /> Téléphone
                        </label>
                        <input
                          type="tel"
                          value={userData.numtel}
                          onChange={(e) => setUserData({ ...userData, numtel: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-green-600" /> Adresse
                        </label>
                        <input
                          type="text"
                          value={userData.Adresse}
                          onChange={(e) => setUserData({ ...userData, Adresse: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaCalendarAlt className="mr-2 text-green-600" /> Date de Naissance
                        </label>
                        <input
                          type="date"
                          value={userData.dateNaissance}
                          onChange={(e) => setUserData({ ...userData, dateNaissance: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-green-600" /> Genre
                        </label>
                        <select
                          value={userData.genre}
                          onChange={(e) => setUserData({ ...userData, genre: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Homme">Homme</option>
                          <option value="Femme">Femme</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaBuilding className="mr-2 text-green-600" /> Entreprise
                        </label>
                        <input
                          type="text"
                          value={userData.Entreprise}
                          onChange={(e) => setUserData({ ...userData, Entreprise: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaIdCard className="mr-2 text-green-600" /> Matricule
                        </label>
                        <input
                          type="text"
                          value={userData.matricule}
                          disabled
                          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-green-600" /> Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setUserData({ ...userData, photo: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleUpdateProfile}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        data-tooltip-id="save-profile-tooltip"
                        data-tooltip-content="Enregistrer les modifications"
                      >
                        <FaSave className="mr-2" /> Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        data-tooltip-id="cancel-profile-tooltip"
                        data-tooltip-content="Annuler les modifications"
                      >
                        <FaTimes className="mr-2" /> Annuler
                      </button>
                    </div>
                    <ReactTooltip id="save-profile-tooltip" place="top" effect="solid" className="text-sm" />
                    <ReactTooltip id="cancel-profile-tooltip" place="top" effect="solid" className="text-sm" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={userData.photo || 'https://via.placeholder.com/100'}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {userData.Nom} {userData.Prenom}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center">
                          <FaIdCard className="mr-2 text-green-600" /> {userData.matricule}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2 text-green-600" /> <strong>Email:</strong> {userData.email}
                      </p>
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2 text-green-600" /> <strong>Email Pro:</strong> {userData.emailPro || 'Non spécifié'}
                      </p>
                      <p className="flex items-center">
                        <FaPhone className="mr-2 text-green-600" /> <strong>Téléphone:</strong> {userData.numtel}
                      </p>
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-green-600" /> <strong>Adresse:</strong> {userData.Adresse}
                      </p>
                      <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-green-600" /> <strong>Date de Naissance:</strong> {userData.dateNaissance || 'Non spécifié'}
                      </p>
                      <p className="flex items-center">
                        <FaUser className="mr-2 text-green-600" /> <strong>Genre:</strong> {userData.genre || 'Non spécifié'}
                      </p>
                      <p className="flex items-center">
                        <FaBuilding className="mr-2 text-green-600" /> <strong>Entreprise:</strong> {userData.Entreprise || 'Non spécifié'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      data-tooltip-id="edit-profile-tooltip"
                      data-tooltip-content="Modifier votre profil"
                    >
                      <FaEdit className="mr-2" /> Modifier le Profil
                    </button>
                    <ReactTooltip id="edit-profile-tooltip" place="top" effect="solid" className="text-sm" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pop-up {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-pop-up {
          animation: pop-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FournDashboard;