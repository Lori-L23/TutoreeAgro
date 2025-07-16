import React from "react";
import Layout from "./components/Layout";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./Pages/Accueil";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Entreprises from "./Pages/Entreprises";
import Contact from "./Pages/Contact";
import APropos from "./Pages/Apropos";
import ForgotPassword from "./components/ForgotPassword";
import Commandes from "./client/commandes";
import MonCompte from "./client/compteclient";
import Produits from "./Pages/Produits";
import Mesproduits from "./entreprise/Produits";
import CompteEntreprise from "./entreprise/Compte";
import Dashboardclient from "./client/dashboard";
import AdminDashboard from "./admin/Dashboard";
import Dashboardentre from "./entreprise/dashboard";
import AdminAccount from "./admin/Compte";
import AdminUsers from "./admin/AdminUsers";
import EmailValidation from "./components/EmailValidation";

import { AuthProvider } from "./Contexts/Authcontexts";

function App() {
  return (
      <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Accueil />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/entreprises" element={<Entreprises />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apropos" element={<APropos />} />
              <Route path="/commandes" element={<Commandes />} />
              <Route path="/moncompte" element={<MonCompte />} />
              <Route path="/dashboardclient" element={<Dashboardclient />} />
              <Route path="/dashboard" element={<Dashboardentre />} />
              <Route path="/mesproduits" element={<Mesproduits />} />
              <Route path="/compteentreprise" element={<CompteEntreprise />} />
              <Route path="/dashboardadmin" element={<AdminDashboard />} />
              <Route path="/admincompte" element={<AdminAccount />} />
              <Route path="/adminusers" element={<AdminUsers />} />

            </Route>  
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/validate-email/:token" element={<EmailValidation />} />

          </Routes>
      </AuthProvider>
  );
}

export default App;
