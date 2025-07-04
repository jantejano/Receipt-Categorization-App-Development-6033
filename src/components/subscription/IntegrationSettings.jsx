import React, {useState} from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiLink, FiPlus, FiCheck, FiX, FiSettings, FiCreditCard, FiSend, FiDatabase, FiShield, FiAlertTriangle, FiExternalLink, FiEdit, FiTrash2} = FiIcons;

function IntegrationSettings({currentPlan, usage, onUpgrade}) {
  const [activeIntegrations, setActiveIntegrations] = useState([
    {
      id: 'bank_1',
      type: 'bank',
      name: 'Chase Business Checking',
      accountNumber: '****1234',
      status: 'connected',
      lastSync: '2024-01-20T10:30:00Z',
      transactionsImported: 156
    },
    {
      id: 'webhook_1',
      type: 'webhook',
      name: 'Accounting System Sync',
      url: 'https://accounting.company.com/webhook/receipts',
      status: 'active',
      lastTriggered: '2024-01-20T15:45:00Z',
      eventTypes: ['receipt.created', 'receipt.updated']
    },
    {
      id: 'webhook_2',
      type: 'webhook',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/...',
      status: 'active',
      lastTriggered: '2024-01-20T14:20:00Z',
      eventTypes: ['receipt.created']
    }
  ]);

  const [showBankForm, setShowBankForm] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bankName: '',
    accountType: 'checking',
    routingNumber: '',
    accountNumber: ''
  });
  const [webhookFormData, setWebhookFormData] = useState({
    name: '',
    url: '',
    events: []
  });

  const bankConnectionsUsed = usage?.bankConnections || 0;
  const bankConnectionsLimit = usage?.bankConnectionsLimit || 0;
  const webhooksUsed = usage?.webhooks || 0;
  const webhooksLimit = usage?.webhooksLimit || 0;

  const hasBankAccess = currentPlan?.limits?.bankConnections > 0;
  const hasWebhookAccess = currentPlan?.limits?.webhooks > 0;

  const availableBanks = [
    {name: 'Chase Bank', logo: '🏦', popular: true},
    {name: 'Bank of America', logo: '🏛️', popular: true},
    {name: 'Wells Fargo', logo: '🏦', popular: true},
    {name: 'Citibank', logo: '🏛️', popular: false},
    {name: 'Capital One', logo: '🏦', popular: false},
    {name: 'US Bank', logo: '🏛️', popular: false}
  ];

  const webhookEvents = [
    {id: 'receipt.created', name: 'Receipt Created', description: 'Triggered when a new receipt is added'},
    {id: 'receipt.updated', name: 'Receipt Updated', description: 'Triggered when a receipt is modified'},
    {id: 'receipt.deleted', name: 'Receipt Deleted', description: 'Triggered when a receipt is deleted'},
    {id: 'category.created', name: 'Category Created', description: 'Triggered when a new category is created'},
    {id: 'export.completed', name: 'Export Completed', description: 'Triggered when a data export is finished'}
  ];

  const handleConnectBank = () => {
    if (!bankFormData.bankName || !bankFormData.accountNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newBank = {
      id: 'bank_' + Date.now(),
      type: 'bank',
      name: bankFormData.bankName,
      accountNumber: '****' + bankFormData.accountNumber.slice(-4),
      status: 'connected',
      lastSync: new Date().toISOString(),
      transactionsImported: 0
    };

    setActiveIntegrations(prev => [...prev, newBank]);
    setBankFormData({bankName: '', accountType: 'checking', routingNumber: '', accountNumber: ''});
    setShowBankForm(false);
  };

  const handleCreateWebhook = () => {
    if (!webhookFormData.name || !webhookFormData.url || webhookFormData.events.length === 0) {
      alert('Please fill in all required fields and select at least one event');
      return;
    }

    const newWebhook = {
      id: 'webhook_' + Date.now(),
      type: 'webhook',
      name: webhookFormData.name,
      url: webhookFormData.url,
      status: 'active',
      lastTriggered: null,
      eventTypes: webhookFormData.events
    };

    setActiveIntegrations(prev => [...prev, newWebhook]);
    setWebhookFormData({name: '', url: '', events: []});
    setShowWebhookForm(false);
  };

  const handleDisconnect = (integrationId) => {
    if (window.confirm('Are you sure you want to disconnect this integration?')) {
      setActiveIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
    }
  };

  const handleTestWebhook = (webhook) => {
    alert(`Testing webhook: ${webhook.name}\nSending test payload to ${webhook.url}`);
  };

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Integrations */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-900">Bank Connections</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-900">{bankConnectionsUsed}</p>
              <p className="text-sm text-green-600">
                of {bankConnectionsLimit === -1 ? '∞' : bankConnectionsLimit} allowed
              </p>
            </div>
          </div>
          
          {!hasBankAccess && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-3">Bank integrations available on Professional and Enterprise plans</p>
              <button
                onClick={onUpgrade}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </div>

        {/* Webhook Integrations */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <SafeIcon icon={FiSend} className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-900">Webhooks</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">{webhooksUsed}</p>
              <p className="text-sm text-blue-600">
                of {webhooksLimit === -1 ? '∞' : webhooksLimit} allowed
              </p>
            </div>
          </div>
          
          {!hasWebhookAccess && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-3">Webhook integrations available on Professional and Enterprise plans</p>
              <button
                onClick={onUpgrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Integrations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Active Integrations</h3>
          <div className="flex items-center space-x-3">
            {hasBankAccess && (bankConnectionsLimit === -1 || bankConnectionsUsed < bankConnectionsLimit) && (
              <button
                onClick={() => setShowBankForm(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
                Connect Bank
              </button>
            )}
            {hasWebhookAccess && (webhooksLimit === -1 || webhooksUsed < webhooksLimit) && (
              <button
                onClick={() => setShowWebhookForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                Add Webhook
              </button>
            )}
          </div>
        </div>

        {/* Bank Connection Form */}
        {showBankForm && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <h4 className="font-medium text-gray-900 mb-4">Connect Bank Account</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <select
                  value={bankFormData.bankName}
                  onChange={(e) => setBankFormData({...bankFormData, bankName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select your bank</option>
                  {availableBanks.map(bank => (
                    <option key={bank.name} value={bank.name}>
                      {bank.logo} {bank.name} {bank.popular ? '(Popular)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={bankFormData.accountType}
                  onChange={(e) => setBankFormData({...bankFormData, accountType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData({...bankFormData, accountNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={bankFormData.routingNumber}
                  onChange={(e) => setBankFormData({...bankFormData, routingNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Routing number"
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Your banking information is encrypted and secure. We use bank-level security to protect your data.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={handleConnectBank}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Connect Bank
              </button>
              <button
                onClick={() => setShowBankForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Webhook Form */}
        {showWebhookForm && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h4 className="font-medium text-gray-900 mb-4">Create Webhook</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Name
                </label>
                <input
                  type="text"
                  value={webhookFormData.name}
                  onChange={(e) => setWebhookFormData({...webhookFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Slack Notifications"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={webhookFormData.url}
                  onChange={(e) => setWebhookFormData({...webhookFormData, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-app.com/webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Events to Subscribe
                </label>
                <div className="space-y-2">
                  {webhookEvents.map(event => (
                    <label key={event.id} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={webhookFormData.events.includes(event.id)}
                        onChange={(e) => {
                          const events = e.target.checked
                            ? [...webhookFormData.events, event.id]
                            : webhookFormData.events.filter(id => id !== event.id);
                          setWebhookFormData({...webhookFormData, events});
                        }}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{event.name}</span>
                        <p className="text-xs text-gray-500">{event.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={handleCreateWebhook}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Webhook
              </button>
              <button
                onClick={() => setShowWebhookForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Integrations List */}
        <div className="space-y-4">
          {activeIntegrations.map((integration) => (
            <div
              key={integration.id}
              className={`border rounded-lg p-4 ${
                integration.status === 'connected' || integration.status === 'active'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SafeIcon 
                    icon={integration.type === 'bank' ? FiCreditCard : FiSend} 
                    className={`w-6 h-6 mr-3 ${
                      integration.status === 'connected' || integration.status === 'active'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`} 
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {integration.type === 'bank' ? (
                        <>
                          <span>Account: {integration.accountNumber}</span>
                          <span>Last sync: {new Date(integration.lastSync).toLocaleDateString()}</span>
                          <span>{integration.transactionsImported} transactions imported</span>
                        </>
                      ) : (
                        <>
                          <span>{integration.eventTypes.length} events</span>
                          {integration.lastTriggered && (
                            <span>Last triggered: {new Date(integration.lastTriggered).toLocaleDateString()}</span>
                          )}
                        </>
                      )}
                    </div>
                    {integration.type === 'webhook' && (
                      <p className="text-xs text-gray-500 mt-1">{integration.url}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'connected' || integration.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {integration.status}
                  </span>
                  
                  {integration.type === 'webhook' && integration.status === 'active' && (
                    <button
                      onClick={() => handleTestWebhook(integration)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Test
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeIntegrations.length === 0 && (
          <div className="text-center py-8">
            <SafeIcon icon={FiLink} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No integrations connected yet</p>
          </div>
        )}
      </div>

      {/* Integration Marketplace */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Marketplace</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                💰
              </div>
              <h4 className="font-medium text-gray-900">QuickBooks</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Sync receipts with QuickBooks for seamless accounting</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Learn More <SafeIcon icon={FiExternalLink} className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                📊
              </div>
              <h4 className="font-medium text-gray-900">Excel</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Export data automatically to Excel spreadsheets</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Learn More <SafeIcon icon={FiExternalLink} className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                🔔
              </div>
              <h4 className="font-medium text-gray-900">Slack</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get notifications in Slack when receipts are added</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              Learn More <SafeIcon icon={FiExternalLink} className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntegrationSettings;