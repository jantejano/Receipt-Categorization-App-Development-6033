import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiStar, FiZap, FiUsers, FiCrown } = FiIcons;

function PlanSelection({ plans, selectedPlan, billingCycle, onPlanSelect, onBillingCycleChange, errors }) {
  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free': return FiUsers;
      case 'professional': return FiZap;
      case 'team': return FiCrown;
      default: return FiUsers;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free': return 'border-gray-300 hover:border-gray-400';
      case 'professional': return 'border-blue-300 hover:border-blue-400';
      case 'team': return 'border-purple-300 hover:border-purple-400';
      default: return 'border-gray-300 hover:border-gray-400';
    }
  };

  const getSelectedColor = (planId) => {
    switch (planId) {
      case 'free': return 'border-gray-500 bg-gray-50';
      case 'professional': return 'border-blue-500 bg-blue-50';
      case 'team': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Your Plan
        </h3>
        <p className="text-gray-600">
          Select the plan that best fits your business needs. You can upgrade or downgrade at any time.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onBillingCycleChange('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onBillingCycleChange('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan?.id === plan.id;
          const PlanIcon = getPlanIcon(plan.id);
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const monthlyEquivalent = billingCycle === 'yearly' && plan.yearlyPrice > 0 
            ? plan.yearlyPrice / 12 
            : plan.monthlyPrice;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                isSelected ? getSelectedColor(plan.id) : getPlanColor(plan.id)
              }`}
              onClick={() => onPlanSelect(plan)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <SafeIcon icon={FiStar} className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.id === 'free' ? 'bg-gray-100' :
                  plan.id === 'professional' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <SafeIcon icon={PlanIcon} className={`w-6 h-6 ${
                    plan.id === 'free' ? 'text-gray-600' :
                    plan.id === 'professional' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                {price === 0 ? (
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${price}
                    </div>
                    <div className="text-sm text-gray-600">
                      {billingCycle === 'yearly' ? '/year' : '/month'}
                    </div>
                    {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        ${monthlyEquivalent.toFixed(2)}/month billed yearly
                      </div>
                    )}
                  </div>
                )}
                
                {plan.trialDays > 0 && (
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    {plan.trialDays}-day free trial
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Error Display */}
      {errors.plan && (
        <div className="text-center">
          <p className="text-red-500 text-sm">{errors.plan}</p>
        </div>
      )}

      {/* Plan Comparison Table */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Feature</th>
                <th className="text-center py-2">Free</th>
                <th className="text-center py-2">Professional</th>
                <th className="text-center py-2">Team</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-gray-100">
                <td className="py-2">Monthly Receipts</td>
                <td className="text-center py-2">50</td>
                <td className="text-center py-2">Unlimited</td>
                <td className="text-center py-2">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Storage</td>
                <td className="text-center py-2">1 GB</td>
                <td className="text-center py-2">50 GB</td>
                <td className="text-center py-2">500 GB</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">AI Categorization</td>
                <td className="text-center py-2">-</td>
                <td className="text-center py-2">✓</td>
                <td className="text-center py-2">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">API Access</td>
                <td className="text-center py-2">-</td>
                <td className="text-center py-2">✓</td>
                <td className="text-center py-2">✓</td>
              </tr>
              <tr>
                <td className="py-2">Support</td>
                <td className="text-center py-2">Email</td>
                <td className="text-center py-2">Priority</td>
                <td className="text-center py-2">24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlanSelection;