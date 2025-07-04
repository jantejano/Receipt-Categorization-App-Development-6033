export const questConfig = {
  // Onboarding Quest Configuration
  QUEST_ONBOARDING_QUESTID: import.meta.env.VITE_QUEST_ONBOARDING_ID || 'c-greta-onboarding',
  
  // Help Hub Configuration
  QUEST_HELP_QUESTID: import.meta.env.VITE_QUEST_HELP_ID || 'c-greta-help-hub',
  
  // User and API Configuration
  USER_ID: import.meta.env.VITE_QUEST_USER_ID || 'u-96ef46d7-1ef4-49e7-9dea-40f70814b243',
  APIKEY: import.meta.env.VITE_QUEST_APIKEY || 'k-09986876-46e3-4877-9621-fafa6d13faad',
  TOKEN: import.meta.env.VITE_QUEST_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1LTk2ZWY0NmQ3LTFlZjQtNDllNy05ZGVhLTQwZjcwODE0YjI0MyIsImlhdCI6MTc1MTU3ODE2OCwiZXhwIjoxNzU0MTcwMTY4fQ.yTRV_MJsGKf06LEN4TVLrRaENA_SUxNpzKRdODA0ynw',
  ENTITYID: import.meta.env.VITE_QUEST_ENTITY_ID || 'e-234874ae-f71b-4ebd-a725-da75a26291fa',
  
  // Extracted primary color from your existing blue theme
  PRIMARY_COLOR: import.meta.env.VITE_QUEST_PRIMARY_COLOR || '#3b82f6'
};