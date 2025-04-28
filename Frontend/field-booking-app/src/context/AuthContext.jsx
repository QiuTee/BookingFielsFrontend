import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/submission';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Tải thông tin người dùng thất bại:", error);
        localStorage.removeItem('access_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      const token = res.token;
      localStorage.setItem('access_token', token);

      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (info) => {
    await registerUser(info);  
  };

  const logout = async () => {
    try {
      localStorage.removeItem('access_token');
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
