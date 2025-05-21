import React from "react";
import Layout from "./components/Layout";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./Pages/Accueil";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Produits from "./Pages/Produits";
import Entreprises from "./Pages/Entreprises";
import Contact from "./Pages/Contact";
import APropos from "./Pages/Apropos";

import Dashboardclient from "./client/dashboard";
import Dashboard from "./admin/dashboard";

import Dashboardentre from "./entreprise/dashboard";

import { AuthProvider } from "./Contexts/Authcontexts";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Accueil />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/entreprises" element={<Entreprises />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apropos" element={<APropos />} />
            </Route>
            <Route path="/admin " element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
