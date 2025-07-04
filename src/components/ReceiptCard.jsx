import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiEye, FiCalendar, FiDollarSign, FiTag, FiUpload } = FiIcons;

function ReceiptCard({ receipt }) {
  const { state, dispatch } = useReceipts();
  const { categories } = state;
  const [showDetails, setShowDetails] = useState(false);

  const category = categories.find(cat => cat.id === receipt.categoryId);
  const receiptDate = new Date(receipt.date).toLocaleDateString();
  const isImported = receipt.status === 'imported';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      dispatch({ type: 'DELETE_RECEIPT', payload: receipt.id });
    }
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Gas & Fuel': FiIcons.FiZap,
      'Transportation': FiIcons.FiTruck,
      'Office Supplies': FiIcons.FiPackage,
      'Meals & Entertainment': FiIcons.FiCoffee,
      'Travel': FiIcons.FiMapPin,
      'Utilities': FiIcons.FiZap,
      'Marketing': FiIcons.FiTrendingUp,
      'Professional Services': FiIcons.FiBriefcase,
      'Equipment': FiIcons.FiTool,
      'Other': FiIcons.FiMoreHorizontal
    };
    return iconMap[categoryName] || FiIcons.FiTag;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`receipt-card bg-white rounded-xl shadow-sm border overflow-hidden ${
        isImported ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
      }`}
    >
      {/* Import Badge */}
      {isImported && (
        <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
          <div className="flex items-center text-blue-700">
            <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">Bulk Imported</span>
            {receipt.tags && receipt.tags.includes('bulk-import') && (
              <span className="ml-2 px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                Auto-categorized
              </span>
            )}
          </div>
        </div>
      )}

      {/* Receipt Image */}
      {receipt.image && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={receipt.image}
            alt="Receipt"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {receipt.vendor}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
              {receiptDate}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">
              ${receipt.amount?.toFixed(2)}
            </span>
          </div>
          {category && (
            <div
              className="category-badge"
              style={{
                backgroundColor: category.color + '20',
                color: category.color
              }}
            >
              <SafeIcon icon={getCategoryIcon(category.name)} className="w-3 h-3 mr-1" />
              {category.name}
            </div>
          )}
        </div>

        {/* Description */}
        {receipt.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {receipt.description}
          </p>
        )}

        {/* Tags */}
        {receipt.tags && receipt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {receipt.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${
                  tag === 'bulk-import'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4 mt-4"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Receipt ID:</span>
                <p className="font-medium text-gray-900">#{receipt.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium text-gray-900 capitalize">
                  {receipt.status || 'Pending'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <p className="font-medium text-gray-900">
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <p className="font-medium text-gray-900">
                  {category?.name || 'Uncategorized'}
                </p>
              </div>
              {isImported && (
                <div className="col-span-2">
                  <span className="text-gray-500">Import Method:</span>
                  <p className="font-medium text-blue-700">Bulk CSV/Excel Import</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ReceiptCard;