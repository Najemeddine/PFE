import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaChartBar,
  FaBox,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaIdCard,
  FaStar,
  FaDollarSign,
  FaChartLine,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Swal from 'sweetalert2';

const COLORS = [
  "#22C55E",
  "#F59E0B",
  "#3B82F6",
  "#EC4899",
  "#14B8A6",
  "#6B7280",
];

const FournDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("statistiques");
  const [userData, setUserData] = useState({
    id: "",
    Nom: "",
    Prenom: "",
    email: "",
    emailPro: "",
    Adresse: "",
    numtel: "",
    dateNaissance: "",
    genre: "",
    entreprise: "",
    matricule: "",
    photo: "",
  });
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    avgRating: 0,
    totalRevenue: 0, // Added to initial state
  });
  const [bestRatedProducts, setBestRatedProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    Nom: "",
    categorie: "",
    prix: "",
    description: "",
    photo: "",
    stock: "",
  });
  const [editProduct, setEditProduct] = useState({
    id: "",
    Nom: "",
    categorie: "",
    prix: "",
    description: "",
    photo: "",
    stock: "",
  });

  const salesData = [
    { name: "Daily", value: 15 },
    { name: "Weekly", value: 90 },
    { name: "Monthly", value: 350 },
  ];
  const topProducts = [
    { name: "TRACTEUR", sales: 50 },
    { name: "NEW HOLLAND TC5040", sales: 40 },
    { name: "Moissonneuse-batteuse", sales: 30 },
    { name: "Pompe à eau", sales: 25 },
    { name: "ENGRAIS NPK 20-10-10", sales: 20 },
  ];

  const productStats = [
    { name: "Fournitures agricoles", value: 120 },
    { name: "Équipements agricoles", value: 80 },
    { name: "Alimentation animale", value: 50 },
    { name: "Produits bio", value: 70 },
  ];

  const fetchProducts = async (page = 1) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/produitsfourn/${user.id}?page=${page}&limit=${pagination.limit}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalProducts: data.pagination.totalProducts,
        limit: data.pagination.limit,
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const formatDate = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return date.toISOString().split("T")[0];
      };

      const initialData = {
        id: user.id || "",
        Nom: user.Nom || "",
        Prenom: user.Prenom || "",
        email: user.email || "",
        emailPro: user.emailPro || "",
        Adresse: user.Adresse || "",
        numtel: user.numtel || "",
        dateNaissance: formatDate(user.dateNaissance) || "",
        genre: user.genre || "",
        entreprise: user.entreprise || "",
        matricule: user.matricule || "",
        photo: user.photo || "",
      };

      console.log("Initial userData.photo on load:", initialData.photo);
      setUserData(initialData);

      setIsLoading(true);
      Promise.all([
        fetchProducts(pagination.currentPage),
        fetch(`http://localhost:3000/api/statistics?fournisseur=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch statistics");
          return res.json();
        }),
      ])
        .then(([_, statsData]) => {
          setStats(statsData);
          const sortedProducts = [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
          setBestRatedProducts(sortedProducts);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    console.log("Updated userData.photo:", userData.photo);
  }, [userData.photo]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("Sending userData to backend:", userData);

    fetch(`http://localhost:3000/api/fournisseurs/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update profile: ${res.status}`);
        return res.json();
      })
      .then((updatedUser) => {
        console.log("Backend response:", updatedUser);
        const newPhoto = updatedUser.photo !== undefined ? updatedUser.photo : userData.photo;
        console.log("New photo value after update:", newPhoto);

        const updatedData = { ...userData, ...updatedUser, photo: newPhoto };
        localStorage.setItem("user", JSON.stringify(updatedData));
        setUserData(updatedData);
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Le profil a été mis à jour avec succès.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#6B8E23',
        });
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: 'Une erreur s\'est produite lors de la mise à jour du profil.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#d33',
        });
      });
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:3000/api/produits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);
        setProducts(products.filter((product) => product.id !== id));
        setShowDeleteConfirmModal(false);
        setProductIdToDelete(null);
        fetchProducts(pagination.currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Le produit a été supprimé avec succès.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#6B8E23',
        });
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: 'Une erreur s\'est produite lors de la suppression du produit.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#d33',
        });
      });
  };

  const confirmDeleteProduct = (id) => {
    setProductIdToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const openEditProductModal = (product) => {
    setEditProduct({
      id: product.id,
      Nom: product.Nom,
      categorie: product.categorie,
      prix: product.prix,
      description: product.description || "",
      photo: product.photo || "",
      stock: product.stock,
    });
    setShowEditProductModal(true);
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/produits/${editProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setProducts(
          products.map((product) =>
            product.id === editProduct.id ? { ...product, ...editProduct } : product
          )
        );
        setShowEditProductModal(false);
        setEditProduct({
          id: "",
          Nom: "",
          categorie: "",
          prix: "",
          description: "",
          photo: "",
          stock: "",
        });
        fetchProducts(pagination.currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Le produit a été mis à jour avec succès.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#6B8E23',
        });
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: 'Une erreur s\'est produite lors de la mise à jour du produit.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#d33',
        });
      });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const productData = {
      ...newProduct,
      fournisseur: user.id,
    };

    fetch("http://localhost:3000/api/produits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, { id: data.id, ...productData }]);
        setNewProduct({
          Nom: "",
          categorie: "",
          prix: "",
          description: "",
          photo: "",
          stock: "",
        });
        setShowAddProductModal(false);
        setShowSuccessModal(true);
        fetchProducts(pagination.currentPage);
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9f8] text-gray-900 font-sans flex">
      <div className="fixed left-0 top-0 h-full w-64 bg-[#2F4F4F] text-white shadow-lg z-10">
        <h2 className="text-2xl font-extrabold text-center p-4 border-b border-[#6B8E23]">
          WeeFarm Fournisseur
        </h2>
        <nav className="p-4">
          <ul className="space-y-3">
            {[
              { tab: "statistiques", icon: <FaChartBar />, label: "Statistiques" },
              { tab: "produits", icon: <FaBox />, label: "Produits" },
              { tab: "compte", icon: <FaUser />, label: "Compte" },
            ].map((item) => (
              <li
                key={item.tab}
                onClick={() => setSelectedTab(item.tab)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTab === item.tab
                    ? "bg-[#FFC107] text-[#2F4F4F] shadow-md"
                    : "hover:bg-[#6B8E23] text-white"
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
        <ReactTooltip id="sidebar-tooltip-statistiques" place="right" effect="solid" className="text-sm" />
        <ReactTooltip id="sidebar-tooltip-produits" place="right" effect="solid" className="text-sm" />
        <ReactTooltip id="sidebar-tooltip-compte" place="right" effect="solid" className="text-sm" />
      </div>

      <div className="flex-1 ml-64 p-6">
        <NavBar />
        <div className="mt-16 max-w-7xl mx-auto">
          {selectedTab === "statistiques" && (
            <div>
              <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
                <FaChartBar className="mr-2 text-[#6B8E23]" /> Statistiques des Produits
              </h2>
              {isLoading ? (
                <div className="text-center text-gray-500 animate-pulse">Chargement...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      {
                        label: "Produits Publiés",
                        value: stats.totalProducts,
                        color: "bg-[#6B8E23]",
                        icon: <FaBox />,
                      },
                      {
                        label: "En Rupture",
                        value: stats.outOfStock,
                        color: "bg-red-500",
                        icon: <FaExclamationCircle />,
                      },
                      {
                        label: "Note Moyenne",
                        value:
                          (stats.avgRating && !isNaN(Number(stats.avgRating))
                            ? Number(stats.avgRating).toFixed(1)
                            : "0.0") + "/5",
                        color: "bg-[#FFC107]",
                        icon: <FaStar />,
                      },
                      {
                        label: "Total Prix Stock",
                        value: `${(stats.totalRevenue || 0).toLocaleString()} DT`,
                        color: "bg-[#2F4F4F]",
                      }
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
                      <ReactTooltip
                        key={index}
                        id={`stat-tooltip-${index}`}
                        place="top"
                        effect="solid"
                        className="text-sm"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                        <FaChartBar className="mr-2 text-[#6B8E23]" /> Répartition des Produits
                      </h3>
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

                    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-[#6B8E23]" /> Ventes (Journalier/Hebdo/Mensuel)
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#6B8E23" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                        <FaStar className="mr-2 text-[#FFC107]" /> Produits les Mieux Notés
                      </h3>
                      <ul className="space-y-2">
                        {bestRatedProducts.map((product) => (
                          <li
                            key={product.id}
                            className="flex items-center justify-between p-2 bg-[#F9F9F9] rounded-lg"
                          >
                            <span className="text-[#2F4F4F]">{product.Nom}</span>
                            <span className="flex items-center text-[#2F4F4F]">
                              <FaStar className="text-[#FFC107] mr-1" /> {product.rating}/5
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-[#2F4F4F] mb-4 flex items-center">
                        <FaChartBar className="mr-2 text-[#6B8E23]" /> Top 5 Produits les Plus Vendus
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" fill="#6B8E23" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {selectedTab === "produits" && (
            <div>
              <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
                <FaBox className="mr-2 text-[#6B8E23]" /> Liste des Produits
              </h2>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="mb-6 flex items-center px-4 py-2 bg-[#FFC107] text-[#2F4F4F] font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-md hover:shadow-lg"
                data-tooltip-id="add-product-tooltip"
                data-tooltip-content="Ajouter un nouveau produit"
              >
                <FaPlus className="mr-2" /> Ajouter un Produit
              </button>
              <ReactTooltip id="add-product-tooltip" place="top" effect="solid" className="text-sm" />
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-[#2F4F4F] text-white">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Photo
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Description
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className={`${index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-white"} hover:bg-gray-100 transition-all duration-200`}
                        >
                          <td className="py-3 px-4 border-b border-gray-200">
                            <img
                              src={product.photo || `/src/assets/images/produits/${product.Nom}.jpg`}
                              alt={product.Nom}
                              className="w-10 h-10 object-contain rounded-full shadow-sm"
                            />
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200 text-[#2F4F4F] font-medium">
                            {product.Nom}
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200 text-[#2F4F4F]">
                            {product.categorie}
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200 text-[#2F4F4F]">
                            {product.prix}DT
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200 text-[#2F4F4F] max-w-xs truncate">
                            {product.description || "Aucune description"}
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span className="text-[#2F4F4F]">{product.stock}</span>
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
                              <ReactTooltip
                                id={`stock-tooltip-${product.id}`}
                                place="top"
                                effect="solid"
                                className="text-sm"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200 flex space-x-2">
                            <button
                              onClick={() => openEditProductModal(product)}
                              className="p-2 bg-[#FFC107] text-[#2F4F4F] rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-sm hover:shadow-md"
                              data-tooltip-id={`edit-tooltip-${product.id}`}
                              data-tooltip-content="Modifier le produit"
                            >
                              <FaEdit />
                            </button>
                            <ReactTooltip
                              id={`edit-tooltip-${product.id}`}
                              place="top"
                              effect="solid"
                              className="text-sm"
                            />
                            <button
                              onClick={() => confirmDeleteProduct(product.id)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                              data-tooltip-id={`delete-tooltip-${product.id}`}
                              data-tooltip-content="Supprimer le produit"
                            >
                              <FaTrash />
                            </button>
                            <ReactTooltip
                              id={`delete-tooltip-${product.id}`}
                              place="top"
                              effect="solid"
                              className="text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-[#2F4F4F]">
                  Affichage de {products.length} sur {pagination.totalProducts} produits
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-full ${
                      pagination.currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#6B8E23] hover:bg-[#55701C] text-white"
                    } transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <FaArrowLeft />
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.currentPage === index + 1
                          ? "bg-[#FFC107] text-[#2F4F4F]"
                          : "bg-gray-200 text-[#2F4F4F] hover:bg-gray-300"
                      } transition-all duration-300`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-full ${
                      pagination.currentPage === pagination.totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#6B8E23] hover:bg-[#55701C] text-white"
                    } transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              {showAddProductModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto no-scrollbar">
                    <style jsx>{`
                      .no-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                      .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}</style>
                    <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4 flex items-center">
                      <FaPlus className="mr-2 text-[#6B8E23]" /> Ajouter un Produit
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Nom du Produit
                        </label>
                        <input
                          type="text"
                          value={newProduct.Nom}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              Nom: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Catégorie
                        </label>
                        <select
                          value={newProduct.categorie}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              categorie: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="Fournitures agricoles">Fournitures agricoles</option>
                          <option value="Équipements et machines agricoles">Équipements et machines agricoles</option>
                          <option value="Alimentation animale">Alimentation animale</option>
                          <option value="Engrais">Engrais</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Prix (DT)
                        </label>
                        <input
                          type="number"
                          value={newProduct.prix}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              prix: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          rows="4"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProduct({
                                  ...newProduct,
                                  photo: reader.result,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                          min="0"
                        />
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="flex items-center px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#55701C] transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <FaSave className="mr-2" /> Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <FaTimes className="mr-2" /> Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fade-in-up">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Produit ajouté !</h2>
                    <p className="text-gray-600 mb-4">Le produit a été ajouté avec succès.</p>
                    <button
                      className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                      onClick={() => setShowSuccessModal(false)}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              {showEditProductModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto no-scrollbar">
                    <style jsx>{`
                      .no-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                      .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}</style>
                    <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4 flex items-center">
                      <FaEdit className="mr-2 text-[#6B8E23]" /> Modifier le Produit
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Nom du Produit
                        </label>
                        <input
                          type="text"
                          value={editProduct.Nom}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              Nom: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Catégorie
                        </label>
                        <select
                          value={editProduct.categorie}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              categorie: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
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
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Prix (DT)
                        </label>
                        <input
                          type="number"
                          value={editProduct.prix}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              prix: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          value={editProduct.description}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          rows="4"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditProduct({
                                  ...editProduct,
                                  photo: reader.result,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={editProduct.stock}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              stock: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                          required
                          min="0"
                        />
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleEditProduct}
                          className="flex items-center px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#55701C] transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <FaSave className="mr-2" /> Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditProductModal(false)}
                          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <FaTimes className="mr-2" /> Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showDeleteConfirmModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
                    <h3 className="text-xl font-bold text-[#2F4F4F] mb-4 flex items-center">
                      <FaTrash className="mr-2 text-red-500" /> Confirmer la Suppression
                    </h3>
                    <p className="text-[#2F4F4F] mb-6">
                      Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => deleteProduct(productIdToDelete)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FaTrash className="mr-2" /> Confirmer
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirmModal(false);
                          setProductIdToDelete(null);
                        }}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FaTimes className="mr-2" /> Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === "compte" && (
            <div>
              <h2 className="text-3xl font-bold text-[#2F4F4F] mb-8 flex items-center">
                <FaUser className="mr-2 text-[#6B8E23]" /> Mon Compte
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto hover:shadow-lg transition-all duration-300">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-[#6B8E23]" /> Nom
                        </label>
                        <input
                          type="text"
                          value={userData.Nom}
                          onChange={(e) =>
                            setUserData({ ...userData, Nom: e.target.value })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-[#6B8E23]" /> Prénom
                        </label>
                        <input
                          type="text"
                          value={userData.Prenom}
                          onChange={(e) =>
                            setUserData({ ...userData, Prenom: e.target.value })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaEnvelope className="mr-2 text-[#6B8E23]" /> Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaEnvelope className="mr-2 text-[#6B8E23]" /> Email Pro
                        </label>
                        <input
                          type="email"
                          value={userData.emailPro}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              emailPro: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaPhone className="mr-2 text-[#6B8E23]" /> Téléphone
                        </label>
                        <input
                          type="tel"
                          value={userData.numtel}
                          onChange={(e) =>
                            setUserData({ ...userData, numtel: e.target.value })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-[#6B8E23]" /> Adresse
                        </label>
                        <input
                          type="text"
                          value={userData.Adresse}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              Adresse: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaCalendarAlt className="mr-2 text-[#6B8E23]" /> Date de Naissance
                        </label>
                        <input
                          type="date"
                          value={userData.dateNaissance}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              dateNaissance: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-[#6B8E23]" /> Genre
                        </label>
                        <select
                          value={userData.genre}
                          onChange={(e) =>
                            setUserData({ ...userData, genre: e.target.value })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Homme">Homme</option>
                          <option value="Femme">Femme</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaBuilding className="mr-2 text-[#6B8E23]" /> Entreprise
                        </label>
                        <input
                          type="text"
                          value={userData.entreprise}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              entreprise: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaIdCard className="mr-2 text-[#6B8E23]" /> Matricule
                        </label>
                        <input
                          type="text"
                          value={userData.matricule}
                          disabled
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2F4F4F] font-medium mb-1 flex items-center">
                          <FaUser className="mr-2 text-[#6B8E23]" /> Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64String = reader.result;
                                console.log("New photo selected:", base64String);
                                setUserData({
                                  ...userData,
                                  photo: base64String,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full p-2 border border-[#A9CBA4] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none transition-all duration-200"
                        />
                        {userData.photo && (
                          <div className="mt-2 flex items-center">
                            <img
                              src={userData.photo}
                              alt="Prévisualisation"
                              className="h-12 w-12 rounded-full object-cover border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleUpdateProfile}
                        className="flex items-center px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#55701C] transition-all duration-300 shadow-md hover:shadow-lg"
                        data-tooltip-id="save-profile-tooltip"
                        data-tooltip-content="Enregistrer les modifications"
                      >
                        <FaSave className="mr-2" /> Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
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
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      {userData.photo ? (
                        <div className="mt-2 flex items-center">
                          <img
                            src={userData.photo}
                            alt="Profile"
                            className="h-20 w-20 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              console.error("Error loading profile image:", userData.photo);
                              e.target.src = "https://via.placeholder.com/100";
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Profile Placeholder"
                          className="w-20 h-20 rounded-full object-cover shadow-sm"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-[#2F4F4F]">
                          {userData.Nom} {userData.Prenom}
                        </h3>
                        <p className="text-[#2F4F4F] text-sm flex items-center">
                          <FaIdCard className="mr-2 text-[#6B8E23]" /> {userData.matricule}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2F4F4F]">
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2 text-[#6B8E23]" /> <strong>Email:</strong> {userData.email}
                      </p>
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2 text-[#6B8E23]" /> <strong>Email Pro:</strong>{" "}
                        {userData.emailPro || "Non spécifié"}
                      </p>
                      <p className="flex items-center">
                        <FaPhone className="mr-2 text-[#6B8E23]" /> <strong>Téléphone:</strong> {userData.numtel}
                      </p>
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-[#6B8E23]" /> <strong>Adresse:</strong> {userData.Adresse}
                      </p>
                      <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-[#6B8E23]" /> <strong>Date de Naissance:</strong>{" "}
                        {userData.dateNaissance || "Non spécifié"}
                      </p>
                      <p className="flex items-center">
                        <FaUser className="mr-2 text-[#6B8E23]" /> <strong>Genre:</strong>{" "}
                        {userData.genre || "Non spécifié"}
                      </p>
                      <p className="flex items-center">
                        <FaBuilding className="mr-2 text-[#6B8E23]" /> <strong>Entreprise:</strong>{" "}
                        {userData.entreprise || "Non spécifié"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-[#FFC107] text-[#2F4F4F] rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-md hover:shadow-lg"
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
    </div>
  );
};

export default FournDashboard;