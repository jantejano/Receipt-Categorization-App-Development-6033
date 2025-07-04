import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDownload, FiFileText, FiDatabase } = FiIcons;

function ExportOptions({ receipts, categories, onClose }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportRange, setExportRange] = useState('all');

  const getFilteredReceipts = () => {
    if (exportRange === 'all') return receipts;
    
    const now = new Date();
    return receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      
      switch (exportRange) {
        case 'month':
          return receiptDate.getMonth() === now.getMonth() && 
                 receiptDate.getFullYear() === now.getFullYear();
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          const receiptQuarter = Math.floor(receiptDate.getMonth() / 3);
          return receiptQuarter === quarter && receiptDate.getFullYear() === now.getFullYear();
        case 'year':
          return receiptDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const exportToCSV = () => {
    const filteredReceipts = getFilteredReceipts();
    
    const headers = ['Date', 'Vendor', 'Amount', 'Category', 'Description', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...filteredReceipts.map(receipt => {
        const category = categories.find(cat => cat.id === receipt.categoryId);
        return [
          receipt.date,
          `"${receipt.vendor}"`,
          receipt.amount,
          `"${category?.name || 'Uncategorized'}"`,
          `"${receipt.description || ''}"`,
          `"${receipt.tags?.join(', ') || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts-${exportRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const filteredReceipts = getFilteredReceipts();
    
    const data = {
      receipts: filteredReceipts.map(receipt => ({
        ...receipt,
        categoryName: categories.find(cat => cat.id === receipt.categoryId)?.name || 'Uncategorized'
      })),
      categories,
      exportDate: new Date().toISOString(),
      exportRange
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts-${exportRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mr-3"
                />
                <SafeIcon icon={FiFileText} className="w-5 h-5 mr-2 text-green-600" />
                <span>CSV (Spreadsheet)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mr-3"
                />
                <SafeIcon icon={FiDatabase} className="w-5 h-5 mr-2 text-blue-600" />
                <span>JSON (Data)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Range
            </label>
            <select
              value={exportRange}
              onChange={(e) => setExportRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Export Summary:</p>
              <p>• Format: {exportFormat.toUpperCase()}</p>
              <p>• Range: {exportRange === 'all' ? 'All Time' : exportRange}</p>
              <p>• Receipts: {getFilteredReceipts().length}</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ExportOptions;