import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useAgency} from '../context/AgencyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiHome, FiFileText, FiTag, FiBarChart3, FiSettings, FiX, FiUsers, FiPlay, FiShield, FiCreditCard} = FiIcons;

function Sidebar({isOpen, onClose}) {
  const location = useLocation();
  const {isAgencyOwner} = useAgency();
  const [isDesktop, setIsDesktop] = useState(false);

  const baseMenuItems = [
    {path: '/', label: 'Dashboard', icon: FiHome},
    {path: '/receipts', label: 'Receipts', icon: FiFileText},
    {path: '/clients', label: 'Clients', icon: FiUsers},
    {path: '/categories', label: 'Categories', icon: FiTag},
    {path: '/reports', label: 'Reports', icon: FiBarChart3},
    {path: '/subscription', label: 'Subscription', icon: FiCreditCard}, // Added subscription for all users
    {path: '/get-started', label: 'Get Started', icon: FiPlay},
    {path: '/settings', label: 'Settings', icon: FiSettings},
  ];

  // Add agency management for agency owners
  const menuItems = isAgencyOwner ? [
    ...baseMenuItems.slice(0, -3), // All items except Subscription, Get Started and Settings
    {path: '/agency', label: 'Agency Management', icon: FiShield},
    ...baseMenuItems.slice(-3), // Subscription, Get Started and Settings
  ] : baseMenuItems;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && !isDesktop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto ${
        isOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiFileText} className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">TaxSync Pro</span>
          </div>
          {!isDesktop && (
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Agency Owner Badge */}
        {isAgencyOwner && (
          <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiShield} className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-purple-900">Agency Owner</p>
                <p className="text-xs text-purple-600">Full management access</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => !isDesktop && onClose()}
                    className={`flex items-center px-3 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <SafeIcon
                      icon={item.icon}
                      className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.path === '/agency' && (
                      <span className="ml-auto bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                        Owner
                      </span>
                    )}
                    {item.path === '/subscription' && (
                      <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                        Pro
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            © 2024 TaxSync Pro
            {isAgencyOwner && (
              <div className="mt-1 text-purple-600 font-medium">
                Agency Edition
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;