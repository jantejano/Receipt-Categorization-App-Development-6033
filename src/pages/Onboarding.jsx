import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import { questConfig } from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiCheckCircle, FiArrowRight, FiStar, FiTarget, FiTrendingUp } = FiIcons;

function Onboarding() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Get user data safely
  const getUserId = () => {
    if (user?.userId) return user.userId;
    
    // Fallback to localStorage
    try {
      const userId = localStorage.getItem('userId');
      if (userId && userId !== 'undefined' && userId !== 'null') {
        return userId;
      }
    } catch (error) {
      console.warn('Error getting userId from localStorage:', error);
    }
    
    return questConfig.USER_ID;
  };

  const getToken = () => {
    if (user?.token) return user.token;
    
    // Fallback to localStorage
    try {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        return token;
      }
    } catch (error) {
      console.warn('Error getting token from localStorage:', error);
    }
    
    return questConfig.TOKEN;
  };

  const getAnswers = () => {
    console.log('Onboarding completed with answers:', answers);
    
    // Mark user as no longer new
    if (user) {
      const updatedUser = { ...user, isNewUser: false };
      localStorage.setItem('userEmail', updatedUser.email);
    }
    
    // Navigate to main dashboard after completion
    navigate('/', { replace: true });
  };

  const benefits = [
    {
      icon: FiTarget,
      title: 'Personalized Setup',
      description: 'Customize your experience based on your business needs'
    },
    {
      icon: FiTrendingUp,
      title: 'Smart Categories',
      description: 'AI-powered expense categorization for accurate tracking'
    },
    {
      icon: FiStar,
      title: 'Expert Guidance',
      description: 'Get tips and best practices from tax professionals'
    }
  ];

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Section - Welcome & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <SafeIcon icon={FiFileText} className="w-7 h-7 text-white" />
              </div>
              <span className="ml-4 text-2xl font-bold">TaxSync Pro</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Let's Get You
              <span className="block text-purple-200">Set Up!</span>
            </h1>

            <p className="text-xl text-purple-100 mb-12 leading-relaxed">
              We'll help you configure TaxSync Pro to match your business needs. This quick setup will personalize your experience and get you started on the right track.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <SafeIcon icon={benefit.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-purple-100 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-center mb-3">
                <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-green-300 mr-3" />
                <span className="font-semibold text-lg">Quick & Easy</span>
              </div>
              <p className="text-purple-100 text-sm">
                This setup takes just 2-3 minutes and will significantly improve your experience with TaxSync Pro.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:hidden"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiFileText} className="w-7 h-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">TaxSync Pro</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started!</h2>
            <p className="text-gray-600">Quick setup to personalize your experience</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Get Started!</h2>
            <p className="text-gray-600">We're setting up your personalized TaxSync Pro experience</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            <div className="quest-onboarding-container p-6">
              <OnBoarding
                userId={getUserId()}
                token={getToken()}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                accent={questConfig.PRIMARY_COLOR}
                primaryColor={questConfig.PRIMARY_COLOR}
                singleChoose="modal1"
                multiChoice="modal2"
                width="100%"
                height="auto"
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip setup for now
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>Need help? Contact our support team at support@taxsync.pro</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;