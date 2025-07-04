import React from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiFileText, FiDollarSign, FiDownload } = FiIcons;

function ClientCard({ client, onEdit, onDelete, onViewDetails }) {
  const { state } = useReceipts();
  const { receipts } = state;

  const clientReceipts = receipts.filter(receipt => receipt.clientId === client.id);
  const totalAmount = clientReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            {client.projectCode && (
              <p className="text-sm text-gray-500">{client.projectCode}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewDetails}
            className="p-2 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {client.email && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
            {client.email}
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
            {client.phone}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-2xl font-bold text-gray-900">{clientReceipts.length}</span>
          </div>
          <p className="text-sm text-gray-500">Receipts</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-2xl font-bold text-gray-900">{totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Average per receipt:</span>
          <span className="font-medium text-gray-900">
            ${clientReceipts.length > 0 ? (totalAmount / clientReceipts.length).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ClientCard;