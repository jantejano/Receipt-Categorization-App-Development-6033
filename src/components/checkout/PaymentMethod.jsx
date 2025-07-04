import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCreditCard, FiDollarSign, FiShield, FiCheck } = FiIcons;

function PaymentMethod({ selectedMethod, onMethodSelect, selectedPlan, errors }) {
  // If it's a free plan, skip payment method selection
  if (selectedPlan?.monthlyPrice === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Method
          </h3>
          <p className="text-gray-600">
            No payment required for the Free plan. You can upgrade anytime.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <SafeIcon icon={FiCheck} className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-green-900 mb-2">
            Free Plan Selected
          </h4>
          <p className="text-green-700">
            Start using TaxSync Pro immediately with no payment required.
          </p>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: FiCreditCard,
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: FiDollarSign,
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Payment Method
        </h3>
        <p className="text-gray-600">
          Select your preferred payment method. Your payment information is encrypted and secure.
        </p>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onMethodSelect(method)}
          >
            {/* Popular Badge */}
            {method.popular && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Popular
                </span>
              </div>
            )}

            <div className="flex items-center">
              {/* Selection Radio */}
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                selectedMethod?.id === method.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedMethod?.id === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>

              {/* Method Icon */}
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <SafeIcon icon={method.icon} className="w-5 h-5 text-gray-600" />
              </div>

              {/* Method Details */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>

              {/* Selected Indicator */}
              {selectedMethod?.id === method.id && (
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Error Display */}
      {errors.paymentMethod && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.paymentMethod}</p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <SafeIcon icon={FiShield} className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Your payment is secure
            </h4>
            <p className="text-sm text-gray-600">
              We use bank-level encryption to protect your payment information. 
              Your card details are never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">We accept</p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
            VISA
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
            MC
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
            AMEX
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center font-bold">
            DISC
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;