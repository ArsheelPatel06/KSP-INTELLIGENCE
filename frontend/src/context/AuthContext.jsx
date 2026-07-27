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
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isLocalhost && window.catalyst && window.catalyst.auth) {
        const getCustomTokenCallback = async () => {
          try {
            const customTokenResp = await fetch("/server/auth_function/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                request_type: "add_user",
                request_details: {
                  auth_type: "web",
                  user_details: {
                    email_id: data.user.email,
                    first_name: data.user.firstName || "App",
                    last_name: data.user.lastName || "User",
                    org_id: "KSP",
                    role_details: {
                      role_name: data.user.role || "User"
                    }
                  }
                }
              })
            });

            if (!customTokenResp.ok) {
              console.warn("Catalyst auth function returned error status", customTokenResp.status);
              return null;
            }

            const customToken = await customTokenResp.json();
            return {
              client_id: customToken.client_id,
              scopes: customToken.scopes,
              jwt_token: customToken.jwt_token
            };
          } catch (e) {
            console.warn("Could not fetch Catalyst custom token:", e);
            return null;
          }
        };
        
        try {
          // Only attempt Catalyst sign in if we actually got a callback
          await window.catalyst.auth.signinWithJwt(getCustomTokenCallback);
          console.log("Catalyst Custom Auth Session Established");
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
