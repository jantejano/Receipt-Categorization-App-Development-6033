import React from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import ExpenseChart from '../components/ExpenseChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import RecentReceipts from '../components/RecentReceipts';
import ImportSummary from '../components/ImportSummary';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiTrendingUp, FiFileText, FiCalendar } = FiIcons;

function Dashboard() {
  const { state } = useReceipts();
  const { receipts, totalExpenses, monthlyExpenses } = state;

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-blue-500',
      change: '+12.5%'
    },
    {
      title: 'This Month',
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: FiCalendar,
      color: 'bg-green-500',
      change: '+8.2%'
    },
    {
      title: 'Total Receipts',
      value: receipts.length,
      icon: FiFileText,
      color: 'bg-purple-500',
      change: '+15.3%'
    },
    {
      title: 'Avg per Receipt',
      value: `$${receipts.length > 0 ? (totalExpenses / receipts.length).toFixed(2) : '0.00'}`,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      change: '+3.1%'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your expenses.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Import Summary */}
      <ImportSummary />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <ExpenseChart />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <CategoryBreakdown />
        </motion.div>
      </div>

      {/* Recent Receipts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <RecentReceipts />
      </motion.div>
    </div>
  );
}

export default Dashboard;