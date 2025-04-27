import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBackground from "../assets/images/nature.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricule, setMatricule] = useState("");
  const [userType, setUserType] = useState("client"); // Default to client
  const [errors, setErrors] = useState({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Veuillez saisir votre email";
    }
    
    if (!password.trim()) {
      newErrors.password = "Veuillez saisir votre mot de passe";
    }
    
    if (userType === "fournisseur" && !matricule.trim()) {
      newErrors.matricule = "Veuillez saisir votre matricule";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare login payload based on user type
      const payload = { email, password };
      
      // Add matricule if fournisseur
      if (userType === "fournisseur") {
        payload.matricule = matricule;
      }

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.field === "matricule") {
          setErrors({ matricule: data.message });
        } else {
          setErrors({ general: data.message });
        }
        throw new Error(data.message || "Échec de connexion");
      }

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
      // Error is already set in the catch block above
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
  
    // Email validation
    if (!resetEmail.trim()) {
      setErrors({ resetEmail: "Veuillez saisir votre adresse email" });
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
      setErrors({ general: "Un problème est survenu. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserType = (type) => {
    setUserType(type);
    setErrors({}); // Clear any existing errors
  };

  // Colors for new design
  const colors = {
    primary: "#3B7A57", // Sacramento green (earthier, less intense)
    accent: "#F2C94C",  // Harvest gold
    neutral: "#F5F5F0", // Off-white
    text: "#333333",    // Dark gray for text
    border: "#D1D5DB",  // Light gray for borders
  };

  return (
    <div
      className="fixed inset-0 bg-[#dcdde1] bg-cover bg-center flex items-center justify-center"
    >
      {!forgotPassword ? (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Image on left side */}
          <div className="hidden md:block relative">
            <img
              src="/src/assets/images/login-image.jpg"
              alt="WeeFarm"
              className="h-full w-full object-cover"
            />
           
          </div>

          {/* Form on right side */}
          <div className="p-6 bg-white flex flex-col justify-center overflow-y-auto">
            {/* Logo for mobile view */}
            <div className="md:hidden flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">WF</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Connexion</h2>
            <p className="text-gray-500 mb-4 text-sm">Accédez à votre espace WeeFarm</p>

            {/* User type selector */}
            <div className="flex rounded-lg overflow-hidden mb-4 border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => toggleUserType("client")}
                className={`flex-1 py-1.5 px-4 text-center font-medium transition-colors ${
                  userType === "client"
                    ? `bg-${colors.primary} bg-opacity-10 text-${colors.primary} border-b-2 border-${colors.primary}`
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: userType === "client" ? `${colors.primary}10` : "",
                  color: userType === "client" ? colors.primary : "",
                  borderBottomColor: userType === "client" ? colors.primary : "",
                  borderBottomWidth: userType === "client" ? "2px" : ""
                }}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => toggleUserType("fournisseur")}
                className={`flex-1 py-1.5 px-4 text-center font-medium transition-colors ${
                  userType === "fournisseur"
                    ? `bg-${colors.primary} bg-opacity-10 text-${colors.primary} border-b-2 border-${colors.primary}`
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: userType === "fournisseur" ? `${colors.primary}10` : "",
                  color: userType === "fournisseur" ? colors.primary : "",
                  borderBottomColor: userType === "fournisseur" ? colors.primary : "",
                  borderBottomWidth: userType === "fournisseur" ? "2px" : ""
                }}
              >
                Fournisseur
              </button>
            </div>

            {errors.general && (
              <div className="text-red-600 text-xs mb-4 font-medium p-2 bg-red-50 rounded-lg border border-red-100">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm`}
                  style={{ focusRing: colors.primary }}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {userType === "fournisseur" && (
                <div>
                  <label
                    htmlFor="matricule"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Matricule
                  </label>
                  <input
                    type="text"
                    id="matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="WF2025-04-12345"
                    className={`w-full px-3 py-2 rounded-lg border ${errors.matricule ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm`}
                    style={{ focusRing: colors.primary }}
                  />
                  {errors.matricule && (
                    <p className="text-red-500 text-xs mt-1">{errors.matricule}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full px-3 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm`}
                  style={{ focusRing: colors.primary }}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-xs hover:underline"
                  style={{ color: colors.primary }}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 text-white font-medium rounded-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-70 shadow-sm text-sm"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, #2A5E41)`,
                }}
              >
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <p className="px-3 text-xs text-gray-500">OU</p>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Pas encore de compte ?{" "}
                <a
                  href="/register"
                  className="font-medium hover:underline"
                  style={{ color: colors.primary }}
                >
                  Créez-en un ici
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            {resetSuccess ? "Email envoyé" : "Récupérer votre mot de passe"}
          </h2>

          {errors.general && (
            <div className="text-red-600 text-center mb-4 p-2 bg-red-50 rounded-lg border border-red-100 text-sm">
              {errors.general}
            </div>
          )}

          {!resetSuccess ? (
            <>
              <p className="text-gray-600 mb-4 text-sm">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.resetEmail ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm`}
                    style={{ focusRing: colors.primary }}
                    required
                  />
                  {errors.resetEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.resetEmail}</p>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    style={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-70 shadow-sm text-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, #2A5E41)`,
                    }}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-4 text-center text-sm">
                Un email avec les instructions a été envoyé à <span className="font-semibold">{resetEmail}</span>
              </p>
              <button
                onClick={() => {
                  setForgotPassword(false);
                  setResetSuccess(false);
                }}
                className="w-full py-2 text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm text-sm"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, #2A5E41)`,
                }}
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