import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUsers } from '../context/UserContext';
import SafeIcon from '../common/SafeIcon';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers } = FiIcons;

function Users() {
  const { state, dispatch } = useUsers();
  const { users } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = (userData) => {
    dispatch({ type: 'ADD_USER', payload: userData });
    setShowForm(false);
  };

  const handleUpdateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch({ type: 'DELETE_USER', payload: userId });
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    dispatch({
      type: 'UPDATE_USER',
      payload: { ...user, status: newStatus }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <UserCard
              user={user}
              onEdit={() => setEditingUser(user)}
              onDelete={() => handleDeleteUser(user.id)}
              onToggleStatus={() => handleToggleStatus(user)}
            />
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No users found</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First User
          </button>
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          onSubmit={handleAddUser}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={handleUpdateUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

export default Users;