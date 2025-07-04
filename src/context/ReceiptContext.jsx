import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ReceiptContext = createContext();

const initialState = {
  receipts: [],
  clients: [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '(555) 123-4567',
      address: '123 Business St, City, State 12345',
      taxId: 'TAX123456789',
      projectCode: 'ACME-2024',
      color: '#3b82f6',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '(555) 987-6543',
      address: '456 Innovation Ave, Tech City, TC 67890',
      taxId: 'TAX987654321',
      projectCode: 'TECH-2024',
      color: '#10b981',
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, name: 'Gas & Fuel', color: '#ef4444', icon: 'Fuel' },
    { id: 2, name: 'Transportation', color: '#3b82f6', icon: 'Car' },
    { id: 3, name: 'Office Supplies', color: '#10b981', icon: 'Package' },
    { id: 4, name: 'Meals & Entertainment', color: '#f59e0b', icon: 'Coffee' },
    { id: 5, name: 'Travel', color: '#8b5cf6', icon: 'Plane' },
    { id: 6, name: 'Utilities', color: '#06b6d4', icon: 'Zap' },
    { id: 7, name: 'Marketing', color: '#ec4899', icon: 'TrendingUp' },
    { id: 8, name: 'Professional Services', color: '#64748b', icon: 'Briefcase' },
    { id: 9, name: 'Equipment', color: '#dc2626', icon: 'Tool' },
    { id: 10, name: 'Other', color: '#6b7280', icon: 'MoreHorizontal' }
  ],
  totalExpenses: 0,
  monthlyExpenses: 0,
  filters: {
    category: '',
    dateRange: 'all',
    searchTerm: '',
    client: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  }
};

