import React, { createContext, useContext, useState } from 'react';

type UserRole = 'peneliti' | 'admin';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: 'peneliti',
  setRole: () => {},
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('peneliti');

  return (
    <AuthContext.Provider value={{ role, setRole, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
