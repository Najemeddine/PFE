import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/acceuil";
import AdminDashboard from "./pages/FournDashboard";
import Dashboardadmin from "./pages/DashboardAdmin";
import AddFournisseur from "./pages/AddFournisseur";  // The page for adding fournisseur
import UpdateSupplier from "./pages/UpdateSupplier";

import "./index.css";
import Panel from "./pages/panel";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/panel" element={<Panel />} />

      <Route path="/register" element={<Register />} />
      <Route path="/acceuil" element={<Dashboard />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Fourndashboard" element={ <AdminDashboard/>} />
      <Route path="/Admindashboard" element={ <Dashboardadmin/>} />
      <Route path="/add-fournisseur" element={<AddFournisseur />} />
      <Route path="/add-fournisseur" element={<AddFournisseur />} />
      <Route path="/update-fournisseur/:id" element={<UpdateSupplier />} />
      <Route path="/reset-password/:token/:userId/:userType" element={<ResetPassword />} />

    </Routes>
  </Router>
);
