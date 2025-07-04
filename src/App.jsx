import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';

import Sidebar from './components/Sidebar';
import UserMenu from './components/UserMenu';
import BackendControlPanel from './components/BackendControlPanel';
import ProtectedRoute from './components/ProtectedRoute';
import HelpHub from './components/HelpHub';

// Pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Receipts from './pages/Receipts';
import Clients from './pages/Clients';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import GetStarted from './pages/GetStarted';
import Agency from './pages/Agency';
import Subscription from './pages/Subscription';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ReceiptProvider } from './context/ReceiptContext';
import { UserProvider } from './context/UserContext';
import { AgencyProvider } from './context/AgencyContext';
import { questConfig } from './config/questConfig';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Error boundary for Quest SDK
  const QuestWrapper = ({ children }) => {
    try {
      return (
        <QuestProvider
          apiKey={questConfig.APIKEY}
          entityId={questConfig.ENTITYID}
          apiType="PRODUCTION"
        >
          {children}
        </QuestProvider>
      );
    } catch (error) {
      console.error('QuestProvider error:', error);
      return children; // Render without Quest if it fails
    }
  };

  // Main App Layout Component
  const AppLayout = ({ children }) => (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen ${isDesktop ? 'lg:ml-0' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 relative z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 ml-2 lg:ml-0">
                TaxSync Pro
              </h1>
            </div>

            {/* Right Side - User Controls */}
            <div className="flex items-center space-x-3">
              {/* Backend Control Panel */}
              <BackendControlPanel />
              
              {/* User Menu */}
              <UserMenu />

              {/* Show sidebar toggle for desktop too */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Help Hub - Fixed Position with High Z-Index */}
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 10000 
        }}>
          <HelpHub />
        </div>
      </div>
    </div>
  );

  return (
    <QuestWrapper>
      <AuthProvider>
        <AgencyProvider>
          <UserProvider>
            <ReceiptProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />

                  {/* Protected Routes */}
                  <Route 
                    path="/onboarding" 
                    element={
                      <ProtectedRoute>
                        <Onboarding />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Main App Routes with Layout */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/receipts" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Receipts />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/clients" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Clients />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/categories" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Categories />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Reports />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/subscription" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Subscription />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/agency" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Agency />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/get-started" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <GetStarted />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Settings />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all route - redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ReceiptProvider>
          </UserProvider>
        </AgencyProvider>
      </AuthProvider>
    </QuestWrapper>
  );
}

export default App;