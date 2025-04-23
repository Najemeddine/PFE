import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBackground from "../assets/images/nature.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricule, setMatricule] = useState("");
  const [userType, setUserType] = useState("client"); // Default to client
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Prepare login payload based on user type
      const payload = { email, password };
      
      // Add matricule if fournisseur
      if (userType === "fournisseur") {
        if (!matricule.trim()) {
          setError("Veuillez saisir votre matricule");
          setIsSubmitting(false);
          return;
        }
        payload.matricule = matricule;
      }

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de connexion");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.typeuser === "fournisseur") {
        navigate("/acceuil");
      } else if (data.user.typeuser === "admin") {
        navigate("/AdminDashboard");
      } else if (data.user.typeuser === "client") {
        navigate("/acceuil");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
  
    // Email validation
    if (!resetEmail.trim()) {
      setError("Veuillez saisir votre adresse email");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
  
      const data = await response.json();
      
      // Even if email doesn't exist, we show success for security
      setResetSuccess(true);
    } catch (err) {
      // Don't show specific errors to user for security
      setError("Un problème est survenu. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserType = (type) => {
    setUserType(type);
    setError(""); // Clear any existing errors
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {!forgotPassword ? (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white bg-opacity-80 rounded-2xl shadow-2xl max-w-4xl w-full backdrop-blur-md border border-green-300 transition-all overflow-hidden">
          {/* Image on left side */}
          <div className="hidden md:block">
            <img
              src="/src/assets/images/farm-login.jpg"
              alt="WeeFarm"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Form on right side */}
          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-green-700 text-center mb-6">
              Bienvenue sur WeeFarm
            </h2>

            {/* User type selector */}
            <div className="flex rounded-md overflow-hidden mb-6 border border-green-300">
              <button
                type="button"
                onClick={() => toggleUserType("client")}
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                  userType === "client"
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600 hover:bg-green-50"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => toggleUserType("fournisseur")}
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                  userType === "fournisseur"
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600 hover:bg-green-50"
                }`}
              >
                Fournisseur
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-center mb-4 font-medium p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {userType === "fournisseur" && (
                <div>
                  <label
                    htmlFor="matricule"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Matricule
                  </label>
                  <input
                    type="text"
                    id="matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="WF2025-04-12345"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-green-600 text-sm hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 hover:scale-[1.01] transition-all duration-200 disabled:bg-green-400"
              >
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-700">
                Pas encore de compte ?{" "}
                <a
                  href="/register"
                  className="text-green-600 font-medium hover:underline"
                >
                  Créez-en un ici
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md border border-green-300">
          <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
            {resetSuccess ? "Email envoyé" : "Récupérer votre mot de passe"}
          </h2>

          {error && (
            <div className="text-red-600 text-center mb-4 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {!resetSuccess ? (
            <>
              <p className="text-gray-600 mb-4">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="text-green-600 mb-4 text-center">
                Un email avec les instructions a été envoyé à {resetEmail}
              </p>
              <button
                onClick={() => {
                  setForgotPassword(false);
                  setResetSuccess(false);
                }}
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Retour à la connexion
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;