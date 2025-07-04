import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  currentUser: null,
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@taxsync.com',
      role: 'admin',
      status: 'active',
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      permissions: ['all']
    },
    {
      id: 2,
      name: 'John Manager',
      email: 'john@company.com',
      role: 'manager',
      status: 'active',
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      permissions: ['receipts.read', 'receipts.write', 'reports.read', 'categories.read', 'clients.read', 'clients.write']
    },
    {
      id: 3,
      name: 'Sarah Employee',
      email: 'sarah@company.com',
      role: 'employee',
      status: 'active',
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      permissions: ['receipts.read', 'receipts.write', 'categories.read']
    }
  ],
  roles: [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all features and settings',
      permissions: ['all'],
      color: '#ef4444'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Access to reports, clients, and receipt management',
      permissions: [
        'receipts.read',
        'receipts.write',
        'receipts.delete',
        'reports.read',
        'categories.read',
        'clients.read',
        'clients.write',
        'clients.delete'
      ],
      color: '#3b82f6'
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Basic access to receipt entry and viewing',
      permissions: [
        'receipts.read',
        'receipts.write',
        'categories.read'
      ],
      color: '#10b981'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to receipts and reports',
      permissions: [
        'receipts.read',
        'reports.read',
        'categories.read',
        'clients.read'
      ],
      color: '#6b7280'
    }
  ]
};

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
    
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.warn(`SafeGetItem error for key "${key}":`, error);
    try {
      localStorage.removeItem(key);
    } catch (clearError) {
      console.warn(`Failed to clear corrupted localStorage item "${key}":`, clearError);
    }
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  
  try {
    if (value === undefined) {
      console.warn(`Attempted to store undefined value for key "${key}"`);
      return false;
    }
    
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);
    return true;
  } catch (error) {
    console.warn(`SafeSetItem error for key "${key}":`, error);
    return false;
  }
};

function userReducer(state, action) {
  try {
    switch (action.type) {
      case 'LOAD_USERS':
        return {
          ...state,
          users: Array.isArray(action.payload) ? action.payload : initialState.users
        };
        
      case 'LOAD_ROLES':
        return {
          ...state,
          roles: Array.isArray(action.payload) ? action.payload : initialState.roles
        };
        
      case 'SET_CURRENT_USER':
        return {
          ...state,
          currentUser: action.payload
        };
        
      case 'ADD_USER':
        if (!action.payload) {
          console.warn('ADD_USER called with empty payload');
          return state;
        }
        
        const newUser = {
          ...action.payload,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString(),
          lastLogin: null,
          status: 'active'
        };
        
        return {
          ...state,
          users: [...(state.users || []), newUser]
        };
        
      case 'UPDATE_USER':
        if (!action.payload || !action.payload.id) {
          console.warn('UPDATE_USER called with invalid payload');
          return state;
        }
        
        return {
          ...state,
          users: (state.users || []).map(user =>
            user.id === action.payload.id
              ? { ...user, ...action.payload }
              : user
          )
        };
        
      case 'DELETE_USER':
        if (!action.payload) {
          console.warn('DELETE_USER called with empty payload');
          return state;
        }
        
        return {
          ...state,
          users: (state.users || []).filter(user => user.id !== action.payload)
        };
        
      case 'ADD_ROLE':
        if (!action.payload) {
          console.warn('ADD_ROLE called with empty payload');
          return state;
        }
        
        const newRole = {
          ...action.payload,
          id: action.payload.id || Date.now().toString()
        };
        
        return {
          ...state,
          roles: [...(state.roles || []), newRole]
        };
        
      case 'UPDATE_ROLE':
        if (!action.payload || !action.payload.id) {
          console.warn('UPDATE_ROLE called with invalid payload');
          return state;
        }
        
        return {
          ...state,
          roles: (state.roles || []).map(role =>
            role.id === action.payload.id
              ? { ...role, ...action.payload }
              : role
          )
        };
        
      case 'DELETE_ROLE':
        if (!action.payload) {
          console.warn('DELETE_ROLE called with empty payload');
          return state;
        }
        
        return {
          ...state,
          roles: (state.roles || []).filter(role => role.id !== action.payload)
        };
        
      case 'LOGIN_USER':
        if (!action.payload) {
          console.warn('LOGIN_USER called with empty payload');
          return state;
        }
        
        const updatedUsers = (state.users || []).map(user =>
          user.id === action.payload.id
            ? { ...user, lastLogin: new Date().toISOString() }
            : user
        );
        
        return {
          ...state,
          currentUser: action.payload,
          users: updatedUsers
        };
        
      case 'LOGOUT_USER':
        return {
          ...state,
          currentUser: null
        };
        
      default:
        return state;
    }
  } catch (error) {
    console.error('UserReducer error:', error);
    return state;
  }
}

// Permission checking utilities
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  
  // Admin has all permissions
  if (user.permissions.includes('all')) return true;
  
  // Check specific permission
  return user.permissions.includes(permission);
};

export const hasAnyPermission = (user, permissions) => {
  if (!user || !Array.isArray(permissions)) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
};

export const canAccessRoute = (user, route) => {
  const routePermissions = {
    '/': ['receipts.read'],
    '/receipts': ['receipts.read'],
    '/clients': ['clients.read'],
    '/categories': ['categories.read'],
    '/reports': ['reports.read'],
    '/settings': ['all'],
    '/users': ['all'],
    '/get-started': []
  };
  
  const requiredPermissions = routePermissions[route] || [];
  
  if (requiredPermissions.length === 0) return true;
  
  return hasAnyPermission(user, requiredPermissions);
};

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = safeGetItem('users', initialState.users);
      const savedRoles = safeGetItem('roles', initialState.roles);
      const savedCurrentUser = safeGetItem('currentUser', null);
      
      if (Array.isArray(savedUsers) && savedUsers.length > 0) {
        dispatch({ type: 'LOAD_USERS', payload: savedUsers });
      }
      
      if (Array.isArray(savedRoles) && savedRoles.length > 0) {
        dispatch({ type: 'LOAD_ROLES', payload: savedRoles });
      }
      
      if (savedCurrentUser) {
        dispatch({ type: 'SET_CURRENT_USER', payload: savedCurrentUser });
      } else {
        // Auto-login as admin for demo purposes
        const adminUser = savedUsers.find(user => user.role === 'admin') || initialState.users[0];
        dispatch({ type: 'SET_CURRENT_USER', payload: adminUser });
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      if (state.users && Array.isArray(state.users)) {
        safeSetItem('users', state.users);
      }
      
      if (state.roles && Array.isArray(state.roles)) {
        safeSetItem('roles', state.roles);
      }
      
      if (state.currentUser) {
        safeSetItem('currentUser', state.currentUser);
      }
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }, [state.users, state.roles, state.currentUser]);
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}