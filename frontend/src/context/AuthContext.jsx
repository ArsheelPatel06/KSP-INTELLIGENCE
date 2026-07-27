import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in via token
    const token = localStorage.getItem('ksp_access_token');
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Failed to load user profile', err);
      // Let the interceptor handle the logout/refresh
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('ksp_access_token', data.accessToken);
      localStorage.setItem('ksp_refresh_token', data.refreshToken);
      setCurrentUser(data.user);
      
      // Initialize Zoho Catalyst Session via Custom JWT Token
      if (window.catalyst && window.catalyst.auth) {
        const getCustomTokenCallback = async () => {
          try {
            const customToken = await authService.getCatalystToken();
            return {
              client_id: customToken.client_id,
              scopes: customToken.scopes,
              jwt_token: customToken.jwt_token
            };
          } catch (e) {
            console.warn("Could not fetch Catalyst custom token:", e);
            throw e;
          }
        };
        
        try {
          await window.catalyst.auth.signinWithJwt(getCustomTokenCallback);
          console.log("Catalyst Custom Auth Session Established");
          
          // Enable Push Notifications
          if (window.catalyst.notification) {
            window.catalyst.notification.enableNotification().then((resp) => {
              console.log("Catalyst notifications enabled:", resp);
              window.catalyst.notification.messageHandler = (msg) => {
                console.log("Received Catalyst Notification:", msg);
                // Dispatch a custom event so AppContext can pick it up
                window.dispatchEvent(new CustomEvent('catalyst-notification', { detail: msg }));
              };
            }).catch(err => {
              console.error("Failed to enable Catalyst notifications:", err);
            });
          }
        } catch (catalystErr) {
          console.error("Catalyst authentication failed:", catalystErr);
        }
      }

      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
