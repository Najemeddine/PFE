import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Panel = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-yellow-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-green-800 mb-6">Votre Panier</h2>
        
        {cart.length === 0 ? (
          <p className="text-lg text-gray-600">Votre panier est vide.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((product, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <img
                  src={product.imageUrl || `/src/assets/images/produits/${product.Nom}.jpg`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-green-700">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="mt-2 text-lg font-bold text-green-600">dt{product.prix}dt</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate("/acceuil")}
            className="py-2 px-4 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
