import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('luxehub_user');
    return stored ? JSON.parse(stored) : null;
  });

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

  api.interceptors.request.use((config) => {
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    return config;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('luxehub_user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('luxehub_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxehub_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
