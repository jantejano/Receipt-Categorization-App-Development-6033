import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAgency } from '../context/AgencyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiDatabase, FiSettings, FiChevronDown, FiServer,
  FiUsers, FiActivity, FiShield, FiMonitor,
  FiRefreshCw, FiHardDrive, FiWifi, FiCheck,
  FiAlertCircle, FiCpu, FiGlobe, FiCrown
} = FiIcons;

function BackendControlPanel() {
  const { user } = useAuth();
  const { stats, agencyData } = useAgency();
  const [isOpen, setIsOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: 'operational',
    api: 'operational',
    storage: 'operational',
    auth: 'operational'
  });

  // Only show for agency owners ONLY - hide from admins and users
  if (!user || !user.isAgencyOwner) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'outage': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const refreshSystemStatus = () => {
    // Simulate checking system status
    setSystemStatus({
      database: Math.random() > 0.1 ? 'operational' : 'degraded',
      api: Math.random() > 0.05 ? 'operational' : 'degraded',
      storage: Math.random() > 0.02 ? 'operational' : 'degraded',
      auth: 'operational'
    });
  };

  const systemMetrics = [
    {
      label: 'Database',
      status: systemStatus.database,
      icon: FiDatabase,
      details: 'PostgreSQL 15.2'
    },
    {
      label: 'API Server',
      status: systemStatus.api,
      icon: FiServer,
      details: 'Node.js Runtime'
    },
    {
      label: 'Storage',
      status: systemStatus.storage,
      icon: FiHardDrive,
      details: 'Supabase Storage'
    },
    {
      label: 'Authentication',
      status: systemStatus.auth,
      icon: FiShield,
      details: 'JWT + RLS'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors shadow-lg"
        title="Agency Backend Control Panel"
      >
        <SafeIcon icon={FiMonitor} className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">Agency Backend</span>
        <SafeIcon 
          icon={FiChevronDown} 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50"
          >
            {/* Header */}
            <div className="px-4 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <SafeIcon icon={FiShield} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Agency Backend Control</h3>
                    <p className="text-xs text-purple-600">Owner Access Only</p>
                  </div>
                </div>
                <button
                  onClick={refreshSystemStatus}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title="Refresh Status"
                >
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Agency Owner Badge */}
            <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
              <div className="flex items-center">
                <SafeIcon icon={FiCrown} className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Agency Owner Dashboard</p>
                  <p className="text-xs text-purple-600">Full system access & monitoring</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="px-4 py-3">
              <h4 className="text-sm font-medium text-gray-900 mb-3">System Health Status</h4>
              <div className="grid grid-cols-2 gap-3">
                {systemMetrics.map((metric) => (
                  <div key={metric.label} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <SafeIcon icon={metric.icon} className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-xs font-medium text-gray-900">{metric.label}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${
                        metric.status === 'operational' ? 'bg-green-500' :
                        metric.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-xs text-gray-500">{metric.details}</p>
                    <p className={`text-xs font-medium capitalize ${
                      metric.status === 'operational' ? 'text-green-600' :
                      metric.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {metric.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agency Performance Metrics */}
            <div className="px-4 py-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Agency Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Subaccounts</span>
                  <span className="text-xs font-medium text-gray-900">{stats?.activeSubaccounts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Storage Used</span>
                  <span className="text-xs font-medium text-gray-900">
                    {stats?.storageUsed ? `${(stats.storageUsed / 1024 / 1024 / 1024).toFixed(2)} GB` : '0 GB'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">API Requests (24h)</span>
                  <span className="text-xs font-medium text-gray-900">12,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">System Uptime</span>
                  <span className="text-xs font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Revenue (MTD)</span>
                  <span className="text-xs font-medium text-green-600">$24,750</span>
                </div>
              </div>
            </div>

            {/* Agency Management Actions */}
            <div className="px-4 py-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Agency Management</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.hash = '/agency'}
                  className="flex items-center w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 rounded-md border border-purple-200 hover:border-purple-300"
                >
                  <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">Manage Subaccounts</div>
                    <div className="text-gray-500">Create, suspend, activate users</div>
                  </div>
                </button>
                <button className="flex items-center w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 rounded-md">
                  <SafeIcon icon={FiActivity} className="w-4 h-4 mr-2 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">Activity Logs</div>
                    <div className="text-gray-500">View all agency activities</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Backend System Actions */}
            <div className="px-4 py-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Backend Systems</h4>
              <div className="space-y-2">
                <button className="flex items-center w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md">
                  <SafeIcon icon={FiDatabase} className="w-4 h-4 mr-2" />
                  Database Console
                </button>
                <button className="flex items-center w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md">
                  <SafeIcon icon={FiGlobe} className="w-4 h-4 mr-2" />
                  API Documentation
                </button>
                <button className="flex items-center w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md">
                  <SafeIcon icon={FiServer} className="w-4 h-4 mr-2" />
                  Server Monitoring
                </button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="px-4 py-3 border-t border-gray-100 bg-purple-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SafeIcon icon={FiWifi} className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-xs font-medium text-purple-900">Agency Backend Connected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-purple-700">Live</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BackendControlPanel;