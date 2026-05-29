import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('miniLinkedInUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('miniLinkedInToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('miniLinkedInUser', JSON.stringify(res.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('miniLinkedInToken', token);
    localStorage.setItem('miniLinkedInUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('miniLinkedInToken');
    localStorage.removeItem('miniLinkedInUser');
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
