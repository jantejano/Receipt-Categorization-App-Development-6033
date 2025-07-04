import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

// Safe localStorage functions
const safeGetItem = (key, defaultValue = null) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultValue;
  }
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined || item === 'undefined' || item === 'null' || item === '') {
      return defaultValue;
    }
    return item;
  } catch (error) {
    console.warn(`SafeGetItem error for key "${key}":`, error);
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
      return true;
    }
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`SafeSetItem error for key "${key}":`, error);
    return false;
  }
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data for demonstration
  const mockUsers = {
    'agency@taxsync.com': {
      id: 'user-agency-1',
      email: 'agency@taxsync.com',
      name: 'Agency Owner',
      role: 'agency_owner',
      avatar: null,
      isAgencyOwner: true,
      agencyId: 'agency-1',
      permissions: ['all'],
      isNewUser: false // Existing user
    },
    'admin@taxsync.com': {
      id: 'user-admin-1',
      email: 'admin@taxsync.com',
      name: 'Admin User',
      role: 'admin',
      avatar: null,
      isAgencyOwner: false,
      agencyId: null,
      permissions: ['all'],
      isNewUser: false // Existing user
    },
    'user@example.com': {
      id: 'user-sub-1',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      avatar: null,
      isAgencyOwner: false,
      agencyId: 'agency-1',
      permissions: ['receipts.read', 'receipts.write', 'categories.read'],
      isNewUser: false // Existing user
    },
    'newuser@example.com': {
      id: 'user-new-1',
      email: 'newuser@example.com',
      name: 'New User',
      role: 'user',
      avatar: null,
      isAgencyOwner: false,
      agencyId: null,
      permissions: ['receipts.read', 'receipts.write', 'categories.read'],
      isNewUser: true // New user - should go to onboarding
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    try {
      const savedEmail = safeGetItem('userEmail');
      const savedToken = safeGetItem('token');
      
      if (savedEmail && savedToken) {
        const userData = mockUsers[savedEmail];
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Clear invalid data
          safeSetItem('userEmail', null);
          safeSetItem('token', null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No saved auth - user needs to login
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Mock login validation
      const userData = mockUsers[email];
      if (userData && password) {
        // Simple password check for demo
        safeSetItem('userEmail', email);
        safeSetItem('token', 'demo-token-' + Date.now());
        
        setIsAuthenticated(true);
        setUser(userData);
        
        return { 
          success: true, 
          user: userData,
          isNewUser: userData.isNewUser 
        };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear all auth data
      safeSetItem('userEmail', null);
      safeSetItem('token', null);
      safeSetItem('userId', null); // Clear Quest user ID too
      
      setIsAuthenticated(false);
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const switchUser = async (email) => {
    try {
      const userData = mockUsers[email];
      if (userData) {
        safeSetItem('userEmail', email);
        setUser(userData);
        return { 
          success: true, 
          user: userData,
          isNewUser: userData.isNewUser 
        };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Handle Quest SDK login
  const handleQuestLogin = ({ userId, token, newUser }) => {
    try {
      console.log('Quest login data received:', { userId, token, newUser });
      
      // For demo, map Quest login to our mock users
      // In real app, you'd use the userId to fetch user data from your backend
      let email = 'user@example.com'; // Default user
      
      // If it's a new user, use the new user mock data
      if (newUser) {
        email = 'newuser@example.com';
      }
      
      const userData = mockUsers[email];
      if (userData) {
        safeSetItem('userEmail', email);
        safeSetItem('token', token || 'demo-token-' + Date.now());
        safeSetItem('userId', userId);
        
        setIsAuthenticated(true);
        setUser({ ...userData, isNewUser: newUser });
        
        return { 
          success: true, 
          user: userData,
          isNewUser: newUser 
        };
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Quest login error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    switchUser,
    handleQuestLogin,
    mockUsers // For demo purposes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}