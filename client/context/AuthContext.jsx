import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('author');

  const switchRole = (role) => {
    if (['author', 'editor'].includes(role)) {
      setUserRole(role);
    }
  };

  const isAuthor = () => userRole === 'author';
  const isEditor = () => userRole === 'editor';

  const value = {
    userRole,
    switchRole,
    isAuthor,
    isEditor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
