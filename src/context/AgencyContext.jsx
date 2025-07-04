import React,{createContext,useContext,useState,useEffect} from 'react';
import {useAuth} from './AuthContext';
import supabase from '../lib/supabase';

const AgencyContext=createContext();

const initialState={
  isAgencyOwner: false,
  agencyData: null,
  subaccounts: [],
  invitations: [],
  activities: [],
  stats: {
    totalSubaccounts: 0,
    activeSubaccounts: 0,
    suspendedSubaccounts: 0,
    pendingSubaccounts: 0,
    storageUsed: 0,
    activeUsers30d: 0
  },
  loading: false,
  error: null
};

// Safe localStorage functions
const safeGetItem=(key,defaultValue=null)=> {
  if (typeof window==='undefined' || typeof localStorage==='undefined') {
    return defaultValue;
  }
  try {
    const item=localStorage.getItem(key);
    if (item===null || item===undefined || item==='undefined' || item==='null' || item==='') {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`SafeGetItem error for key "${key}":`,error);
    return defaultValue;
  }
};

const safeSetItem=(key,value)=> {
  if (typeof window==='undefined' || typeof localStorage==='undefined') {
    return false;
  }
  try {
    if (value===undefined || value===null) {
      localStorage.removeItem(key);
      return true;
    }
    localStorage.setItem(key,JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`SafeSetItem error for key "${key}":`,error);
    return false;
  }
};

