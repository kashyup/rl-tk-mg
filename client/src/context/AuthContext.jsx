import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tokenExpiration, setTokenExpiration] = useState(localStorage.getItem('tokenExpiration'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', tokenExpiration);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    }
  }, [token, tokenExpiration]);

  const login = async (username, password) => {
    const response = await fetch("/auth/login",{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15); // Set token expiration time to 15 minutes
      setUser(data.user);
      setToken(data.accessToken);
      setTokenExpiration(expiration.toISOString());
      localStorage.setItem('refreshToken', data.refreshToken);
      console.log('Login successful, tokens set.');
      navigate('/'); // Redirect to homepage after successful login
      return data;
    } else {
      throw new Error(data.message);
    }
  };

  const signup = async (username, email, password) => {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await fetch('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    setUser(null);
    setToken(null);
    setTokenExpiration(null);
    localStorage.removeItem('refreshToken');
    console.log('Logged out successfully.');
    navigate('/login');
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (response.ok) {
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15); // Set token expiration time to 15 minutes
      setToken(data.accessToken);
      setTokenExpiration(expiration.toISOString());
      localStorage.setItem('refreshToken', data.refreshToken);
      console.log('Token refreshed.');
      return data.accessToken;
    } else {
      logout();
      throw new Error(data.message);
    }
  };

  const isTokenExpired = () => {
    if (!tokenExpiration) {
      return true;
    }
    const expirationDate = new Date(tokenExpiration);
    const currentDate = new Date();
    return expirationDate <= currentDate;
  };

  const getAccessToken = async () => {
    if (isTokenExpired()) {
      console.log('Token expired, refreshing...');
      return await refreshAccessToken();
    }
    console.log('Token is valid.');
    return token;
  };

  const createDocument = async (title, content) => {
    const accessToken = await getAccessToken();
    const response = await fetch('/document/v1/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ title, content })
    });

    if (!response.ok) {
      throw new Error('Failed to create document');
    }

    return response.json();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, refreshAccessToken, getAccessToken, createDocument }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
