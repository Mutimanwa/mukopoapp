import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });

      // Sauvegarder dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase() // Normaliser le rôle pour correspondre aux routes React
      }));

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase()
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);