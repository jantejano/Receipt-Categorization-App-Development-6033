import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiFileText, FiDollarSign } = FiIcons;

function CategoryCard({ category, stats, onEdit, onDelete }) {
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
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: category.color + '20' }}
          >
            <SafeIcon
              icon={getCategoryIcon(category.name)}
              className="w-5 h-5"
              style={{ color: category.color }}
            />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
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
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-2xl font-bold text-gray-900">{stats.count}</span>
          </div>
          <p className="text-sm text-gray-500">Receipts</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-2xl font-bold text-gray-900">{stats.total.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Average per receipt:</span>
          <span className="font-medium text-gray-900">
            ${stats.count > 0 ? (stats.total / stats.count).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default CategoryCard;