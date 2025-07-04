import React from 'react';
import { motion } from 'framer-motion';
import GetStartedComponent from '../components/GetStartedComponent';

function GetStarted() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
        <div className="text-sm text-gray-500">
          Complete your onboarding journey
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <GetStartedComponent />
      </motion.div>
    </div>
  );
}

export default GetStarted;