import React from 'react';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiX, FiFilter, FiCalendar, FiTag, FiUser } = FiIcons;

function ReceiptFilters() {
  const { state, dispatch } = useReceipts();
  const { categories, clients, filters } = state;

  const handleFilterChange = (filterType, value) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { [filterType]: value }
    });
  };

  const clearFilters = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        category: '',
        dateRange: 'all',
        searchTerm: '',
        client: '',
        minAmount: '',
        maxAmount: ''
      }
    });
  };

  const hasActiveFilters = 
    filters.category || 
    filters.dateRange !== 'all' || 
    filters.searchTerm || 
    filters.client ||
    filters.minAmount ||
    filters.maxAmount;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
        >
          <SafeIcon icon={FiX} className="w-4 h-4 mr-1" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <SafeIcon icon={FiSearch} className="w-4 h-4 inline mr-1" />
            Search
          </label>
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search receipts..."
            />
            {filters.searchTerm && (
              <button
                onClick={() => handleFilterChange('searchTerm', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <SafeIcon icon={FiTag} className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {filters.category && (
            <div className="flex items-center mt-1">
              {(() => {
                const selectedCategory = categories.find(cat => cat.id === parseInt(filters.category));
                return selectedCategory ? (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: selectedCategory.color + '20', 
                      color: selectedCategory.color 
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    {selectedCategory.name}
                  </span>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Client Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-1" />
            Client
          </label>
          <select
            value={filters.client}
            onChange={(e) => handleFilterChange('client', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {filters.client && (
            <div className="flex items-center mt-1">
              {(() => {
                const selectedClient = clients.find(client => client.id === parseInt(filters.client));
                return selectedClient ? (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedClient.color }}
                  >
                    {selectedClient.name}
                  </span>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Amount Range Filters */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Min Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Max Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="999.99"
          />
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>

      {/* Category Pills - Quick Filter */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quick Category Filter
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !filters.category
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', category.id.toString())}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.category === category.id.toString()
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: filters.category === category.id.toString() 
                  ? category.color 
                  : category.color + '20',
                color: filters.category === category.id.toString() 
                  ? 'white' 
                  : category.color
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            <span className="text-xs text-gray-500">
              {[
                filters.category && 'Category',
                filters.client && 'Client',
                filters.dateRange !== 'all' && 'Date',
                filters.searchTerm && 'Search',
                filters.minAmount && 'Min Amount',
                filters.maxAmount && 'Max Amount'
              ].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptFilters;