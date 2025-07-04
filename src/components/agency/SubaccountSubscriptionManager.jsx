import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useAgency} from '../../context/AgencyContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiX, FiCreditCard, FiCheck, FiZap, FiUsers, FiCrown, FiShield, FiExternalLink, FiSettings} = FiIcons;

function SubaccountSubscriptionManager({subaccount, onClose}) {
  const {updateSubaccountSubscription} = useAgency();
  const [selectedPlan, setSelectedPlan] = useState(subaccount.subscriptionPlan || 'free');
  const [isUpdating, setIsUpdating] = useState(false);

  // Available subscription plans for subaccounts
  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      type: 'basic',
      amount: 0,
      description: 'Basic expense tracking',
      icon: FiUsers,
      color: 'gray',
      features: [
        'Up to 50 receipts/month',
        '1 GB storage',
        'Basic categorization',
        'Email support'
      ],
      limits: {
        monthlyReceipts: 50,
        storage: '1 GB',
        apiCalls: 0,
        integrations: 0
      }
    },
    {
      id: 'starter',
      name: 'Starter',
      type: 'professional',
      amount: 19,
      description: 'For small businesses',
      icon: FiZap,
      color: 'blue',
      features: [
        'Up to 500 receipts/month',
        '10 GB storage',
        'AI categorization',
        'Basic API access',
        'Priority support'
      ],
      limits: {
        monthlyReceipts: 500,
        storage: '10 GB',
        apiCalls: 1000,
        integrations: 2
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      type: 'professional',
      amount: 39,
      description: 'Full business features',
      icon: FiShield,
      color: 'purple',
      features: [
        'Unlimited receipts',
        '50 GB storage',
        'Advanced AI features',
        'Full API access',
        'Bank integrations',
        '24/7 support'
      ],
      limits: {
        monthlyReceipts: -1,
        storage: '50 GB',
        apiCalls: 5000,
        integrations: 5
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'enterprise',
      amount: 99,
      description: 'Large scale operations',
      icon: FiCrown,
      color: 'gold',
      features: [
        'Unlimited everything',
        '500 GB storage',
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics',
        'White-label options'
      ],
      limits: {
        monthlyReceipts: -1,
        storage: '500 GB',
        apiCalls: -1,
        integrations: -1
      }
    }
  ];

  const currentPlan = subscriptionPlans.find(plan => plan.id === (subaccount.subscriptionPlan || 'free'));
  const newPlan = subscriptionPlans.find(plan => plan.id === selectedPlan);

  const handleUpdateSubscription = async () => {
    if (selectedPlan === subaccount.subscriptionPlan) {
      onClose();
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateSubaccountSubscription(subaccount.id, selectedPlan);
      if (result.success) {
        onClose();
      } else {
        alert('Failed to update subscription: ' + result.error);
      }
    } catch (error) {
      alert('Error updating subscription: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      gray: 'border-gray-200 bg-gray-50 text-gray-700',
      blue: 'border-blue-200 bg-blue-50 text-blue-700',
      purple: 'border-purple-200 bg-purple-50 text-purple-700',
      gold: 'border-yellow-200 bg-yellow-50 text-yellow-700'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getSelectedClasses = (color) => {
    const colorMap = {
      gray: 'border-gray-500 bg-gray-100',
      blue: 'border-blue-500 bg-blue-100',
      purple: 'border-purple-500 bg-purple-100',
      gold: 'border-yellow-500 bg-yellow-100'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                   style={{backgroundColor: subaccount.color || '#3b82f6'}}>
                {subaccount.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Subscription - {subaccount.fullName}
                </h3>
                <p className="text-sm text-gray-500">{subaccount.email}</p>
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
          {/* Current Plan Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Current Plan</h4>
                <div className="flex items-center mt-1">
                  <SafeIcon icon={currentPlan.icon} className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-900">{currentPlan.name}</span>
                  <span className="ml-2 text-blue-700">
                    {currentPlan.amount > 0 ? `$${currentPlan.amount}/month` : 'Free'}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-blue-700">
                <div>Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                <div>Status: Active</div>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Select New Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? getSelectedClasses(plan.color)
                      : getColorClasses(plan.color) + ' hover:border-opacity-70'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <SafeIcon icon={plan.icon} className="w-6 h-6 mr-3" />
                      <div>
                        <h5 className="font-semibold">{plan.name}</h5>
                        <p className="text-sm opacity-75">{plan.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {plan.amount === 0 ? 'Free' : `$${plan.amount}`}
                      </div>
                      {plan.amount > 0 && (
                        <div className="text-xs opacity-75">/month</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {selectedPlan === plan.id && (
                    <div className="mt-3 p-2 bg-white bg-opacity-50 rounded border">
                      <div className="text-xs font-medium mb-1">Plan Limits:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Receipts: {plan.limits.monthlyReceipts === -1 ? 'Unlimited' : plan.limits.monthlyReceipts}</div>
                        <div>Storage: {plan.limits.storage}</div>
                        <div>API Calls: {plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls}</div>
                        <div>Integrations: {plan.limits.integrations === -1 ? 'Unlimited' : plan.limits.integrations}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          {newPlan && newPlan.amount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Billing Information</h4>
              <div className="text-sm text-yellow-800 space-y-1">
                <div>• Plan change will be effective immediately</div>
                <div>• Billing will be prorated for the current period</div>
                <div>• Next full billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                {newPlan.amount > currentPlan.amount && (
                  <div>• Additional charge: ${(newPlan.amount - currentPlan.amount).toFixed(2)} (prorated)</div>
                )}
                {newPlan.amount < currentPlan.amount && (
                  <div>• Credit applied: ${(currentPlan.amount - newPlan.amount).toFixed(2)} (prorated)</div>
                )}
              </div>
            </div>
          )}

          {/* Usage Impact Warning */}
          {newPlan && newPlan.limits.monthlyReceipts < currentPlan.limits.monthlyReceipts && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">⚠️ Usage Limit Warning</h4>
              <p className="text-sm text-red-800">
                The selected plan has lower limits than the current plan. This may affect the user's ability to add new receipts if they exceed the new limits.
              </p>
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
              {newPlan && newPlan.id !== currentPlan.id && (
                <div className="text-right text-sm text-gray-600">
                  <div>Change from: {currentPlan.name} → {newPlan.name}</div>
                  <div>
                    Cost difference: {newPlan.amount === currentPlan.amount 
                      ? 'No change' 
                      : newPlan.amount > currentPlan.amount 
                        ? `+$${(newPlan.amount - currentPlan.amount)}/month`
                        : `-$${(currentPlan.amount - newPlan.amount)}/month`
                    }
                  </div>
                </div>
              )}
              
              <button
                onClick={handleUpdateSubscription}
                disabled={isUpdating || selectedPlan === subaccount.subscriptionPlan}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlan === subaccount.subscriptionPlan
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Updating...
                  </div>
                ) : selectedPlan === subaccount.subscriptionPlan ? (
                  'No Changes'
                ) : (
                  'Update Subscription'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SubaccountSubscriptionManager;