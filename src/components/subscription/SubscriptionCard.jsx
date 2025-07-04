import React from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiCheck, FiX, FiCrown, FiZap, FiUsers, FiShield} = FiIcons;

function SubscriptionCard({plan, isCurrentPlan, isPopular, onSelectPlan, loading}) {
  const getFeatureIcon = (included) => included ? FiCheck : FiX;
  const getFeatureColor = (included) => included ? 'text-green-500' : 'text-gray-400';

  const getPlanIcon = (planType) => {
    switch(planType) {
      case 'enterprise': return FiCrown;
      case 'professional': return FiZap;
      case 'basic': return FiUsers;
      default: return FiShield;
    }
  };

  const PlanIcon = getPlanIcon(plan.type);

  return (
    <motion.div
      whileHover={!isCurrentPlan ? {y: -4} : {}}
      className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
        isCurrentPlan 
          ? 'border-blue-500 bg-blue-50/50' 
          : isPopular 
            ? 'border-purple-500' 
            : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Current Plan
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Plan Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isCurrentPlan 
              ? 'bg-blue-100' 
              : isPopular 
                ? 'bg-purple-100' 
                : 'bg-gray-100'
          }`}>
            <SafeIcon 
              icon={PlanIcon} 
              className={`w-8 h-8 ${
                isCurrentPlan 
                  ? 'text-blue-600' 
                  : isPopular 
                    ? 'text-purple-600' 
                    : 'text-gray-600'
              }`} 
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          
          {/* Pricing */}
          <div className="mb-6">
            {plan.price === 0 ? (
              <div className="text-4xl font-bold text-gray-900">Free</div>
            ) : (
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600 ml-2">/{plan.billingCycle}</span>
              </div>
            )}
            {plan.yearlyDiscount && (
              <p className="text-sm text-green-600 mt-1">
                Save {plan.yearlyDiscount}% with yearly billing
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <SafeIcon 
                icon={getFeatureIcon(feature.included)} 
                className={`w-5 h-5 mr-3 ${getFeatureColor(feature.included)}`} 
              />
              <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Plan Limits</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Users</span>
              <span className="font-medium text-gray-900">
                {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium text-gray-900">{plan.limits.storage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Receipts</span>
              <span className="font-medium text-gray-900">
                {plan.limits.monthlyReceipts === -1 ? 'Unlimited' : plan.limits.monthlyReceipts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Calls</span>
              <span className="font-medium text-gray-900">
                {plan.limits.apiCalls === -1 ? 'Unlimited' : `${plan.limits.apiCalls}/month`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectPlan(plan)}
          disabled={isCurrentPlan || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isCurrentPlan
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isPopular
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </div>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : plan.price === 0 ? (
            'Downgrade to Free'
          ) : (
            `Upgrade to ${plan.name}`
          )}
        </button>

        {/* Additional Info */}
        {plan.additionalInfo && (
          <p className="text-xs text-gray-500 text-center mt-3">
            {plan.additionalInfo}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default SubscriptionCard;