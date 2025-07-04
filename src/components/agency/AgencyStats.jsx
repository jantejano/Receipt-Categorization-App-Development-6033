import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, FiCheck, FiPause, FiClock, 
  FiHardDrive, FiActivity, FiTrendingUp, FiShield 
} = FiIcons;

function AgencyStats({ stats, agencyData }) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = () => {
    return Math.round((agencyData.currentSubaccounts / agencyData.maxSubaccounts) * 100);
  };

  const statCards = [
    {
      title: 'Total Subaccounts',
      value: stats.totalSubaccounts,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+2 this month',
      changeColor: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: stats.activeSubaccounts,
      icon: FiCheck,
      color: 'bg-green-500',
      change: `${Math.round((stats.activeSubaccounts / stats.totalSubaccounts) * 100)}% of total`,
      changeColor: 'text-gray-600'
    },
    {
      title: 'Suspended',
      value: stats.suspendedSubaccounts,
      icon: FiPause,
      color: 'bg-red-500',
      change: 'Requires attention',
      changeColor: stats.suspendedSubaccounts > 0 ? 'text-red-600' : 'text-gray-600'
    },
    {
      title: 'Pending Approval',
      value: stats.pendingSubaccounts,
      icon: FiClock,
      color: 'bg-yellow-500',
      change: 'Awaiting review',
      changeColor: stats.pendingSubaccounts > 0 ? 'text-yellow-600' : 'text-gray-600'
    },
    {
      title: 'Storage Used',
      value: formatBytes(stats.storageUsed),
      icon: FiHardDrive,
      color: 'bg-purple-500',
      change: 'Across all accounts',
      changeColor: 'text-gray-600'
    },
    {
      title: 'Active (30d)',
      value: stats.activeUsers30d,
      icon: FiActivity,
      color: 'bg-indigo-500',
      change: 'Logged in recently',
      changeColor: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.changeColor}`}>{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agency Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agency Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Subscription Info */}
          <div className="space-y-2">
            <div className="flex items-center">
              <SafeIcon icon={FiShield} className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Subscription</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {agencyData.subscriptionPlan}
            </p>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              agencyData.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {agencyData.status}
            </span>
          </div>

          {/* Account Usage */}
          <div className="space-y-2">
            <div className="flex items-center">
              <SafeIcon icon={FiUsers} className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Account Usage</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {agencyData.currentSubaccounts} / {agencyData.maxSubaccounts}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  getUsagePercentage() > 80 ? 'bg-red-500' : 
                  getUsagePercentage() > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
          </div>

          {/* Growth Trend */}
          <div className="space-y-2">
            <div className="flex items-center">
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Growth</span>
            </div>
            <p className="text-lg font-semibold text-green-600">+15%</p>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Quick Actions</span>
            <div className="space-y-1">
              <button className="w-full text-left text-xs text-blue-600 hover:text-blue-800">
                View All Subaccounts
              </button>
              <button className="w-full text-left text-xs text-blue-600 hover:text-blue-800">
                Export User Data
              </button>
              <button className="w-full text-left text-xs text-blue-600 hover:text-blue-800">
                Agency Settings
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AgencyStats;