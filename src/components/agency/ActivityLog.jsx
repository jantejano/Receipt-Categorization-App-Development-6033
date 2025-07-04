import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, FiUserPlus, FiUserMinus, FiPause, FiPlay,
  FiMail, FiSettings, FiShield, FiClock, FiFilter 
} = FiIcons;

function ActivityLog({ activities }) {
  const [filter, setFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const getActionIcon = (actionType) => {
    const iconMap = {
      'subaccount_created': FiUserPlus,
      'subaccount_deleted': FiUserMinus,
      'subaccount_suspended': FiPause,
      'subaccount_activated': FiPlay,
      'permissions_updated': FiShield,
      'role_changed': FiUser,
      'invitation_sent': FiMail,
      'invitation_accepted': FiUser,
      'login_attempt': FiUser,
      'password_reset': FiSettings,
      'settings_updated': FiSettings
    };
    return iconMap[actionType] || FiSettings;
  };

  const getActionColor = (actionType) => {
    const colorMap = {
      'subaccount_created': 'text-green-600 bg-green-100',
      'subaccount_deleted': 'text-red-600 bg-red-100',
      'subaccount_suspended': 'text-orange-600 bg-orange-100',
      'subaccount_activated': 'text-green-600 bg-green-100',
      'permissions_updated': 'text-blue-600 bg-blue-100',
      'role_changed': 'text-purple-600 bg-purple-100',
      'invitation_sent': 'text-indigo-600 bg-indigo-100',
      'invitation_accepted': 'text-green-600 bg-green-100',
      'login_attempt': 'text-gray-600 bg-gray-100',
      'password_reset': 'text-yellow-600 bg-yellow-100',
      'settings_updated': 'text-blue-600 bg-blue-100'
    };
    return colorMap[actionType] || 'text-gray-600 bg-gray-100';
  };

  const formatActionText = (activity) => {
    const { actionType, actionDetails, performedBy } = activity;
    
    switch (actionType) {
      case 'subaccount_created':
        return `Created subaccount for ${actionDetails.email} (${actionDetails.name})`;
      case 'subaccount_deleted':
        return `Deleted subaccount for ${actionDetails.email}`;
      case 'subaccount_suspended':
        return `Suspended ${actionDetails.email}${actionDetails.reason ? ` - ${actionDetails.reason}` : ''}`;
      case 'subaccount_activated':
        return `Activated ${actionDetails.email}`;
      case 'permissions_updated':
        return `Updated permissions for ${actionDetails.email}`;
      case 'role_changed':
        return `Changed role for ${actionDetails.email} from ${actionDetails.oldRole} to ${actionDetails.newRole}`;
      case 'invitation_sent':
        return `Sent invitation to ${actionDetails.email} for ${actionDetails.role} role`;
      case 'invitation_accepted':
        return `${actionDetails.email} accepted invitation`;
      case 'login_attempt':
        return `Login attempt by ${actionDetails.email}`;
      case 'password_reset':
        return `Password reset for ${actionDetails.email}`;
      case 'settings_updated':
        return `Updated agency settings`;
      default:
        return `${actionType.replace('_', ' ')} action performed`;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.actionType === filter;
    
    let matchesTimeFilter = true;
    if (timeFilter !== 'all') {
      const activityDate = new Date(activity.createdAt);
      const now = new Date();
      
      switch (timeFilter) {
        case 'today':
          matchesTimeFilter = activityDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTimeFilter = activityDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTimeFilter = activityDate >= monthAgo;
          break;
      }
    }
    
    return matchesFilter && matchesTimeFilter;
  });

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'subaccount_created', label: 'Account Created' },
    { value: 'subaccount_suspended', label: 'Account Suspended' },
    { value: 'subaccount_activated', label: 'Account Activated' },
    { value: 'invitation_sent', label: 'Invitation Sent' },
    { value: 'permissions_updated', label: 'Permissions Updated' }
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {actionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {timeFilters.map(time => (
              <option key={time.value} value={time.value}>{time.label}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-500">
          {filteredActivities.length} of {activities.length} activities
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => {
          const Icon = getActionIcon(activity.actionType);
          const colorClasses = getActionColor(activity.actionType);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClasses}`}>
                <SafeIcon icon={Icon} className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {formatActionText(activity)}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">
                    by {activity.performedBy}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
                
                {/* Additional Details */}
                {activity.actionDetails && Object.keys(activity.actionDetails).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                      Show details
                    </summary>
                    <div className="mt-2 p-2 bg-white rounded border text-xs">
                      <pre className="whitespace-pre-wrap text-gray-700">
                        {JSON.stringify(activity.actionDetails, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                {new Date(activity.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter !== 'all' || timeFilter !== 'all' 
              ? 'No activities match your filters' 
              : 'No activities yet'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default ActivityLog;