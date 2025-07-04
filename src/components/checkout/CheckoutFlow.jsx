import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import CheckoutSteps from './CheckoutSteps';
import PlanSelection from './PlanSelection';
import PaymentMethod from './PaymentMethod';
import BillingDetails from './BillingDetails';
import OrderSummary from './OrderSummary';
import CheckoutSuccess from './CheckoutSuccess';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiLock, FiShield, FiCheck } = FiIcons;

function CheckoutFlow({ initialPlan = null, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    selectedPlan: initialPlan,
    billingCycle: 'monthly',
    paymentMethod: null,
    billingDetails: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      taxId: ''
    },
    promoCode: '',
    discount: null,
    agreedToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);

  // Available plans with enhanced pricing structure
  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        'Up to 50 receipts/month',
        'Basic categorization',
        '1 GB storage',
        'Email support'
      ],
      popular: false,
      trialDays: 0
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 39,
      yearlyPrice: 390, // 2 months free
      description: 'Best for small businesses',
      features: [
        'Unlimited receipts',
        'AI categorization',
        '50 GB storage',
        'API access',
        'Priority support'
      ],
      popular: true,
      trialDays: 14
    },
    {
      id: 'team',
      name: 'Team',
      monthlyPrice: 99,
      yearlyPrice: 990, // 2 months free
      description: 'For growing teams',
      features: [
        'Everything in Professional',
        '500 GB storage',
        'Advanced integrations',
        '24/7 support',
        'Team collaboration'
      ],
      popular: false,
      trialDays: 14
    }
  ];

  const steps = [
    { id: 1, name: 'Plan', description: 'Choose your plan' },
    { id: 2, name: 'Payment', description: 'Payment method' },
    { id: 3, name: 'Details', description: 'Billing details' },
    { id: 4, name: 'Review', description: 'Review order' }
  ];

  // Calculate pricing with discounts
  const calculateTotal = () => {
    if (!checkoutData.selectedPlan) return { subtotal: 0, discount: 0, total: 0 };

    const plan = plans.find(p => p.id === checkoutData.selectedPlan.id);
    if (!plan) return { subtotal: 0, discount: 0, total: 0 };

    const isYearly = checkoutData.billingCycle === 'yearly';
    const subtotal = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    
    let discount = 0;
    
    // Yearly discount
    if (isYearly && plan.monthlyPrice > 0) {
      const yearlyDiscount = (plan.monthlyPrice * 12) - plan.yearlyPrice;
      discount += yearlyDiscount;
    }
    
    // Promo code discount
    if (checkoutData.discount) {
      if (checkoutData.discount.type === 'percentage') {
        discount += subtotal * (checkoutData.discount.value / 100);
      } else {
        discount += checkoutData.discount.value;
      }
    }

    const total = Math.max(0, subtotal - discount);
    
    return { subtotal, discount, total };
  };

  const handleStepChange = (step) => {
    if (step < currentStep || validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!checkoutData.selectedPlan) {
          newErrors.plan = 'Please select a plan';
        }
        break;
      case 2:
        if (!checkoutData.paymentMethod && checkoutData.selectedPlan?.monthlyPrice > 0) {
          newErrors.paymentMethod = 'Please select a payment method';
        }
        break;
      case 3:
        if (checkoutData.selectedPlan?.monthlyPrice > 0) {
          if (!checkoutData.billingDetails.firstName) {
            newErrors.firstName = 'First name is required';
          }
          if (!checkoutData.billingDetails.lastName) {
            newErrors.lastName = 'Last name is required';
          }
          if (!checkoutData.billingDetails.email) {
            newErrors.email = 'Email is required';
          }
        }
        break;
      case 4:
        if (!checkoutData.agreedToTerms && checkoutData.selectedPlan?.monthlyPrice > 0) {
          newErrors.terms = 'Please agree to the terms and conditions';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleCompleteOrder();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOrder = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For free plans, just mark as complete
      if (checkoutData.selectedPlan.monthlyPrice === 0) {
        setOrderComplete(true);
        return;
      }

      // For paid plans, process payment
      const orderData = {
        plan: checkoutData.selectedPlan,
        billingCycle: checkoutData.billingCycle,
        paymentMethod: checkoutData.paymentMethod,
        billingDetails: checkoutData.billingDetails,
        pricing: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      console.log('Processing order:', orderData);
      
      // Simulate successful payment
      setOrderComplete(true);
      
    } catch (error) {
      console.error('Order processing error:', error);
      setErrors({ order: 'Failed to process order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateCheckoutData = (updates) => {
    setCheckoutData(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  if (orderComplete) {
    return (
      <CheckoutSuccess
        orderData={checkoutData}
        pricing={calculateTotal()}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors mr-4"
              >
                <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold">Upgrade to TaxSync Pro</h2>
                <p className="text-blue-100 text-sm">
                  Join thousands of businesses managing expenses effortlessly
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <SafeIcon icon={FiLock} className="w-4 h-4" />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <CheckoutSteps
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Side - Form Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <PlanSelection
                    plans={plans}
                    selectedPlan={checkoutData.selectedPlan}
                    billingCycle={checkoutData.billingCycle}
                    onPlanSelect={(plan) => updateCheckoutData({ selectedPlan: plan })}
                    onBillingCycleChange={(cycle) => updateCheckoutData({ billingCycle: cycle })}
                    errors={errors}
                  />
                )}

                {currentStep === 2 && (
                  <PaymentMethod
                    selectedMethod={checkoutData.paymentMethod}
                    onMethodSelect={(method) => updateCheckoutData({ paymentMethod: method })}
                    selectedPlan={checkoutData.selectedPlan}
                    errors={errors}
                  />
                )}

                {currentStep === 3 && (
                  <BillingDetails
                    details={checkoutData.billingDetails}
                    onDetailsChange={(details) => updateCheckoutData({ billingDetails: details })}
                    selectedPlan={checkoutData.selectedPlan}
                    errors={errors}
                  />
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Review Your Order
                      </h3>
                      <p className="text-gray-600">
                        Please review your order details before completing your purchase.
                      </p>
                    </div>

                    {/* Order Review */}
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {checkoutData.selectedPlan?.name} Plan
                          </h4>
                          <p className="text-sm text-gray-600">
                            Billed {checkoutData.billingCycle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${calculateTotal().subtotal.toFixed(2)}
                          </p>
                          {checkoutData.billingCycle === 'yearly' && checkoutData.selectedPlan?.monthlyPrice > 0 && (
                            <p className="text-sm text-green-600">
                              Save ${((checkoutData.selectedPlan.monthlyPrice * 12) - checkoutData.selectedPlan.yearlyPrice).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {checkoutData.selectedPlan?.trialDays > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 inline mr-1" />
                            Start with a {checkoutData.selectedPlan.trialDays}-day free trial
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Terms Agreement */}
                    {checkoutData.selectedPlan?.monthlyPrice > 0 && (
                      <div className="space-y-4">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkoutData.agreedToTerms}
                            onChange={(e) => updateCheckoutData({ agreedToTerms: e.target.checked })}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-blue-600 hover:underline">
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                        {errors.terms && (
                          <p className="text-red-500 text-sm">{errors.terms}</p>
                        )}
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Secure Payment Processing
                          </p>
                          <p className="text-sm text-blue-700">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Display */}
            {errors.order && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{errors.order}</p>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-80 bg-gray-50 border-l border-gray-200 p-6">
            <OrderSummary
              selectedPlan={checkoutData.selectedPlan}
              billingCycle={checkoutData.billingCycle}
              pricing={calculateTotal()}
              promoCode={checkoutData.promoCode}
              onPromoCodeChange={(code) => updateCheckoutData({ promoCode: code })}
              onApplyPromo={(discount) => updateCheckoutData({ discount })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  ${calculateTotal().total.toFixed(2)}
                  {checkoutData.billingCycle === 'yearly' ? '/year' : '/month'}
                </p>
              </div>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : currentStep === 4 ? (
                  checkoutData.selectedPlan?.monthlyPrice === 0 ? 'Get Started' : 'Complete Purchase'
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CheckoutFlow;