import React from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import { questConfig } from '../config/questConfig';

function AppHelp() {
  // Ultra-safe user ID handling with multiple fallbacks
  const getUserId = () => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return questConfig.USER_ID;
      }

      let userId = localStorage.getItem('userId');
      
      // Handle all possible invalid values
      if (!userId || userId === 'undefined' || userId === 'null' || userId === '' || userId === 'NaN') {
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
           questConfig.QUEST_HELP_QUESTID && 
           questConfig.USER_ID && 
           questConfig.PRIMARY_COLOR &&
           questConfig.APIKEY &&
           questConfig.ENTITYID;
  };

  if (!isConfigValid()) {
    console.error('Quest HelpHub config is invalid:', questConfig);
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Help system configuration is incomplete. Please check your config.
        </p>
      </div>
    );
  }

  try {
    return (
      <div style={{ zIndex: 9999 }}>
        <HelpHub
          uniqueUserId={getUserId()}
          questId={questConfig.QUEST_HELP_QUESTID}
          accent={questConfig.PRIMARY_COLOR}
          botLogo={{
            logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering HelpHub component:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          Failed to load help system. Please try again later.
        </p>
      </div>
    );
  }
}

export default AppHelp;