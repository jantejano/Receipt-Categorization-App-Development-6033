import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useAgency} from '../../context/AgencyContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiX, FiCreditCard, FiCheck, FiKey, FiSettings, FiShield, FiExternalLink, FiRefreshCw, FiAlertTriangle} = FiIcons;

function StripeIntegrationManager({onClose}) {
  const {agencyData, updateStripeIntegration} = useAgency();
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: agencyData?.stripeConfig?.publishableKey || '',
    secretKey: agencyData?.stripeConfig?.secretKey || '',
    webhookSecret: agencyData?.stripeConfig?.webhookSecret || '',
    connected: agencyData?.stripeConfig?.connected || false,
    accountId: agencyData?.stripeConfig?.accountId || '',
    testMode: agencyData?.stripeConfig?.testMode || true
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, testing, success, error
  const [errors, setErrors] = useState({});

  const validateKeys = () => {
    const newErrors = {};
    
    if (!stripeConfig.publishableKey.trim()) {
      newErrors.publishableKey = 'Publishable key is required';
    } else if (!stripeConfig.publishableKey.startsWith('pk_')) {
      newErrors.publishableKey = 'Invalid publishable key format';
    }
    
    if (!stripeConfig.secretKey.trim()) {
      newErrors.secretKey = 'Secret key is required';
    } else if (!stripeConfig.secretKey.startsWith('sk_')) {
      newErrors.secretKey = 'Invalid secret key format';
    }

    // Check if keys match mode
    const isTestKey = stripeConfig.publishableKey.includes('test') || stripeConfig.secretKey.includes('test');
    if (stripeConfig.testMode && !isTestKey) {
      newErrors.mode = 'Test mode selected but live keys provided';
    } else if (!stripeConfig.testMode && isTestKey) {
      newErrors.mode = 'Live mode selected but test keys provided';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testConnection = async () => {
    if (!validateKeys()) return;
    
    setConnectionStatus('testing');
    setIsConnecting(true);
    
    try {
      // Simulate API call to test Stripe connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockAccountInfo = {
        accountId: 'acct_' + Math.random().toString(36).substring(2, 15),
        businessName: agencyData.agencyName,
        country: 'US',
        currency: 'usd'
      };
      
      setStripeConfig(prev => ({
        ...prev,
        connected: true,
        accountId: mockAccountInfo.accountId
      }));
      
      setConnectionStatus('success');
    } catch (error) {
      setConnectionStatus('error');
      setErrors({connection: 'Failed to connect to Stripe. Please check your keys.'});
    } finally {
      setIsConnecting(false);
    }
  };

  const saveConfiguration = async () => {
    if (!stripeConfig.connected) {
      alert('Please test the connection first');
      return;
    }
    
    try {
      const result = await updateStripeIntegration(stripeConfig);
      if (result.success) {
        alert('Stripe integration saved successfully!');
        onClose();
      } else {
        alert('Failed to save configuration: ' + result.error);
      }
    } catch (error) {
      alert('Error saving configuration: ' + error.message);
    }
  };

  const disconnectStripe = async () => {
    if (window.confirm('Are you sure you want to disconnect Stripe? This will disable all subscription management features.')) {
      setStripeConfig(prev => ({
        ...prev,
        connected: false,
        accountId: ''
      }));
      setConnectionStatus('idle');
    }
  };

  const handleInputChange = (field, value) => {
    setStripeConfig(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stripe Integration</h3>
                <p className="text-sm text-gray-500">Configure Stripe for subscription management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Connection Status */}
          <div className={`p-4 rounded-lg border ${
            stripeConfig.connected 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon 
                  icon={stripeConfig.connected ? FiCheck : FiAlertTriangle} 
                  className={`w-5 h-5 mr-2 ${
                    stripeConfig.connected ? 'text-green-600' : 'text-yellow-600'
                  }`} 
                />
                <div>
                  <h4 className={`font-medium ${
                    stripeConfig.connected ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    {stripeConfig.connected ? 'Stripe Connected' : 'Stripe Not Connected'}
                  </h4>
                  <p className={`text-sm ${
                    stripeConfig.connected ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {stripeConfig.connected 
                      ? `Account ID: ${stripeConfig.accountId}` 
                      : 'Configure your Stripe keys to enable subscription billing'
                    }
                  </p>
                </div>
              </div>
              {stripeConfig.connected && (
                <button
                  onClick={disconnectStripe}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Environment</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={stripeConfig.testMode}
                  onChange={() => handleInputChange('testMode', true)}
                  className="mr-2"
                />
                <span className="text-sm">Test Mode (Recommended for development)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!stripeConfig.testMode}
                  onChange={() => handleInputChange('testMode', false)}
                  className="mr-2"
                />
                <span className="text-sm">Live Mode</span>
              </label>
            </div>
            {errors.mode && (
              <p className="text-red-500 text-xs mt-1">{errors.mode}</p>
            )}
          </div>

          {/* API Keys Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiKey} className="w-4 h-4 inline mr-1" />
                Publishable Key *
              </label>
              <input
                type="text"
                value={stripeConfig.publishableKey}
                onChange={(e) => handleInputChange('publishableKey', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.publishableKey ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`pk_${stripeConfig.testMode ? 'test' : 'live'}_...`}
              />
              {errors.publishableKey && (
                <p className="text-red-500 text-xs mt-1">{errors.publishableKey}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiShield} className="w-4 h-4 inline mr-1" />
                Secret Key *
              </label>
              <input
                type="password"
                value={stripeConfig.secretKey}
                onChange={(e) => handleInputChange('secretKey', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.secretKey ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`sk_${stripeConfig.testMode ? 'test' : 'live'}_...`}
              />
              {errors.secretKey && (
                <p className="text-red-500 text-xs mt-1">{errors.secretKey}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiSettings} className="w-4 h-4 inline mr-1" />
                Webhook Endpoint Secret (Optional)
              </label>
              <input
                type="password"
                value={stripeConfig.webhookSecret}
                onChange={(e) => handleInputChange('webhookSecret', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="whsec_..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Used to verify webhook events from Stripe
              </p>
            </div>
          </div>

          {/* Test Connection */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Test Connection</h4>
              {connectionStatus === 'success' && (
                <div className="flex items-center text-green-600">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-1" />
                  <span className="text-sm">Connection successful</span>
                </div>
              )}
            </div>

            <button
              onClick={testConnection}
              disabled={isConnecting || !stripeConfig.publishableKey || !stripeConfig.secretKey}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isConnecting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Testing Connection...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </button>

            {connectionStatus === 'error' && errors.connection && (
              <p className="text-red-500 text-sm mt-2">{errors.connection}</p>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Log in to your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a></li>
              <li>Navigate to "Developers" → "API keys"</li>
              <li>Copy your Publishable key and Secret key</li>
              <li>For webhooks: Go to "Developers" → "Webhooks" → "Add endpoint"</li>
              <li>Set webhook URL to: <code className="bg-blue-100 px-1 rounded">https://your-domain.com/stripe/webhook</code></li>
              <li>Select events: <code className="bg-blue-100 px-1 rounded">customer.subscription.*</code></li>
            </ol>
          </div>

          {/* Features Enabled */}
          {stripeConfig.connected && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">Features Enabled</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Subscription billing for subaccounts
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Automatic plan upgrades/downgrades
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Usage-based billing
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Payment method management
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Invoice generation
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Webhook event handling
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                className="flex items-center px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
              >
                <SafeIcon icon={FiExternalLink} className="w-4 h-4 mr-2" />
                Open Stripe Dashboard
              </button>
              
              <button
                onClick={saveConfiguration}
                disabled={!stripeConfig.connected}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  stripeConfig.connected
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StripeIntegrationManager;