export function AgencyProvider({children}) {
  const [state,setState]=useState(initialState);
  const {user}=useAuth();

  // Mock data for demonstration (replace with Supabase calls)
  const mockAgencyData={
    id: 'agency-1',
    email: 'agency@taxsync.com',
    agencyName: 'TaxSync Agency',
    subscriptionPlan: 'enterprise',
    maxSubaccounts: 100,
    currentSubaccounts: 15,
    status: 'active',
    stripeConfig: {
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookSecret: 'whsec_...',
      connected: true,
      accountId: 'acct_1234567890',
      testMode: true
    },
    settings: {
      allowSubaccountDeletion: true,
      requireApprovalForSignup: false,
      autoAssignCategories: true,
      defaultPermissions: ['receipts.read','receipts.write','categories.read']
    }
  };

  const mockSubaccounts=[
    {
      id: 'sub-1',
      email: 'client1@business.com',
      fullName: 'John Smith',
      businessName: 'Smith Consulting',
      role: 'user',
      status: 'active',
      subscriptionPlan: 'professional',
      subscriptionAmount: 39,
      permissions: ['receipts.read','receipts.write','categories.read'],
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
      loginCount: 45,
      storageUsed: 524288000,
      maxStorage: 1073741824,
      createdAt: new Date(Date.now() - 7776000000).toISOString()
    },
    {
      id: 'sub-2',
      email: 'client2@company.com',
      fullName: 'Sarah Johnson',
      businessName: 'Johnson LLC',
      role: 'manager',
      status: 'active',
      subscriptionPlan: 'starter',
      subscriptionAmount: 19,
      permissions: ['receipts.read','receipts.write','categories.read','reports.read'],
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      loginCount: 120,
      storageUsed: 314572800,
      maxStorage: 1073741824,
      createdAt: new Date(Date.now() - 15552000000).toISOString()
    },
    {
      id: 'sub-3',
      email: 'client3@startup.com',
      fullName: 'Mike Davis',
      businessName: 'Davis Startup',
      role: 'user',
      status: 'suspended',
      subscriptionPlan: 'free',
      subscriptionAmount: 0,
      permissions: ['receipts.read'],
      lastLogin: new Date(Date.now() - 2592000000).toISOString(),
      loginCount: 12,
      storageUsed: 104857600,
      maxStorage: 1073741824,
      createdAt: new Date(Date.now() - 5184000000).toISOString()
    },
    {
      id: 'sub-4',
      email: 'newclient@example.com',
      fullName: 'Emily Rodriguez',
      businessName: 'Rodriguez Enterprises',
      role: 'user',
      status: 'pending_approval',
      subscriptionPlan: 'free',
      subscriptionAmount: 0,
      permissions: ['receipts.read'],
      lastLogin: null,
      loginCount: 0,
      storageUsed: 0,
      maxStorage: 1073741824,
      createdAt: new Date().toISOString()
    }
  ];

  const mockInvitations=[
    {
      id: 'inv-1',
      email: 'prospect@business.com',
      invitedBy: 'agency@taxsync.com',
      role: 'user',
      status: 'pending',
      expiresAt: new Date(Date.now() + 604800000).toISOString(),
      token: 'abc123def456',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'inv-2',
      email: 'manager@newcompany.com',
      invitedBy: 'agency@taxsync.com',
      role: 'manager',
      status: 'pending',
      expiresAt: new Date(Date.now() + 432000000).toISOString(),
      token: 'xyz789uvw012',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const mockActivities=[
    {
      id: 'act-1',
      actionType: 'subaccount_created',
      actionDetails: {email: 'newclient@example.com',name: 'Emily Rodriguez'},
      performedBy: 'agency@taxsync.com',
      createdAt: new Date().toISOString()
    },
    {
      id: 'act-2',
      actionType: 'subscription_updated',
      actionDetails: {email: 'client1@business.com',oldPlan: 'starter',newPlan: 'professional'},
      performedBy: 'agency@taxsync.com',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'act-3',
      actionType: 'subaccount_suspended',
      actionDetails: {email: 'client3@startup.com',reason: 'Non-payment'},
      performedBy: 'agency@taxsync.com',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'act-4',
      actionType: 'invitation_sent',
      actionDetails: {email: 'prospect@business.com',role: 'user'},
      performedBy: 'agency@taxsync.com',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Load agency data when user changes
  useEffect(()=> {
    if (user) {
      loadAgencyData();
    } else {
      setState(initialState);
    }
  },[user]);

  const loadAgencyData=async ()=> {
    setState(prev=> ({...prev,loading: true,error: null}));

    try {
      const isOwner=user?.isAgencyOwner || false;

      if (isOwner) {
        const stats={
          totalSubaccounts: mockSubaccounts.length,
          activeSubaccounts: mockSubaccounts.filter(s=> s.status==='active').length,
          suspendedSubaccounts: mockSubaccounts.filter(s=> s.status==='suspended').length,
          pendingSubaccounts: mockSubaccounts.filter(s=> s.status==='pending_approval').length,
          storageUsed: mockSubaccounts.reduce((sum,s)=> sum + s.storageUsed,0),
          activeUsers30d: mockSubaccounts.filter(s=> 
            s.lastLogin && new Date(s.lastLogin) > new Date(Date.now() - 2592000000)
          ).length
        };

        setState(prev=> ({
          ...prev,
          isAgencyOwner: true,
          agencyData: mockAgencyData,
          subaccounts: mockSubaccounts,
          invitations: mockInvitations,
          activities: mockActivities,
          stats,
          loading: false
        }));

        safeSetItem('agencyData',mockAgencyData);
        safeSetItem('subaccounts',mockSubaccounts);
      } else {
        setState(prev=> ({...prev,isAgencyOwner: false,loading: false}));
      }
    } catch (error) {
      console.error('Error loading agency data:',error);
      setState(prev=> ({...prev,error: error.message,loading: false}));
    }
  };

  const updateSubaccountSubscription=async (subaccountId,newPlan)=> {
    try {
      setState(prev=> ({...prev,loading: true}));

      const planPricing={
        free: 0,
        starter: 19,
        professional: 39,
        enterprise: 99
      };

      const updatedSubaccounts=state.subaccounts.map(sub=> 
        sub.id===subaccountId 
          ? {
              ...sub,
              subscriptionPlan: newPlan,
              subscriptionAmount: planPricing[newPlan] || 0,
              updatedAt: new Date().toISOString()
            }
          : sub
      );

      const subaccount=state.subaccounts.find(sub=> sub.id===subaccountId);
      const oldPlan=subaccount.subscriptionPlan || 'free';

      const newActivity={
        id: 'act-' + Date.now(),
        actionType: 'subscription_updated',
        actionDetails: {
          email: subaccount.email,
          oldPlan: oldPlan,
          newPlan: newPlan,
          oldAmount: planPricing[oldPlan] || 0,
          newAmount: planPricing[newPlan] || 0
        },
        performedBy: state.agencyData.email,
        createdAt: new Date().toISOString()
      };

      setState(prev=> ({
        ...prev,
        subaccounts: updatedSubaccounts,
        activities: [newActivity,...prev.activities],
        loading: false
      }));

      safeSetItem('subaccounts',updatedSubaccounts);

      return {success: true};
    } catch (error) {
      setState(prev=> ({...prev,loading: false,error: error.message}));
      return {success: false,error: error.message};
    }
  };

  const updateStripeIntegration=async (stripeConfig)=> {
    try {
      const updatedAgencyData={
        ...state.agencyData,
        stripeConfig: stripeConfig
      };

      setState(prev=> ({
        ...prev,
        agencyData: updatedAgencyData
      }));

      safeSetItem('agencyData',updatedAgencyData);

      return {success: true};
    } catch (error) {
      return {success: false,error: error.message};
    }
  };

  const createSubaccount=async (subaccountData)=> {
    try {
      setState(prev=> ({...prev,loading: true}));

      const newSubaccount={
        id: 'sub-' + Date.now(),
        ...subaccountData,
        status: mockAgencyData.settings.requireApprovalForSignup ? 'pending_approval' : 'active',
        subscriptionPlan: 'free',
        subscriptionAmount: 0,
        permissions: mockAgencyData.settings.defaultPermissions,
        loginCount: 0,
        storageUsed: 0,
        maxStorage: 1073741824,
        lastLogin: null,
        createdAt: new Date().toISOString()
      };

      const updatedSubaccounts=[...state.subaccounts,newSubaccount];

      const newActivity={
        id: 'act-' + Date.now(),
        actionType: 'subaccount_created',
        actionDetails: {
          email: subaccountData.email,
          name: subaccountData.fullName
        },
        performedBy: state.agencyData.email,
        createdAt: new Date().toISOString()
      };

      setState(prev=> ({
        ...prev,
        subaccounts: updatedSubaccounts,
        activities: [newActivity,...prev.activities],
        stats: {
          ...prev.stats,
          totalSubaccounts: updatedSubaccounts.length,
          activeSubaccounts: updatedSubaccounts.filter(s=> s.status==='active').length,
          pendingSubaccounts: updatedSubaccounts.filter(s=> s.status==='pending_approval').length
        },
        loading: false
      }));

      safeSetItem('subaccounts',updatedSubaccounts);
      return {success: true,subaccount: newSubaccount};
    } catch (error) {
      setState(prev=> ({...prev,loading: false,error: error.message}));
      return {success: false,error: error.message};
    }
  };

  const updateSubaccountStatus=async (subaccountId,newStatus,reason='')=> {
    try {
      setState(prev=> ({...prev,loading: true}));

      const updatedSubaccounts=state.subaccounts.map(sub=> 
        sub.id===subaccountId 
          ? {...sub,status: newStatus,updatedAt: new Date().toISOString()}
          : sub
      );

      const subaccount=state.subaccounts.find(sub=> sub.id===subaccountId);

      const newActivity={
        id: 'act-' + Date.now(),
        actionType: newStatus==='suspended' ? 'subaccount_suspended' : 'subaccount_activated',
        actionDetails: {
          email: subaccount.email,
          oldStatus: subaccount.status,
          newStatus: newStatus,
          reason: reason
        },
        performedBy: state.agencyData.email,
        createdAt: new Date().toISOString()
      };

      setState(prev=> ({
        ...prev,
        subaccounts: updatedSubaccounts,
        activities: [newActivity,...prev.activities],
        stats: {
          ...prev.stats,
          activeSubaccounts: updatedSubaccounts.filter(s=> s.status==='active').length,
          suspendedSubaccounts: updatedSubaccounts.filter(s=> s.status==='suspended').length,
          pendingSubaccounts: updatedSubaccounts.filter(s=> s.status==='pending_approval').length
        },
        loading: false
      }));

      safeSetItem('subaccounts',updatedSubaccounts);
      return {success: true};
    } catch (error) {
      setState(prev=> ({...prev,loading: false,error: error.message}));
      return {success: false,error: error.message};
    }
  };

  const deleteSubaccount=async (subaccountId)=> {
    try {
      setState(prev=> ({...prev,loading: true}));

      const subaccount=state.subaccounts.find(sub=> sub.id===subaccountId);
      const updatedSubaccounts=state.subaccounts.filter(sub=> sub.id !==subaccountId);

      const newActivity={
        id: 'act-' + Date.now(),
        actionType: 'subaccount_deleted',
        actionDetails: {
          email: subaccount.email,
          name: subaccount.fullName
        },
        performedBy: state.agencyData.email,
        createdAt: new Date().toISOString()
      };

      setState(prev=> ({
        ...prev,
        subaccounts: updatedSubaccounts,
        activities: [newActivity,...prev.activities],
        stats: {
          ...prev.stats,
          totalSubaccounts: updatedSubaccounts.length,
          activeSubaccounts: updatedSubaccounts.filter(s=> s.status==='active').length,
          suspendedSubaccounts: updatedSubaccounts.filter(s=> s.status==='suspended').length,
          pendingSubaccounts: updatedSubaccounts.filter(s=> s.status==='pending_approval').length,
          storageUsed: updatedSubaccounts.reduce((sum,s)=> sum + s.storageUsed,0)
        },
        loading: false
      }));

      safeSetItem('subaccounts',updatedSubaccounts);
      return {success: true};
    } catch (error) {
      setState(prev=> ({...prev,loading: false,error: error.message}));
      return {success: false,error: error.message};
    }
  };

  const sendInvitation=async (email,role='user')=> {
    try {
      setState(prev=> ({...prev,loading: true}));

      const newInvitation={
        id: 'inv-' + Date.now(),
        email,
        invitedBy: state.agencyData.email,
        role,
        status: 'pending',
        expiresAt: new Date(Date.now() + 604800000).toISOString(),
        token: Math.random().toString(36).substring(2,15),
        createdAt: new Date().toISOString()
      };

      const updatedInvitations=[...state.invitations,newInvitation];

      const newActivity={
        id: 'act-' + Date.now(),
        actionType: 'invitation_sent',
        actionDetails: {
          email,
          role,
          token: newInvitation.token
        },
        performedBy: state.agencyData.email,
        createdAt: new Date().toISOString()
      };

      setState(prev=> ({
        ...prev,
        invitations: updatedInvitations,
        activities: [newActivity,...prev.activities],
        loading: false
      }));

      return {success: true,invitation: newInvitation};
    } catch (error) {
      setState(prev=> ({...prev,loading: false,error: error.message}));
      return {success: false,error: error.message};
    }
  };

  const cancelInvitation=async (invitationId)=> {
    try {
      const updatedInvitations=state.invitations.filter(inv=> inv.id !==invitationId);
      setState(prev=> ({...prev,invitations: updatedInvitations}));
      return {success: true};
    } catch (error) {
      return {success: false,error: error.message};
    }
  };

  const updateSubaccountPermissions=async (subaccountId,newPermissions)=> {
    try {
      const updatedSubaccounts=state.subaccounts.map(sub=> 
        sub.id===subaccountId 
          ? {...sub,permissions: newPermissions,updatedAt: new Date().toISOString()}
          : sub
      );

      const subaccount=state.subaccounts.find(sub=> sub.id===subaccountId);

      const newActivity={
        id: 'act-' + Date.now(),
        actionType: 'permissions_updated',
        actionDetails: {
          email: subaccount.email,
          permissions: newPermissions
        },
        performedBy: state.agencyData.email,
        createdAt: new Date().toISOString()
      };

      setState(prev=> ({
        ...prev,
        subaccounts: updatedSubaccounts,
        activities: [newActivity,...prev.activities]
      }));

      safeSetItem('subaccounts',updatedSubaccounts);
      return {success: true};
    } catch (error) {
      return {success: false,error: error.message};
    }
  };

  const value={
    ...state,
    loadAgencyData,
    createSubaccount,
    updateSubaccountStatus,
    updateSubaccountSubscription,
    updateStripeIntegration,
    deleteSubaccount,
    sendInvitation,
    cancelInvitation,
    updateSubaccountPermissions
  };

  return (
    <AgencyContext.Provider value={value}>
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const context=useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
}