// Ultra-safe localStorage functions with multiple fallbacks
const safeGetItem = (key, defaultValue = null) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    // Handle all falsy cases
    if (item === null || item === undefined || item === 'undefined' || item === 'null' || item === '') {
      return defaultValue;
    }

    // Additional safety check for valid JSON
    if (typeof item !== 'string') {
      return defaultValue;
    }

    // Try to parse JSON
    const parsed = JSON.parse(item);
    // Validate the parsed result
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }

    return parsed;
  } catch (error) {
    console.warn(`SafeGetItem error for key "${key}":`, error);
    // Clear the corrupted item
    try {
      localStorage.removeItem(key);
    } catch (clearError) {
      console.warn(`Failed to clear corrupted localStorage item "${key}":`, clearError);
    }
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }

  try {
    // Validate the value before stringifying
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

// Safe number parsing
const safeParseFloat = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Safe parseInt
const safeParseInt = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

function receiptReducer(state, action) {
  try {
    switch (action.type) {
      case 'LOAD_RECEIPTS':
        return {
          ...state,
          receipts: Array.isArray(action.payload) ? action.payload : []
        };

      case 'LOAD_CLIENTS':
        return {
          ...state,
          clients: Array.isArray(action.payload) ? action.payload : initialState.clients
        };

      case 'LOAD_CATEGORIES':
        return {
          ...state,
          categories: Array.isArray(action.payload) ? action.payload : initialState.categories
        };

      case 'ADD_RECEIPT':
        if (!action.payload) {
          console.warn('ADD_RECEIPT called with empty payload');
          return state;
        }

        const newReceipt = {
          ...action.payload,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString(),
          status: action.payload.status || 'pending',
          amount: safeParseFloat(action.payload.amount, 0)
        };

        return {
          ...state,
          receipts: [...(state.receipts || []), newReceipt]
        };

      case 'UPDATE_RECEIPT':
        if (!action.payload || !action.payload.id) {
          console.warn('UPDATE_RECEIPT called with invalid payload');
          return state;
        }

        return {
          ...state,
          receipts: (state.receipts || []).map(receipt =>
            receipt.id === action.payload.id
              ? { ...receipt, ...action.payload, amount: safeParseFloat(action.payload.amount, receipt.amount) }
              : receipt
          )
        };

      case 'DELETE_RECEIPT':
        if (!action.payload) {
          console.warn('DELETE_RECEIPT called with empty payload');
          return state;
        }

        return {
          ...state,
          receipts: (state.receipts || []).filter(receipt => receipt.id !== action.payload)
        };

      case 'ADD_CLIENT':
        if (!action.payload) {
          console.warn('ADD_CLIENT called with empty payload');
          return state;
        }

        const newClient = {
          ...action.payload,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString()
        };

        return {
          ...state,
          clients: [...(state.clients || []), newClient]
        };

      case 'UPDATE_CLIENT':
        if (!action.payload || !action.payload.id) {
          console.warn('UPDATE_CLIENT called with invalid payload');
          return state;
        }

        return {
          ...state,
          clients: (state.clients || []).map(client =>
            client.id === action.payload.id
              ? { ...client, ...action.payload }
              : client
          )
        };

      case 'DELETE_CLIENT':
        if (!action.payload) {
          console.warn('DELETE_CLIENT called with empty payload');
          return state;
        }

        return {
          ...state,
          clients: (state.clients || []).filter(client => client.id !== action.payload),
          receipts: (state.receipts || []).map(receipt =>
            receipt.clientId === action.payload
              ? { ...receipt, clientId: null }
              : receipt
          )
        };

      case 'ADD_CATEGORY':
        if (!action.payload) {
          console.warn('ADD_CATEGORY called with empty payload');
          return state;
        }

        const newCategory = {
          ...action.payload,
          id: Date.now() + Math.random()
        };

        return {
          ...state,
          categories: [...(state.categories || []), newCategory]
        };

      case 'UPDATE_CATEGORY':
        if (!action.payload || !action.payload.id) {
          console.warn('UPDATE_CATEGORY called with invalid payload');
          return state;
        }

        return {
          ...state,
          categories: (state.categories || []).map(category =>
            category.id === action.payload.id
              ? { ...category, ...action.payload }
              : category
          )
        };

      case 'DELETE_CATEGORY':
        if (!action.payload) {
          console.warn('DELETE_CATEGORY called with empty payload');
          return state;
        }

        return {
          ...state,
          categories: (state.categories || []).filter(category => category.id !== action.payload)
        };

      case 'SET_FILTERS':
        return {
          ...state,
          filters: {
            ...(state.filters || {}),
            ...(action.payload || {})
          }
        };

      case 'CALCULATE_TOTALS':
        const receipts = state.receipts || [];
        const total = receipts.reduce((sum, receipt) => {
          const amount = safeParseFloat(receipt?.amount, 0);
          return sum + amount;
        }, 0);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthly = receipts
          .filter(receipt => {
            if (!receipt?.date) return false;
            try {
              const receiptDate = new Date(receipt.date);
              return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
            } catch {
              return false;
            }
          })
          .reduce((sum, receipt) => {
            const amount = safeParseFloat(receipt?.amount, 0);
            return sum + amount;
          }, 0);

        return {
          ...state,
          totalExpenses: total,
          monthlyExpenses: monthly
        };

      default:
        return state;
    }
  } catch (error) {
    console.error('ReceiptReducer error:', error);
    return state;
  }
}

// Enhanced filtering function with safety checks
export function getFilteredReceipts(receipts, filters, categories, clients) {
  if (!Array.isArray(receipts)) {
    console.warn('getFilteredReceipts: receipts is not an array');
    return [];
  }

  if (!filters || typeof filters !== 'object') {
    console.warn('getFilteredReceipts: filters is invalid');
    return receipts;
  }

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  return receipts.filter(receipt => {
    if (!receipt || typeof receipt !== 'object') {
      return false;
    }

    try {
      // Category filter
      const matchesCategory = !filters.category || receipt.categoryId === safeParseInt(filters.category);

      // Client filter
      const matchesClient = !filters.client || receipt.clientId === safeParseInt(filters.client);

      // Search filter
      const searchTerm = String(filters.searchTerm || '').toLowerCase();
      const matchesSearch = !searchTerm ||
        String(receipt.vendor || '').toLowerCase().includes(searchTerm) ||
        String(receipt.description || '').toLowerCase().includes(searchTerm) ||
        safeCategories.find(cat => cat.id === receipt.categoryId)?.name?.toLowerCase().includes(searchTerm);

      // Amount filters
      const amount = safeParseFloat(receipt.amount, 0);
      const minAmount = safeParseFloat(filters.minAmount, 0);
      const maxAmount = safeParseFloat(filters.maxAmount, Infinity);
      const matchesMinAmount = !filters.minAmount || amount >= minAmount;
      const matchesMaxAmount = !filters.maxAmount || amount <= maxAmount;

      // Date range filtering
      const matchesDate = (() => {
        if (!filters.dateRange || filters.dateRange === 'all') return true;

        try {
          const receiptDate = new Date(receipt.date);
          const now = new Date();

          if (isNaN(receiptDate.getTime())) return false;

          switch (filters.dateRange) {
            case 'today':
              return receiptDate.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return receiptDate >= weekAgo;
            case 'month':
              return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
            case 'quarter':
              const quarter = Math.floor(now.getMonth() / 3);
              const receiptQuarter = Math.floor(receiptDate.getMonth() / 3);
              return receiptQuarter === quarter && receiptDate.getFullYear() === now.getFullYear();
            case 'year':
              return receiptDate.getFullYear() === now.getFullYear();
            case 'custom':
              const startDate = filters.startDate ? new Date(filters.startDate) : null;
              const endDate = filters.endDate ? new Date(filters.endDate) : null;
              if (startDate && endDate) {
                return receiptDate >= startDate && receiptDate <= endDate;
              } else if (startDate) {
                return receiptDate >= startDate;
              } else if (endDate) {
                return receiptDate <= endDate;
              }
              return true;
            default:
              return true;
          }
        } catch {
          return true;
        }
      })();

      return matchesCategory && matchesClient && matchesSearch && matchesMinAmount && matchesMaxAmount && matchesDate;
    } catch (error) {
      console.warn('Error filtering receipt:', error);
      return true;
    }
  });
}

export function ReceiptProvider({ children }) {
  const [state, dispatch] = useReducer(receiptReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedReceipts = safeGetItem('receipts', []);
      const savedCategories = safeGetItem('categories', initialState.categories);
      const savedClients = safeGetItem('clients', initialState.clients);

      if (Array.isArray(savedReceipts) && savedReceipts.length > 0) {
        dispatch({ type: 'LOAD_RECEIPTS', payload: savedReceipts });
      }

      if (Array.isArray(savedCategories) && savedCategories.length > 0) {
        dispatch({ type: 'LOAD_CATEGORIES', payload: savedCategories });
      }

      if (Array.isArray(savedClients) && savedClients.length > 0) {
        dispatch({ type: 'LOAD_CLIENTS', payload: savedClients });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      if (state.receipts && Array.isArray(state.receipts)) {
        safeSetItem('receipts', state.receipts);
      }

      if (state.categories && Array.isArray(state.categories)) {
        safeSetItem('categories', state.categories);
      }

      if (state.clients && Array.isArray(state.clients)) {
        safeSetItem('clients', state.clients);
      }

      dispatch({ type: 'CALCULATE_TOTALS' });
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state.receipts, state.categories, state.clients]);

  return (
    <ReceiptContext.Provider value={{ state, dispatch }}>
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceipts() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceipts must be used within a ReceiptProvider');
  }
  return context;
}