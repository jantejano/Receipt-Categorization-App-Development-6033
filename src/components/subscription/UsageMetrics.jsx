import React from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiUsers, FiHardDrive, FiFileText, FiActivity, FiTrendingUp, FiAlertTriangle, FiKey, FiCreditCard, FiSend} = FiIcons;

function UsageMetrics({usage, limits, currentPlan}) {
  const getUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const parseStorageLimit = (limitStr) => {
    const match = limitStr.match(/(\d+)\s*(GB|TB|MB)/i);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2].toUpperCase();
    
    switch (unit) {
      case 'TB': return value * 1024 * 1024 * 1024 * 1024;
      case 'GB': return value * 1024 * 1024 * 1024;
      case 'MB': return value * 1024 * 1024;
      default: return value;
    }
  };

  const storageLimit = parseStorageLimit(limits.storage);
  const storagePercentage = storageLimit > 0 ? getUsagePercentage(usage.storageUsed, storageLimit) : 0;

  const metrics = [
    {
      title: 'Active Users',
      current: usage.activeUsers,
      limit: limits.users,
      icon: FiUsers,
      color: 'blue',
      unit: 'users'
    },
    {
      title: 'Storage Used',
      current: usage.storageUsed,
      limit: storageLimit,
      icon: FiHardDrive,
      color: 'purple',
      unit: 'bytes',
      formatter: formatBytes
    },
    {
      title: 'Monthly Receipts',
      current: usage.monthlyReceipts,
      limit: limits.monthlyReceipts,
      icon: FiFileText,
      color: 'green',
      unit: 'receipts'
    },
    {
      title: 'API Calls',
      current: usage.apiCalls || 0,
      limit: limits.apiCalls || 0,
      icon: FiKey,
      color: 'orange',
      unit: 'calls'
    },
    {
      title: 'Bank Connections',
      current: usage.bankConnections || 0,
      limit: limits.bankConnections || 0,
      icon: FiCreditCard,
      color: 'emerald',
      unit: 'connections'
    },
    {
      title: 'Webhooks',
      current: usage.webhooks || 0,
      limit: limits.webhooks || 0,
      icon: FiSend,
      color: 'indigo',
      unit: 'endpoints'
    }
  ];

  const isNearLimit = metrics.some(metric => {
    if (metric.limit === -1 || metric.limit === 0) return false;
    return getUsagePercentage(metric.current, metric.limit) >= 80;
  });

  return (
    <div className="space-y-6">
      {/* Alert for near limits */}
      {isNearLimit && (
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h4 className="font-medium text-yellow-800">Usage Warning</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You're approaching your plan limits. Consider upgrading to avoid service interruption.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Plan Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan Usage</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {currentPlan}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const percentage = getUsagePercentage(metric.current, metric.limit);
            const isUnlimited = metric.limit === -1;
            const hasFeature = metric.limit > 0 || isUnlimited;

            return (
              <motion.div
                key={metric.title}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: index * 0.1}}
                className={`space-y-3 ${!hasFeature ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={metric.icon} className={`w-5 h-5 text-${metric.color}-500 mr-2`} />
                    <span className="font-medium text-gray-900">{metric.title}</span>
                  </div>
                  {!isUnlimited && hasFeature && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUsageColor(percentage)}`}>
                      {percentage}%
                    </span>
                  )}
                  {!hasFeature && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      Not available
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {metric.formatter ? metric.formatter(metric.current) : metric.current.toLocaleString()} 
                      {!metric.formatter && ' ' + metric.unit}
                    </span>
                    <span className="text-gray-600">
                      {!hasFeature ? 'Upgrade required' : 
                       isUnlimited ? 'Unlimited' : 
                       `${metric.formatter ? metric.formatter(metric.limit) : metric.limit.toLocaleString()} ${!metric.formatter ? metric.unit : ''}`}
                    </span>
                  </div>
                  
                  {hasFeature && !isUnlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(percentage)}`}
                        style={{width: `${Math.min(percentage, 100)}%`}}
                      />
                    </div>
                  )}
                  
                  {hasFeature && isUnlimited && (
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500 w-full" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Usage Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Growth Rate</p>
            <p className="text-xl font-bold text-green-600">+12%</p>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiActivity} className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Daily Average</p>
            <p className="text-xl font-bold text-blue-600">{Math.round(usage.monthlyReceipts / 30)}</p>
            <p className="text-xs text-gray-500">receipts per day</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">User Activity</p>
            <p className="text-xl font-bold text-purple-600">89%</p>
            <p className="text-xs text-gray-500">active this month</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {isNearLimit && (
            <div className="flex items-start">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Consider upgrading your plan</p>
                <p className="text-sm text-gray-600">You're approaching your current limits. Upgrade to avoid interruptions.</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Optimize your usage</p>
              <p className="text-sm text-gray-600">Archive old receipts and clean up unused data to free up storage space.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Invite team members</p>
              <p className="text-sm text-gray-600">
                You have {limits.users === -1 ? 'unlimited' : limits.users - usage.activeUsers} user slots available.
              </p>
            </div>
          </div>
          
          {(limits.apiCalls > 0 || limits.bankConnections > 0 || limits.webhooks > 0) && (
            <div className="flex items-start">
              <SafeIcon icon={FiKey} className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Explore integrations</p>
                <p className="text-sm text-gray-600">
                  Connect your bank accounts and set up webhooks to automate your workflow.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsageMetrics;