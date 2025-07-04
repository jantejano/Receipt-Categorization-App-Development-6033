import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {useAgency} from '../../context/AgencyContext';
import SafeIcon from '../../common/SafeIcon';
import SubaccountCard from './SubaccountCard';
import SubaccountForm from './SubaccountForm';
import InvitationForm from './InvitationForm';
import ActivityLog from './ActivityLog';
import AgencyStats from './AgencyStats';
import StripeIntegrationManager from './StripeIntegrationManager';
import * as FiIcons from 'react-icons/fi';

const {FiPlus,FiMail,FiUsers,FiSettings,FiFilter,FiCreditCard}=FiIcons;

function AgencyDashboard() {
  const {agencyData,subaccounts,invitations,activities,stats,loading,error}=useAgency();
  const [activeTab,setActiveTab]=useState('subaccounts');
  const [showSubaccountForm,setShowSubaccountForm]=useState(false);
  const [showInvitationForm,setShowInvitationForm]=useState(false);
  const [showStripeManager,setShowStripeManager]=useState(false);
  const [statusFilter,setStatusFilter]=useState('all');
  const [searchTerm,setSearchTerm]=useState('');

  const tabs=[
    {id: 'subaccounts',label: 'Subaccounts',icon: FiUsers,count: stats.totalSubaccounts},
    {id: 'invitations',label: 'Invitations',icon: FiMail,count: invitations.length},
    {id: 'activities',label: 'Activity Log',icon: FiSettings,count: activities.length},
  ];

  const filteredSubaccounts=subaccounts.filter(subaccount=> {
    const matchesStatus=statusFilter==='all' || subaccount.status===statusFilter;
    const matchesSearch=!searchTerm || 
      subaccount.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subaccount.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subaccount.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agency Dashboard</h1>
          <p className="text-gray-600 mt-1">{agencyData?.agencyName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={()=> setShowStripeManager(true)}
            className={`flex items-center px-4 py-2 border rounded-lg ${
              agencyData?.stripeConfig?.connected 
                ? 'bg-purple-50 border-purple-200 text-purple-700' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}
          >
            <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
            {agencyData?.stripeConfig?.connected ? 'Stripe Connected' : 'Setup Stripe'}
          </button>
          <button
            onClick={()=> setShowInvitationForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
            Send Invitation
          </button>
          <button
            onClick={()=> setShowSubaccountForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Subaccount
          </button>
        </div>
      </div>

      {/* Agency Stats */}
      <AgencyStats stats={stats} agencyData={agencyData} />

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab)=> (
              <button
                key={tab.id}
                onClick={()=> setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab===tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Subaccounts Tab */}
          {activeTab==='subaccounts' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search subaccounts..."
                      value={searchTerm}
                      onChange={(e)=> setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e)=> setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending_approval">Pending Approval</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredSubaccounts.length} of {subaccounts.length} subaccounts
                </div>
              </div>

              {/* Subaccounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubaccounts.map((subaccount,index)=> (
                  <motion.div
                    key={subaccount.id}
                    initial={{opacity: 0,y: 20}}
                    animate={{opacity: 1,y: 0}}
                    transition={{delay: index * 0.1}}
                  >
                    <SubaccountCard subaccount={subaccount} />
                  </motion.div>
                ))}
              </div>

              {filteredSubaccounts.length===0 && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !=='all' 
                      ? 'No subaccounts match your filters' 
                      : 'No subaccounts yet'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Invitations Tab */}
          {activeTab==='invitations' && (
            <div className="space-y-4">
              {invitations.map((invitation)=> (
                <div key={invitation.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Role: {invitation.role} • Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invitation.status==='pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invitation.status}
                      </span>
                      <button className="text-red-600 hover:text-red-800">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {invitations.length===0 && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiMail} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending invitations</p>
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab==='activities' && (
            <ActivityLog activities={activities} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showSubaccountForm && (
        <SubaccountForm onClose={()=> setShowSubaccountForm(false)} />
      )}

      {showInvitationForm && (
        <InvitationForm onClose={()=> setShowInvitationForm(false)} />
      )}

      {showStripeManager && (
        <StripeIntegrationManager onClose={()=> setShowStripeManager(false)} />
      )}
    </div>
  );
}

export default AgencyDashboard;