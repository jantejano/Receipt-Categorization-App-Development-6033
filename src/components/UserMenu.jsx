import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAgency } from '../context/AgencyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, FiSettings, FiLogOut, FiChevronDown, FiShield, 
  FiUsers, FiSwitchCamera, FiCrown, FiCheck, FiMail, FiBriefcase 
} = FiIcons;

function UserMenu() {
  const { user, logout, switchUser, mockUsers } = useAuth();
  const { stats } = useAgency();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowUserSwitcher(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setIsOpen(false);
      navigate('/login', { replace: true });
    }
  };

  const handleSwitchUser = async (email) => {
    const result = await switchUser(email);
    if (result.success) {
      setShowUserSwitcher(false);
      setIsOpen(false);
      
      // Navigate based on whether user is new or existing
      if (result.isNewUser) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      
      // Force page reload to update all contexts
      window.location.reload();
    }
  };

  const getUserRoleBadge = (role, isAgencyOwner) => {
    if (isAgencyOwner) {
      return {
        label: 'Agency Owner',
        icon: FiCrown,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    }

    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: FiShield,
          color: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'manager':
        return {
          label: 'Manager',
          icon: FiBriefcase,
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'user':
        return {
          label: 'User',
          icon: FiUser,
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          label: 'User',
          icon: FiUser,
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const roleBadge = getUserRoleBadge(user?.role, user?.isAgencyOwner);

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
          user.isAgencyOwner 
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
            : user.role === 'admin' 
              ? 'bg-gradient-to-br from-red-500 to-pink-600' 
              : 'bg-gradient-to-br from-blue-500 to-cyan-600'
        }`}>
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* User Info (Hidden on small screens) */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        {/* Chevron */}
        <SafeIcon 
          icon={FiChevronDown} 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  user.isAgencyOwner 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                    : user.role === 'admin' 
                      ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleBadge.color}`}>
                      <SafeIcon icon={roleBadge.icon} className="w-3 h-3 mr-1" />
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agency Stats (for agency owners only) */}
            {user.isAgencyOwner && stats && (
              <div className="px-4 py-3 border-b border-gray-100 bg-purple-50">
                <h4 className="text-xs font-medium text-purple-900 mb-2">Agency Overview</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-purple-900">{stats.totalSubaccounts}</p>
                    <p className="text-xs text-purple-600">Total Users</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{stats.activeSubaccounts}</p>
                    <p className="text-xs text-purple-600">Active</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-600">{stats.pendingSubaccounts}</p>
                    <p className="text-xs text-purple-600">Pending</p>
                  </div>
                </div>
              </div>
            )}

            {/* Role-specific Information */}
            {user.role === 'admin' && !user.isAgencyOwner && (
              <div className="px-4 py-3 border-b border-gray-100 bg-red-50">
                <div className="flex items-center">
                  <SafeIcon icon={FiShield} className="w-4 h-4 text-red-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-red-900">System Administrator</p>
                    <p className="text-xs text-red-600">Full application access</p>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'user' && !user.isAgencyOwner && (
              <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
                <div className="flex items-center">
                  <SafeIcon icon={FiUser} className="w-4 h-4 text-blue-600 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-blue-900">Standard User</p>
                    <p className="text-xs text-blue-600">Receipt & expense management</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2">
              {/* Agency Management - Only for Agency Owners */}
              {user.isAgencyOwner && (
                <button 
                  onClick={() => navigate('/agency')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  <SafeIcon icon={FiUsers} className="w-4 h-4 mr-3 text-purple-600" />
                  Agency Management
                </button>
              )}

              <button 
                onClick={() => navigate('/settings')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <SafeIcon icon={FiSettings} className="w-4 h-4 mr-3" />
                Settings
              </button>

              {/* User Switcher (Demo Feature) */}
              <button 
                onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <SafeIcon icon={FiSwitchCamera} className="w-4 h-4 mr-3" />
                Switch User (Demo)
                <SafeIcon 
                  icon={FiChevronDown} 
                  className={`w-4 h-4 ml-auto transition-transform ${showUserSwitcher ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* User Switcher Submenu */}
              <AnimatePresence>
                {showUserSwitcher && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 border-t border-gray-100"
                  >
                    {Object.entries(mockUsers).map(([email, userData]) => (
                      <button
                        key={email}
                        onClick={() => handleSwitchUser(email)}
                        className={`flex items-center w-full px-8 py-2 text-sm hover:bg-gray-100 ${
                          user.email === email ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3 ${
                          userData.isAgencyOwner 
                            ? 'bg-gradient-to-br from-purple-400 to-indigo-500' 
                            : userData.role === 'admin' 
                              ? 'bg-gradient-to-br from-red-400 to-pink-500' 
                              : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                        }`}>
                          {userData.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{userData.name}</p>
                          <p className="text-xs text-gray-500">
                            {userData.isAgencyOwner ? 'Agency Owner' : userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                            {userData.isNewUser && ' (New)'}
                          </p>
                        </div>
                        {user.email === email && (
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <hr className="my-2" />

              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;