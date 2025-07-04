import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {useAgency} from '../../context/AgencyContext';
import SafeIcon from '../../common/SafeIcon';
import SubaccountSubscriptionManager from './SubaccountSubscriptionManager';
import * as FiIcons from 'react-icons/fi';

const {FiUser,FiMail,FiBriefcase,FiClock,FiHardDrive,FiMoreVertical,FiPlay,FiPause,FiTrash2,FiSettings,FiShield,FiEye,FiCheck,FiX,FiCreditCard,FiZap,FiUsers,FiCrown}=FiIcons;

function SubaccountCard({subaccount}) {
  const {updateSubaccountStatus,deleteSubaccount,updateSubaccountPermissions}=useAgency();
  const [showActions,setShowActions]=useState(false);
  const [showPermissions,setShowPermissions]=useState(false);
  const [showSubscription,setShowSubscription]=useState(false);
  const [isUpdating,setIsUpdating]=useState(false);

  const getStatusColor=(status)=> {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor=(role)=> {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionIcon = (plan) => {
    switch (plan) {
      case 'enterprise': return FiCrown;
      case 'professional': return FiShield;
      case 'starter': return FiZap;
      case 'free': 
      default: return FiUsers;
    }
  };

  const getSubscriptionColor = (plan) => {
    switch (plan) {
      case 'enterprise': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'professional': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'starter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'free':
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatBytes=(bytes)=> {
    if (bytes===0) return '0 Bytes';
    const k=1024;
    const sizes=['Bytes','KB','MB','GB'];
    const i=Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStoragePercentage=()=> {
    return Math.round((subaccount.storageUsed / subaccount.maxStorage) * 100);
  };

  const handleStatusChange=async (newStatus)=> {
    setIsUpdating(true);
    const result=await updateSubaccountStatus(subaccount.id,newStatus);
    if (result.success) {
      setShowActions(false);
    }
    setIsUpdating(false);
  };

  const handleDelete=async ()=> {
    if (window.confirm(`Are you sure you want to delete ${subaccount.fullName}'s account? This action cannot be undone.`)) {
      setIsUpdating(true);
      const result=await deleteSubaccount(subaccount.id);
      if (result.success) {
        // Account deleted successfully
      }
      setIsUpdating(false);
    }
  };

  const availablePermissions=[
    'receipts.read','receipts.write','receipts.delete',
    'categories.read','categories.write','categories.delete',
    'clients.read','clients.write','clients.delete',
    'reports.read','reports.write',
    'settings.read','settings.write'
  ];

  const handlePermissionChange=async (permission,isChecked)=> {
    const newPermissions=isChecked 
      ? [...subaccount.permissions,permission]
      : subaccount.permissions.filter(p=> p !==permission);
    await updateSubaccountPermissions(subaccount.id,newPermissions);
  };

  return (
    <motion.div
      whileHover={{y: -2}}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative"
    >
      {/* Actions Dropdown */}
      <div className="absolute top-4 right-4">
        <button
          onClick={()=> setShowActions(!showActions)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          disabled={isUpdating}
        >
          <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
        </button>

        {showActions && (
          <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 w-48">
            <button
              onClick={()=> {setShowSubscription(true); setShowActions(false);}}
              className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
            >
              <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
              Manage Subscription
            </button>
            
            <button
              onClick={()=> setShowPermissions(true)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
              Manage Permissions
            </button>

            {subaccount.status==='active' ? (
              <button
                onClick={()=> handleStatusChange('suspended')}
                className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                disabled={isUpdating}
              >
                <SafeIcon icon={FiPause} className="w-4 h-4 mr-2" />
                Suspend Account
              </button>
            ) : (
              <button
                onClick={()=> handleStatusChange('active')}
                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                disabled={isUpdating}
              >
                <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
                Activate Account
              </button>
            )}

            {subaccount.status==='pending_approval' && (
              <button
                onClick={()=> handleStatusChange('active')}
                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                disabled={isUpdating}
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                Approve Account
              </button>
            )}

            <hr className="my-2" />
            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              disabled={isUpdating}
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {subaccount.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {subaccount.fullName}
          </h3>
          <p className="text-sm text-gray-500 truncate">{subaccount.email}</p>
          {subaccount.businessName && (
            <p className="text-sm text-gray-600 truncate">{subaccount.businessName}</p>
          )}
        </div>
      </div>

      {/* Status and Role */}
      <div className="flex items-center space-x-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subaccount.status)}`}>
          {subaccount.status.replace('_',' ')}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(subaccount.role)}`}>
          {subaccount.role}
        </span>
      </div>

      {/* Subscription Plan */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getSubscriptionColor(subaccount.subscriptionPlan || 'free')}`}>
          <SafeIcon icon={getSubscriptionIcon(subaccount.subscriptionPlan || 'free')} className="w-3 h-3 mr-1" />
          {(subaccount.subscriptionPlan || 'free').charAt(0).toUpperCase() + (subaccount.subscriptionPlan || 'free').slice(1)} Plan
        </div>
        {subaccount.subscriptionAmount && subaccount.subscriptionAmount > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            ${subaccount.subscriptionAmount}/month
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
            Last Login
          </div>
          <span className="text-gray-900">
            {subaccount.lastLogin ? new Date(subaccount.lastLogin).toLocaleDateString() : 'Never'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
            Login Count
          </div>
          <span className="text-gray-900">{subaccount.loginCount}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <SafeIcon icon={FiHardDrive} className="w-4 h-4 mr-2" />
              Storage Used
            </div>
            <span className="text-gray-900">
              {formatBytes(subaccount.storageUsed)} / {formatBytes(subaccount.maxStorage)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                getStoragePercentage() > 80 ? 'bg-red-500' : 
                getStoragePercentage() > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{width: `${getStoragePercentage()}%`}}
            />
          </div>
          <p className="text-xs text-gray-500">{getStoragePercentage()}% used</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <SafeIcon icon={FiShield} className="w-4 h-4 mr-2" />
            Permissions
          </div>
          <span className="text-gray-900">{subaccount.permissions.length}</span>
        </div>
      </div>

      {/* Created Date */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Created {new Date(subaccount.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Subscription Manager Modal */}
      {showSubscription && (
        <SubaccountSubscriptionManager
          subaccount={subaccount}
          onClose={() => setShowSubscription(false)}
        />
      )}

      {/* Permissions Modal */}
      {showPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{opacity: 0,scale: 0.9}}
            animate={{opacity: 1,scale: 1}}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Permissions - {subaccount.fullName}
                </h3>
                <button
                  onClick={()=> setShowPermissions(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePermissions.map((permission)=> (
                  <label key={permission} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subaccount.permissions.includes(permission)}
                      onChange={(e)=> handlePermissionChange(permission,e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {permission.replace('.',' ').replace(/\b\w/g,l=> l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={()=> setShowPermissions(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
}

export default SubaccountCard;