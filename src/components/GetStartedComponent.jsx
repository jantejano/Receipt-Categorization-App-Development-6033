import React from 'react';
import { GetStarted } from '@questlabs/react-sdk';
import { questConfig } from '../config/questConfig';

function GetStartedComponent() {
  // Ultra-safe user ID handling
  const getUserId = () => {
    // Multiple fallbacks for user ID
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return questConfig.USER_ID;
      }
      
      let userId = localStorage.getItem('userId');
      
      // Handle all possible invalid values
      if (!userId || 
          userId === 'undefined' || 
          userId === 'null' || 
          userId === '' || 
          userId === 'NaN') {
        userId = questConfig.USER_ID;
        try {
          localStorage.setItem('userId', userId);
        } catch (setError) {
          console.warn('Failed to set userId in localStorage:', setError);
        }
      }
      
      return userId;
    } catch (error) {
      console.warn('Error accessing localStorage for userId:', error);
      return questConfig.USER_ID;
    }
  };

  // Validate config before rendering
  const isConfigValid = () => {
    return questConfig && 
           questConfig.GET_STARTED_QUESTID && 
           questConfig.USER_ID && 
           questConfig.PRIMARY_COLOR;
  };

  if (!isConfigValid()) {
    console.error('Quest config is invalid:', questConfig);
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Quest configuration is incomplete. Please check your config.</p>
      </div>
    );
  }

  try {
    return (
      <div className="w-full">
        <GetStarted
          questId={questConfig.GET_STARTED_QUESTID}
          uniqueUserId={getUserId()}
          accent={questConfig.PRIMARY_COLOR}
          autoHide={false}
        >
          <GetStarted.Header />
          <GetStarted.Progress />
          <GetStarted.Content />
          <GetStarted.Footer />
        </GetStarted>
      </div>
    );
  } catch (error) {
    console.error('Error rendering GetStarted component:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Failed to load Get Started component. Please try again later.</p>
      </div>
    );
  }
}

export default GetStartedComponent;