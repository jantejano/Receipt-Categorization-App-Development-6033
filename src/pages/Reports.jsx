import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import ExpenseChart from '../components/ExpenseChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import MonthlyTrends from '../components/MonthlyTrends';
import ExportOptions from '../components/ExportOptions';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiCalendar, FiBarChart3 } = FiIcons;

function Reports() {
  const { state } = useReceipts();
  const { receipts, categories } = state;
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showExport, setShowExport] = useState(false);

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const getFilteredReceipts = () => {
    const now = new Date();
    return receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return receiptDate >= weekAgo;
        case 'month':
          return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
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

  const filteredReceipts = getFilteredReceipts();
  const totalExpenses = filteredReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);

  const getCategoryStats = () => {
    const categoryTotals = {};
    filteredReceipts.forEach(receipt => {
      if (!categoryTotals[receipt.categoryId]) {
        categoryTotals[receipt.categoryId] = { total: 0, count: 0 };
      }
      categoryTotals[receipt.categoryId].total += receipt.amount || 0;
      categoryTotals[receipt.categoryId].count += 1;
    });

    return categories.map(category => ({
      ...category,
      total: categoryTotals[category.id]?.total || 0,
      count: categoryTotals[category.id]?.count || 0,
      percentage: totalExpenses > 0 ? ((categoryTotals[category.id]?.total || 0) / totalExpenses * 100) : 0
    })).filter(category => category.total > 0);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{filteredReceipts.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average per Receipt</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredReceipts.length > 0 ? (totalExpenses / filteredReceipts.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExpenseChart receipts={filteredReceipts} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CategoryBreakdown receipts={filteredReceipts} />
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MonthlyTrends />
      </motion.div>

      {/* Category Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryStats.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${category.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: category.color,
                            width: `${category.percentage}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{category.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Export Modal */}
      {showExport && (
        <ExportOptions
          receipts={filteredReceipts}
          categories={categories}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

export default Reports;