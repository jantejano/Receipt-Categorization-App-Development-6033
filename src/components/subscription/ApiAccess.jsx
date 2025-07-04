import React, {useState} from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiKey, FiCopy, FiRefreshCw, FiEye, FiEyeOff, FiCode, FiBook, FiActivity, FiAlertTriangle, FiCheck, FiExternalLink} = FiIcons;

function ApiAccess({currentPlan, usage, onUpgrade}) {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key_1',
      name: 'Production API Key',
      key: 'sk_live_51H7...',
      fullKey: 'sk_live_51H7QjKLOmega2024TaxSyncProduction123456789',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      permissions: ['read', 'write'],
      active: true
    },
    {
      id: 'key_2', 
      name: 'Development API Key',
      key: 'sk_test_51H7...',
      fullKey: 'sk_test_51H7QjKLOmega2024TaxSyncDevelopment123456789',
      created: '2024-01-10',
      lastUsed: '2024-01-19',
      permissions: ['read'],
      active: true
    }
  ]);

  const [showKeys, setShowKeys] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: ['read']
  });

  const hasApiAccess = currentPlan?.limits?.apiCalls > 0;
  const apiCallsUsed = usage?.apiCalls || 0;
  const apiCallsLimit = usage?.apiCallsLimit || 0;
  const usagePercentage = apiCallsLimit > 0 ? Math.round((apiCallsUsed / apiCallsLimit) * 100) : 0;

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    alert('API key copied to clipboard!');
  };

  const handleToggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCreateKey = () => {
    if (!newKeyData.name.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    const newKey = {
      id: 'key_' + Date.now(),
      name: newKeyData.name,
      key: 'sk_live_' + Math.random().toString(36).substring(2, 15) + '...',
      fullKey: 'sk_live_' + Math.random().toString(36).substring(2, 50),
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
      permissions: newKeyData.permissions,
      active: true
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyData({name: '', permissions: ['read']});
    setShowCreateForm(false);
  };

  const handleRevokeKey = (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? {...key, active: false} : key
      ));
    }
  };

  const handleRegenerateKey = (keyId) => {
    if (window.confirm('Are you sure you want to regenerate this API key? The old key will stop working immediately.')) {
      setApiKeys(prev => prev.map(key => 
        key.id === keyId 
          ? {
              ...key,
              key: 'sk_live_' + Math.random().toString(36).substring(2, 15) + '...',
              fullKey: 'sk_live_' + Math.random().toString(36).substring(2, 50),
              created: new Date().toISOString().split('T')[0]
            }
          : key
      ));
    }
  };

  if (!hasApiAccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiKey} className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">API Access Not Available</h3>
        <p className="text-gray-600 mb-6">
          API access is available on Professional and Enterprise plans. Upgrade to start building with our API.
        </p>
        <button
          onClick={onUpgrade}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Upgrade Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Usage Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-blue-900">API Usage This Month</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">{apiCallsUsed.toLocaleString()}</p>
            <p className="text-sm text-blue-600">of {apiCallsLimit.toLocaleString()} calls</p>
          </div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              usagePercentage >= 90 ? 'bg-red-500' : 
              usagePercentage >= 75 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{width: `${Math.min(usagePercentage, 100)}%`}}
          />
        </div>
        
        <div className="flex justify-between text-sm text-blue-700">
          <span>{usagePercentage}% used</span>
          <span>{(apiCallsLimit - apiCallsUsed).toLocaleString()} remaining</span>
        </div>

        {usagePercentage >= 80 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                You're approaching your API limit. Consider upgrading to avoid service interruption.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* API Keys Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiKey} className="w-4 h-4 mr-2" />
            Create New Key
          </button>
        </div>

        {/* Create API Key Form */}
        {showCreateForm && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h4 className="font-medium text-gray-900 mb-4">Create New API Key</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({...newKeyData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Production API Key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes('read')}
                      onChange={(e) => {
                        const permissions = e.target.checked 
                          ? [...newKeyData.permissions, 'read']
                          : newKeyData.permissions.filter(p => p !== 'read');
                        setNewKeyData({...newKeyData, permissions});
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">Read access (view receipts, categories, etc.)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes('write')}
                      onChange={(e) => {
                        const permissions = e.target.checked 
                          ? [...newKeyData.permissions, 'write']
                          : newKeyData.permissions.filter(p => p !== 'write');
                        setNewKeyData({...newKeyData, permissions});
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">Write access (create, update receipts)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCreateKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Key
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className={`border rounded-lg p-4 ${
                key.active ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <SafeIcon icon={FiKey} className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">{key.name}</h4>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(key.created).toLocaleDateString()}
                      {key.lastUsed && ` • Last used: ${new Date(key.lastUsed).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {key.active ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Revoked
                    </span>
                  )}
                </div>
              </div>

              {/* API Key Display */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-700">
                    {showKeys[key.id] ? key.fullKey : key.key}
                  </code>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleKeyVisibility(key.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <SafeIcon icon={showKeys[key.id] ? FiEyeOff : FiEye} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyKey(showKeys[key.id] ? key.fullKey : key.key)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <SafeIcon icon={FiCopy} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Permissions:</span>
                  {key.permissions.map(permission => (
                    <span
                      key={permission}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>

                {key.active && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRegenerateKey(key.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-1" />
                      Regenerate
                    </button>
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Revoke
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiBook} className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">API Documentation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiCode} className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Quick Start Guide</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get started with our REST API in minutes
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              View Guide <SafeIcon icon={FiExternalLink} className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiBook} className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-gray-900">API Reference</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Complete documentation for all endpoints
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              View Docs <SafeIcon icon={FiExternalLink} className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Sample API Call */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Sample API Call</h4>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400 text-sm">
              <div className="text-blue-400"># Get all receipts</div>
              <div className="text-white">curl -X GET https://api.taxsync.pro/v1/receipts \</div>
              <div className="text-white">  -H "Authorization: Bearer YOUR_API_KEY" \</div>
              <div className="text-white">  -H "Content-Type: application/json"</div>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiAccess;