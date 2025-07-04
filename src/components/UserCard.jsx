import React from 'react';
import { motion } from 'framer-motion';
import { useUsers } from '../context/UserContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiUser, FiMail, FiShield, FiClock, FiCheck, FiX } = FiIcons;

function UserCard({ user, onEdit, onDelete, onToggleStatus }) {
  const { state } = useUsers();
  const { roles } = state;
  
  const userRole = roles.find(role => role.id === user.role);
  const isActive = user.status === 'active';
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getLastLoginText = (lastLogin) => {
    if (!lastLogin) return 'Never';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <SafeIcon icon={FiUser} className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          
          <button
            onClick={onToggleStatus}
            className={`p-2 rounded-lg ${
              isActive 
                ? 'text-red-400 hover:text-red-600 hover:bg-red-50' 
                : 'text-green-400 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <SafeIcon icon={isActive ? FiX : FiCheck} className="w-4 h-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Role:</span>
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: userRole?.color || '#6b7280' }}
          >
            <SafeIcon icon={FiShield} className="w-3 h-3 mr-1" />
            {userRole?.name || 'Unknown'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status:</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Last Login:</span>
          <div className="flex items-center text-sm text-gray-900">
            <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
            {getLastLoginText(user.lastLogin)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Permissions:</span>
          <span className="text-sm text-gray-900">
            {user.permissions?.includes('all') ? 'All' : user.permissions?.length || 0}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Created: {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}

export default UserCard;