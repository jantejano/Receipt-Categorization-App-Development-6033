import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTag, FiCheck, FiX, FiPercent } = FiIcons;

function OrderSummary({ selectedPlan, billingCycle, pricing, promoCode, onPromoCodeChange, onApplyPromo }) {
  const [promoInput, setPromoInput] = useState(promoCode || '');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const mockPromoCodes = {
    'SAVE20': { type: 'percentage', value: 20, description: '20% off first year' },
    'WELCOME10': { type: 'percentage', value: 10, description: '10% off any plan' },
    'STUDENT50': { type: 'percentage', value: 50, description: '50% off for students' },
    'NEWUSER': { type: 'fixed', value: 25, description: '$25 off first payment' }
  };

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase();
    const discount = mockPromoCodes[code];
    
    if (discount) {
      onApplyPromo(discount);
      setPromoApplied(true);
      setPromoError('');
      onPromoCodeChange(code);
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoApplied(false);
    setPromoInput('');
    setPromoError('');
    onPromoCodeChange('');
  };

  if (!selectedPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a plan to see pricing details</p>
      </div>
    );
  }

  const isYearly = billingCycle === 'yearly';
  const basePrice = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
      </div>

      {/* Selected Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-gray-900">{selectedPlan.name} Plan</h4>
            <p className="text-sm text-gray-600">
              Billed {billingCycle}
              {selectedPlan.trialDays > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  • {selectedPlan.trialDays}-day free trial
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              ${basePrice.toFixed(2)}
            </p>
            {isYearly && selectedPlan.monthlyPrice > 0 && (
              <p className="text-sm text-gray-500">
                ${(basePrice / 12).toFixed(2)}/month
              </p>
            )}
          </div>
        </div>

        {/* Yearly Savings */}
        {isYearly && selectedPlan.monthlyPrice > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center text-green-800">
              <SafeIcon icon={FiPercent} className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                You save ${((selectedPlan.monthlyPrice * 12) - selectedPlan.yearlyPrice).toFixed(2)} with yearly billing
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Promo Code */}
      {basePrice > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <SafeIcon icon={FiTag} className="w-4 h-4 inline mr-1" />
            Promo Code
          </label>
          {!promoApplied ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter promo code"
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center text-green-800">
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{promoInput}</span>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-green-600 hover:text-green-800"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-red-500 text-xs">{promoError}</p>
          )}
          
          {/* Sample Promo Codes */}
          <div className="text-xs text-gray-500">
            <p>Try: SAVE20, WELCOME10, STUDENT50, NEWUSER</p>
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${pricing.subtotal.toFixed(2)}</span>
        </div>
        
        {pricing.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="text-green-600">-${pricing.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">Calculated at checkout</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${pricing.total.toFixed(2)}</span>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          {billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
        </p>
      </div>

      {/* Plan Features */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">What's included:</h4>
        <div className="space-y-2">
          {selectedPlan.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <SafeIcon icon={FiCheck} className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          {selectedPlan.features.length > 4 && (
            <p className="text-xs text-gray-500 ml-5">
              +{selectedPlan.features.length - 4} more features
            </p>
          )}
        </div>
      </div>

      {/* Money Back Guarantee */}
      {basePrice > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-gray-700">
            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium">30-day money-back guarantee</p>
              <p className="text-xs text-gray-600">Cancel anytime, no questions asked</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummary;