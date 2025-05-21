import { createContext, useContext, useState, useEffect, useCallback } from "react";
import Api from "../Services/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    profile: null,
    profileType: null,
    loading: true,
    error: null,
  });

  // Déclarez d'abord logout avec useCallback
  const logout = useCallback(async () => {
    try {
      await Api.post("/api/logout");
    } catch (error) {
      console.warn("Erreur lors de la déconnexion API:", error);
    } finally {
      localStorage.removeItem("auth_token");
      delete Api.defaults.headers.common["Authorization"];
      setAuthState({
        user: null,
        profile: null,
        profileType: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  // Ensuite déclarez loadUserData qui utilise logout
  const loadUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

    //   Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await Api.get("/api/user-with-profile");

      if (response.data.message) {
        if (response.status === 401) {
          throw new Error("Non autorisé");
        }
        if (response.status === 404) {
          throw new Error("Profil utilisateur introuvable");
        }
        throw new Error(response.data.message);
      }

      if (!response.data.user || !response.data.profile_type) {
        throw new Error("Données utilisateur incomplètes");
      }

      setAuthState({
        user: response.data.user,
        profile: response.data.profile,
        profileType: response.data.profile_type,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error("Erreur de chargement utilisateur:", error);
      if (error.response?.status === 401 || error.message.includes("Non autorisé")) {
        logout(); // Maintenant logout est accessible
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    }
  }, [logout]); // Ajoutez logout comme dépendance

  // Puis déclarez login qui utilise loadUserData
  const login = useCallback(async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await Api.get("/sanctum/csrf-cookie");
      
      const response = await Api.post("/api/login", { email, password });

      if (!response.data?.token) {
        throw new Error("Token non reçu dans la réponse");
      }

      localStorage.setItem("auth_token", response.data.token);
      Api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      await loadUserData();

      return { success: true };
    } catch (error) {
      console.error("Erreur de connexion:", error);
      let errorMessage = "Erreur de connexion";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      "Identifiants incorrects";
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { 
        success: false, 
        message: errorMessage,
        errors: error.response?.data?.errors 
      };
    }
  }, [loadUserData]);

  // Enfin register
  const register = useCallback(async (userData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await Api.get("/sanctum/csrf-cookie");
      const response = await Api.post("/api/register", userData);

      if (response.data?.token) {
        localStorage.setItem("auth_token", response.data.token);
        await loadUserData();
        return { success: true };
      }

      throw new Error("Réponse d'inscription incomplète");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      const errorMessage = error.response?.data?.message || 
                         "Erreur lors de l'inscription";
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { 
        success: false, 
        message: errorMessage,
        errors: error.response?.data?.errors 
      };
    }
  }, [loadUserData]);

  // Chargement initial
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const contextValue = {
    ...authState,
    login,
    register,
    logout,
    isAuthenticated: !!authState.user,
    refetchUser: loadUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};