import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import { questConfig } from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiShield, FiTrendingUp, FiUsers } = FiIcons;

function Login() {
  const navigate = useNavigate();
  const { handleQuestLogin, isAuthenticated } = useAuth();

  // Show demo options only in development
  const showDemoOptions = import.meta.env.DEV || localStorage.getItem('showDemoOptions') === 'true';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = ({ userId, token, newUser }) => {
    try {
      console.log('Login data received:', { userId, token, newUser });
      
      const result = handleQuestLogin({ userId, token, newUser });
      
      if (result.success) {
        if (newUser) {
          console.log('New user detected, redirecting to onboarding');
          navigate('/onboarding', { replace: true });
        } else {
          console.log('Existing user, redirecting to dashboard');
          navigate('/', { replace: true });
        }
      } else {
        console.error('Login failed:', result.error);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  // Demo login buttons for testing (only in development)
  const handleDemoLogin = (email) => {
    const result = handleQuestLogin({ 
      userId: 'demo-' + Date.now(), 
      token: 'demo-token-' + Date.now(), 
      newUser: email === 'newuser@example.com' 
    });
    
    if (result.success) {
      if (result.isNewUser) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  const features = [
    {
      icon: FiFileText,
      title: 'Receipt Management',
      description: 'Digitize and organize all your receipts in one place'
    },
    {
      icon: FiTrendingUp,
      title: 'Expense Tracking',
      description: 'Track expenses with detailed analytics and reports'
    },
    {
      icon: FiUsers,
      title: 'Client Management',
      description: 'Manage clients and associate expenses with projects'
    },
    {
      icon: FiShield,
      title: 'Tax Compliance',
      description: 'Stay compliant with automated tax categorization'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
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
              Welcome Back to Your
              <span className="block text-blue-200">Financial Hub</span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Streamline your expense management, track receipts, and stay tax-compliant with our comprehensive business solution.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <SafeIcon icon={feature.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
      </div>

      {/* Right Section - Authentication */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:hidden"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiFileText} className="w-7 h-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">TaxSync Pro</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue managing your expenses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="quest-login-container">
              <QuestLogin
                onSubmit={handleLogin}
                email={true}
                google={false}
                accent={questConfig.PRIMARY_COLOR}
                primaryColor={questConfig.PRIMARY_COLOR}
                width="100%"
                height="auto"
              />
            </div>

            {/* Demo Login Buttons for Development Only */}
            {showDemoOptions && (
              <div className="mt-6 space-y-2">
                <div className="text-xs text-gray-500 text-center mb-3">Demo Login Options (Development Only):</div>
                <button
                  onClick={() => handleDemoLogin('agency@taxsync.com')}
                  className="w-full px-3 py-2 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100"
                >
                  Login as Agency Owner
                </button>
                <button
                  onClick={() => handleDemoLogin('admin@taxsync.com')}
                  className="w-full px-3 py-2 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
                >
                  Login as Admin User
                </button>
                <button
                  onClick={() => handleDemoLogin('user@example.com')}
                  className="w-full px-3 py-2 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded hover:bg-gray-100"
                >
                  Login as Regular User
                </button>
                <button
                  onClick={() => handleDemoLogin('newuser@example.com')}
                  className="w-full px-3 py-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
                >
                  Login as New User (→ Onboarding)
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>Need help? Contact our support team at support@taxsync.pro</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;