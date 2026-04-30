import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser, createUser, generateId } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  function login(email, password) {
    const u = loginUser(email, password);
    setUser(u);
    return u;
  }

  function register({ username, email, password }) {
    const newUser = {
      id: generateId(),
      username,
      email,
      passwordHash: password,
      role: 'reader',
      bio: '',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: null,
    };
    createUser(newUser);
    return login(email, password);
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const isAdmin = user?.role === 'admin';
  const isAuthor = user?.role === 'admin' || user?.role === 'author';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
