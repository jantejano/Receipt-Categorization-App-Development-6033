import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiMail, FiDownload, FiArrowRight, FiStar } = FiIcons;

function CheckoutSuccess({ orderData, pricing, onClose }) {
  const handleGetStarted = () => {
    onClose();
    // Navigate to dashboard or onboarding
    window.location.hash = '/dashboard';
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      plan: orderData.selectedPlan.name,
      amount: pricing.total,
      date: new Date().toISOString(),
      billingCycle: orderData.billingCycle,
      customer: orderData.billingDetails
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taxsync-receipt-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Welcome to TaxSync Pro!</h2>
          <p className="text-green-100">
            {orderData.selectedPlan.monthlyPrice === 0 
              ? 'Your free account is ready to use'
              : 'Your subscription has been activated'
            }
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">{orderData.selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-medium text-gray-900">
                  {orderData.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
                </span>
              </div>
              {pricing.total > 0 && (
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span>${pricing.total.toFixed(2)}</span>
                </div>
              )}
              {orderData.selectedPlan.trialDays > 0 && pricing.total > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                  <p className="text-blue-800 text-sm">
                    <SafeIcon icon={FiStar} className="w-4 h-4 inline mr-1" />
                    Your {orderData.selectedPlan.trialDays}-day free trial starts now. 
                    You won't be charged until {new Date(Date.now() + orderData.selectedPlan.trialDays * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Check your email</h4>
                  <p className="text-gray-600 text-sm">
                    We've sent a confirmation email with your account details and getting started guide.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Complete your setup</h4>
                  <p className="text-gray-600 text-sm">
                    Add your first receipt and explore the dashboard to get familiar with TaxSync Pro.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Import existing data</h4>
                  <p className="text-gray-600 text-sm">
                    Use our bulk import feature to bring in your existing receipts and expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Get Started</span>
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
            </button>
            
            {pricing.total > 0 && (
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
            )}
          </div>

          {/* Support */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <SafeIcon icon={FiMail} className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Need Help?</h4>
                <p className="text-blue-700 text-sm">
                  Our support team is here to help you get started. Email us at support@taxsync.pro
                </p>
              </div>
            </div>
          </div>

          {/* Plan Features Reminder */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Your {orderData.selectedPlan.name} Plan Includes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {orderData.selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CheckoutSuccess;