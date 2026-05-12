import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, adminAPI } from '../services/api';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ocms_token');
      if (token) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data.user);
          fetchNotifications();
        } catch (err) {
          console.error('Session expired or invalid', err);
          localStorage.removeItem('ocms_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await adminAPI.getNotifications();
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (userId, password) => {
    try {
      const res = await authAPI.login(userId, password);
      localStorage.setItem('ocms_token', res.data.token);
      setUser(res.data.user);
      fetchNotifications();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ocms_token');
    setUser(null);
  };

  const markNotificationRead = async (id) => {
    try {
      await adminAPI.markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = ++toastId;
    const titles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };
    setToasts(prev => [...prev, { id, message, type, title: title || titles[type] || 'Info', duration }]);
    setTimeout(() => dismissToast(id), duration);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 250);
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout, loading,
      notifications, fetchNotifications, markNotificationRead,
      toasts, showToast, dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
