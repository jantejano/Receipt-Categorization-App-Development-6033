import React, {useState} from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import PricingCard from '../components/subscription/PricingCard';
import BillingHistory from '../components/subscription/BillingHistory';
import UsageMetrics from '../components/subscription/UsageMetrics';
import ApiAccess from '../components/subscription/ApiAccess';
import StorageManagement from '../components/subscription/StorageManagement';
import IntegrationSettings from '../components/subscription/IntegrationSettings';
import * as FiIcons from 'react-icons/fi';

const {FiCreditCard, FiDownload, FiSettings, FiShield, FiZap, FiDatabase, FiKey, FiLink} = FiIcons;

function Subscription() {
  const [activeTab, setActiveTab] = useState('plans');
  const [loading, setLoading] = useState(false);

  // Updated subscription plans with Free tier and adjusted pricing
  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      type: 'basic',
      amount: 0,
      priceId: null,
      paymentLink: null,
      currency: 'usd',
      interval: 'month',
      yearlyDiscount: 0,
      description: 'Perfect for getting started with basic expense tracking',
      features: [
        {name: 'Up to 50 receipts per month', included: true},
        {name: 'Basic categorization', included: true},
        {name: '1 GB storage', included: true},
        {name: 'Basic reporting', included: true},
        {name: 'Email support', included: true},
        {name: 'Mobile app access', included: true},
        {name: 'API access', included: false},
        {name: 'Bank integrations', included: false},
        {name: 'Webhook integrations', included: false},
        {name: 'Advanced reporting & analytics', included: false},
        {name: 'Priority support', included: false},
        {name: 'Advanced security features', included: false}
      ],
      limits: {
        users: 1,
        storage: '1 GB',
        storageBytes: 1 * 1024 * 1024 * 1024,
        monthlyReceipts: 50,
        apiCalls: 0,
        bankConnections: 0,
        webhooks: 0
      },
      additionalInfo: 'No credit card required'
    },
    {
      id: 'professional',
      name: 'Professional',
      type: 'professional',
      amount: 39,
      priceId: 'price_1RhChUBKjN9dxjzpobuizgfO',
      paymentLink: 'https://buy.stripe.com/cNi8wObrs7fX3894hg4Ja02',
      currency: 'usd',
      interval: 'month',
      yearlyDiscount: 20,
      description: 'Best for small businesses and freelancers',
      features: [
        {name: 'Unlimited receipts', included: true},
        {name: 'AI-powered categorization', included: true},
        {name: '50 GB storage', included: true},
        {name: 'Advanced reporting & analytics', included: true},
        {name: 'API access (5,000 calls/month)', included: true},
        {name: 'Basic bank integrations (2 accounts)', included: true},
        {name: 'Webhook integrations (5 endpoints)', included: true},
        {name: 'Priority email support', included: true},
        {name: 'Bulk import/export', included: true},
        {name: 'Custom categories', included: true},
        {name: 'Advanced security features', included: true},
        {name: 'Mobile app access', included: true}
      ],
      limits: {
        users: 5,
        storage: '50 GB',
        storageBytes: 50 * 1024 * 1024 * 1024,
        monthlyReceipts: -1,
        apiCalls: 5000,
        bankConnections: 2,
        webhooks: 5
      },
      additionalInfo: 'Additional users: $19/month each',
      addOnPricing: {
        additionalUser: 19
      }
    },
    {
      id: 'team',
      name: 'Team',
      type: 'enterprise',
      amount: 99,
      priceId: 'price_1RhChUBKjN9dxjzpSCElvY7O',
      paymentLink: 'https://buy.stripe.com/fZu28q3Z00RzcIJdRQ4Ja01',
      currency: 'usd',
      interval: 'month',
      yearlyDiscount: 25,
      description: 'For growing teams with advanced collaboration needs',
      features: [
        {name: 'Unlimited receipts', included: true},
        {name: 'AI-powered categorization', included: true},
        {name: '500 GB storage', included: true},
        {name: 'Advanced reporting & analytics', included: true},
        {name: 'Full API access (10,000 calls/month)', included: true},
        {name: 'Full bank integrations (unlimited accounts)', included: true},
        {name: 'Advanced webhook integrations (unlimited)', included: true},
        {name: '24/7 priority support', included: true},
        {name: 'Advanced security & compliance', included: true},
        {name: 'Custom integrations', included: true},
        {name: 'Team collaboration tools', included: true},
        {name: 'Advanced user management', included: true}
      ],
      limits: {
        users: 25,
        storage: '500 GB',
        storageBytes: 500 * 1024 * 1024 * 1024,
        monthlyReceipts: -1,
        apiCalls: 10000,
        bankConnections: -1,
        webhooks: -1
      },
      additionalInfo: 'Perfect for teams up to 25 users'
    }
  ];

  // Mock current subscription
  const currentSubscription = {
    planId: 'professional',
    status: 'active',
    currentPeriodStart: '2024-01-15',
    currentPeriodEnd: '2024-02-15',
    cancelAtPeriodEnd: false
  };

  // Enhanced usage data
  const usageData = {
    activeUsers: 3,
    storageUsed: 15 * 1024 * 1024 * 1024,
    monthlyReceipts: 1247,
    apiCalls: 3542,
    apiCallsLimit: 5000,
    bankConnections: 1,
    bankConnectionsLimit: 2,
    webhooks: 3,
    webhooksLimit: 5
  };

  // Mock billing history
  const billingHistory = [
    {
      id: 'inv_001',
      invoiceNumber: 'INV-2024-001',
      date: '2024-01-15',
      planName: 'Professional',
      amount: 39.00,
      status: 'paid'
    },
    {
      id: 'inv_002',
      invoiceNumber: 'INV-2023-012',
      date: '2023-12-15',
      planName: 'Professional',
      amount: 39.00,
      status: 'paid'
    },
    {
      id: 'inv_003',
      invoiceNumber: 'INV-2023-011',
      date: '2023-11-15',
      planName: 'Free',
      amount: 0.00,
      status: 'paid'
    }
  ];

  const currentPlan = subscriptionPlans.find(plan => plan.id === currentSubscription.planId);

  const handleSelectPlan = async (plan) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (plan.amount === 0) {
        alert(`Switched to ${plan.name} plan successfully!`);
      } else {
        alert(`Upgraded to ${plan.name} plan successfully! You will be redirected to payment.`);
      }
      setLoading(false);
    }, 2000);
  };

  const handleDownloadInvoice = (invoice) => {
    // Mock invoice download
    const invoiceData = {
      invoice: invoice,
      downloadedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {id: 'plans', label: 'Plans & Pricing', icon: FiCreditCard},
    {id: 'usage', label: 'Usage & Limits', icon: FiZap},
    {id: 'api', label: 'API Access', icon: FiKey},
    {id: 'storage', label: 'Storage Management', icon: FiDatabase},
    {id: 'integrations', label: 'Integrations', icon: FiLink},
    {id: 'billing', label: 'Billing History', icon: FiDownload},
    {id: 'settings', label: 'Billing Settings', icon: FiSettings}
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600 mt-1">Manage your plan, API access, integrations, and billing</p>
        </div>
        {/* Current Plan Badge */}
        <div className="text-right">
          <div className="flex items-center">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Current Plan:</span>
          </div>
          <div className="mt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {currentPlan?.name} Plan
            </span>
          </div>
        </div>
      </div>

      {/* Current Subscription Status */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {currentPlan?.name} Plan Active
              </h3>
              <p className="text-blue-700">
                Next billing: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                {currentPlan?.amount > 0 && ` • $${currentPlan.amount}/${currentPlan.interval}`}
              </p>
              <div className="flex items-center mt-2 space-x-4 text-sm text-blue-600">
                <span>API: {usageData.apiCalls}/{usageData.apiCallsLimit} calls</span>
                <span>Storage: {Math.round(usageData.storageUsed / (1024 * 1024 * 1024))}GB/{currentPlan?.limits.storage}</span>
                <span>Users: {usageData.activeUsers}/{currentPlan?.limits.users}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentSubscription.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {currentSubscription.status === 'active' ? 'Active' : 'Inactive'}
            </div>
            {currentSubscription.cancelAtPeriodEnd && (
              <p className="text-sm text-orange-600 mt-1">
                Cancels at period end
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-8 px-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Plans & Pricing Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Plan</h3>
                <p className="text-gray-600">
                  Select the plan that best fits your business needs. You can upgrade or downgrade at any time.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.1}}
                  >
                    <PricingCard
                      plan={plan}
                      isCurrentPlan={plan.id === currentSubscription.planId}
                      isPopular={plan.id === 'professional'}
                      onSelectPlan={handleSelectPlan}
                      loading={loading}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Additional User Pricing for Professional Plan */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Need More Users?</h3>
                    <p className="text-green-700">
                      Professional plan includes 5 users. Add additional users for just <strong>$19/month each</strong>.
                    </p>
                    <div className="mt-3 text-sm text-green-600">
                      <p>• Perfect for growing teams</p>
                      <p>• All Professional features included</p>
                      <p>• Cancel additional users anytime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-900">$19</div>
                    <div className="text-sm text-green-600">per user/month</div>
                    <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Add Users
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Usage & Limits Tab */}
          {activeTab === 'usage' && (
            <UsageMetrics
              usage={usageData}
              limits={currentPlan?.limits}
              currentPlan={currentPlan?.name}
            />
          )}

          {/* API Access Tab */}
          {activeTab === 'api' && (
            <ApiAccess
              currentPlan={currentPlan}
              usage={usageData}
              onUpgrade={() => setActiveTab('plans')}
            />
          )}

          {/* Storage Management Tab */}
          {activeTab === 'storage' && (
            <StorageManagement
              currentPlan={currentPlan}
              usage={usageData}
              onUpgrade={() => setActiveTab('plans')}
            />
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <IntegrationSettings
              currentPlan={currentPlan}
              usage={usageData}
              onUpgrade={() => setActiveTab('plans')}
            />
          )}

          {/* Billing History Tab */}
          {activeTab === 'billing' && (
            <BillingHistory
              invoices={billingHistory}
              onDownloadInvoice={handleDownloadInvoice}
            />
          )}

          {/* Billing Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Billing Settings</h3>
                <p className="text-gray-600">Manage your payment methods and billing preferences.</p>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h4>
                {/* Mock payment method */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        Default
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  + Add New Payment Method
                </button>
              </div>

              {/* Billing Address */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-gray-900">TaxSync Pro</p>
                  <p className="text-gray-600">123 Business St</p>
                  <p className="text-gray-600">San Francisco, CA 94105</p>
                  <p className="text-gray-600">United States</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                    Edit Address
                  </button>
                </div>
              </div>

              {/* Subscription Actions */}
              <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <h4 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h4>
                <p className="text-red-700 text-sm mb-4">
                  These actions cannot be undone. Please proceed with caution.
                </p>
                <div className="space-y-3">
                  {!currentSubscription.cancelAtPeriodEnd ? (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                      Cancel Subscription
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Reactivate Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Subscription;