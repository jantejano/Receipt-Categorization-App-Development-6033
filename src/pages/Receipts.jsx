import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReceipts, getFilteredReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import ReceiptUpload from '../components/ReceiptUpload';
import ReceiptCard from '../components/ReceiptCard';
import ReceiptFilters from '../components/ReceiptFilters';
import BulkImport from '../components/BulkImport';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiFilter, FiUpload, FiGrid, FiList } = FiIcons;

function Receipts() {
  const { state } = useReceipts();
  const { receipts, filters, categories, clients } = state;
  const [showUpload, setShowUpload] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filter receipts based on current filters
  const filteredReceipts = getFilteredReceipts(receipts, filters, categories, clients);

  // Calculate statistics for filtered receipts
  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
  const averageAmount = filteredReceipts.length > 0 ? totalAmount / filteredReceipts.length : 0;

  // Group receipts by category for better visualization
  const groupedByCategory = filteredReceipts.reduce((acc, receipt) => {
    const category = categories.find(cat => cat.id === receipt.categoryId);
    const categoryName = category ? category.name : 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: category,
        receipts: [],
        total: 0
      };
    }
    
    acc[categoryName].receipts.push(receipt);
    acc[categoryName].total += receipt.amount || 0;
    
    return acc;
  }, {});

  const hasActiveFilters = 
    filters.category || 
    filters.dateRange !== 'all' || 
    filters.searchTerm || 
    filters.client ||
    filters.minAmount ||
    filters.maxAmount;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Receipts</h2>
          {hasActiveFilters && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredReceipts.length} of {receipts.length} receipts
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {[
                  filters.category && '1',
                  filters.client && '1',
                  filters.dateRange !== 'all' && '1',
                  filters.searchTerm && '1',
                  filters.minAmount && '1',
                  filters.maxAmount && '1'
                ].filter(Boolean).length}
              </span>
            )}
          </button>
          
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
          >
            <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
            Bulk Import
          </button>
          
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Receipt
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ReceiptFilters />
        </motion.div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Receipts</div>
          <div className="text-2xl font-bold text-gray-900">{filteredReceipts.length}</div>
          {hasActiveFilters && (
            <div className="text-xs text-gray-500">of {receipts.length} total</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</div>
          {hasActiveFilters && (
            <div className="text-xs text-gray-500">
              {((totalAmount / receipts.reduce((sum, r) => sum + (r.amount || 0), 0)) * 100).toFixed(1)}% of total
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Average Amount</div>
          <div className="text-2xl font-bold text-gray-900">${averageAmount.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Categories</div>
          <div className="text-2xl font-bold text-gray-900">{Object.keys(groupedByCategory).length}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {hasActiveFilters && Object.keys(groupedByCategory).length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(groupedByCategory).map(([categoryName, data]) => (
              <div key={categoryName} className="text-center">
                <div 
                  className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: data.category?.color + '20' || '#f3f4f6' }}
                >
                  <span 
                    className="text-xl font-bold"
                    style={{ color: data.category?.color || '#6b7280' }}
                  >
                    {data.receipts.length}
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-900">{categoryName}</div>
                <div className="text-xs text-gray-500">${data.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipts Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReceipts.map((receipt, index) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReceiptCard receipt={receipt} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReceipts.map((receipt, index) => {
                  const category = categories.find(cat => cat.id === receipt.categoryId);
                  const client = clients.find(c => c.id === receipt.clientId);
                  
                  return (
                    <motion.tr
                      key={receipt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(receipt.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {receipt.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category && (
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: category.color + '20',
                              color: category.color
                            }}
                          >
                            {category.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${receipt.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client?.name || '-'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredReceipts.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {hasActiveFilters ? 'No receipts found matching your criteria' : 'No receipts found'}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Receipt
            </button>
            <button
              onClick={() => setShowBulkImport(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Bulk Import
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <ReceiptUpload onClose={() => setShowUpload(false)} />
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <BulkImport onClose={() => setShowBulkImport(false)} />
      )}
    </div>
  );
}

export default Receipts;