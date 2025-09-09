import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved user on start
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const saveSession = (userObj, token) => {
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', token);
    setUser(userObj);
  };

  const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // login: calls backend, stores token + user
  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    // backend returns { token, username }
    const { token, username: userName } = res.data;

    const userObj = { username: userName };
    saveSession(userObj, token);

    return userObj;
  };

  // register: create user then login automatically
  const register = async (username, password) => {
    await api.post('/auth/register', { username, password });
    // immediately login to obtain token
    return await login(username, password);
  };

  const logout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
