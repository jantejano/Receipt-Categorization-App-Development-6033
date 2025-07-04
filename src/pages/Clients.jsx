import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import ClientSummary from '../components/ClientSummary';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers } = FiIcons;

function Clients() {
  const { state, dispatch } = useReceipts();
  const { clients } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  const handleAddClient = (clientData) => {
    dispatch({ type: 'ADD_CLIENT', payload: clientData });
    setShowForm(false);
  };

  const handleUpdateClient = (clientData) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: clientData });
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This will remove the client association from all receipts.')) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientId });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ClientCard
              client={client}
              onEdit={() => setEditingClient(client)}
              onDelete={() => handleDeleteClient(client.id)}
              onViewDetails={() => setViewingClient(client)}
            />
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No clients created yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Client
          </button>
        </div>
      )}

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          onSubmit={handleAddClient}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingClient && (
        <ClientForm
          client={editingClient}
          onSubmit={handleUpdateClient}
          onClose={() => setEditingClient(null)}
        />
      )}

      {/* Client Summary Modal */}
      {viewingClient && (
        <ClientSummary
          client={viewingClient}
          onClose={() => setViewingClient(null)}
        />
      )}
    </div>
  );
}

export default Clients;