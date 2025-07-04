import React from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiCheck, FiClock, FiAlertCircle } = FiIcons;

function ImportSummary() {
  const { state } = useReceipts();
  const { receipts } = state;

  // Get import statistics
  const importedReceipts = receipts.filter(receipt => receipt.status === 'imported');
  const manualReceipts = receipts.filter(receipt => receipt.status !== 'imported');
  
  const todayImports = importedReceipts.filter(receipt => {
    const receiptDate = new Date(receipt.createdAt);
    const today = new Date();
    return receiptDate.toDateString() === today.toDateString();
  });

  const importedAmount = importedReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);

  if (importedReceipts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <SafeIcon icon={FiUpload} className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Import Summary</h3>
            <p className="text-sm text-gray-600">Your bulk import activity</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-green-700">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Imported</p>
              <p className="text-2xl font-bold text-gray-900">{importedReceipts.length}</p>
            </div>
            <SafeIcon icon={FiUpload} className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Imported Amount</p>
              <p className="text-2xl font-bold text-gray-900">${importedAmount.toFixed(2)}</p>
            </div>
            <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Imports</p>
              <p className="text-2xl font-bold text-gray-900">{todayImports.length}</p>
            </div>
            <SafeIcon icon={FiClock} className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Manual Entries</p>
              <p className="text-2xl font-bold text-gray-900">{manualReceipts.length}</p>
            </div>
            <SafeIcon icon={FiAlertCircle} className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {todayImports.length > 0 && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <SafeIcon icon={FiCheck} className="w-4 h-4 inline mr-1" />
            Great! You've imported {todayImports.length} new expense{todayImports.length !== 1 ? 's' : ''} today.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default ImportSummary;