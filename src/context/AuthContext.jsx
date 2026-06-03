import  { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Rôles disponibles : 'employee', 'manager', 'finance', 'admin'
  const [user, setUser] = useState({
    name: 'Safi Kibasomba',
    email: 'safi.k@mukopo.com',
    role: 'employee' 
  });

  const switchRole = (role) => {
    setUser(prev => ({ ...prev, role }));
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);