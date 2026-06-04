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
    setUser(prev => prev ? { ...prev, role } : {
      name: role === 'admin' ? 'Safi Kibasomba' : role === 'manager' ? 'Alain Ndikumana' : role === 'finance' ? 'Clément Nkurunziza' : 'Safi Kibasomba',
      email: `${role}@mukopo.com`,
      role
    });
  };

  const login = (role) => {
    setUser({
      name: role === 'admin' ? 'Safi Kibasomba' : role === 'manager' ? 'Alain Ndikumana' : role === 'finance' ? 'Clément Nkurunziza' : 'Safi Kibasomba',
      email: `${role}@mukopo.com`,
      role
    });
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, login, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);