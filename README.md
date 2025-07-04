# TaxSync Pro - Tax & Expense Management Platform

A comprehensive expense management and receipt tracking platform built with React and modern web technologies.

## 🚀 Features

- **Receipt Management**: Digital receipt storage and categorization
- **Expense Tracking**: Real-time expense monitoring with analytics
- **Client Management**: Organize expenses by clients and projects
- **Agency Management**: Multi-tenant support for agencies managing subaccounts
- **Subscription Management**: Flexible pricing tiers with Stripe integration
- **Bulk Import**: CSV/Excel import for existing expense data
- **API Access**: RESTful API for integrations
- **Advanced Reporting**: Charts and analytics for expense insights

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: ECharts
- **Icons**: React Icons
- **Backend**: Supabase
- **Authentication**: Quest Labs SDK
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd taxsync-pro
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
VITE_QUEST_APIKEY=your_quest_api_key
VITE_QUEST_ENTITY_ID=your_quest_entity_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start development server:
```bash
npm run dev
```

## 🚀 Deployment

### Netlify Deployment

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Environment Variables in Netlify:**
   - Go to Site Settings > Environment Variables
   - Add all variables from `.env.example`

### Manual Deployment

1. **Build for production:**
```bash
npm run build:prod
```

2. **Deploy the `dist` folder to your hosting provider**

## 🔧 Configuration

### Quest Labs Setup
1. Get your API credentials from Quest Labs dashboard
2. Update the quest configuration in `src/config/questConfig.js`

### Supabase Setup
1. Create a Supabase project
2. Update the Supabase configuration in `src/lib/supabase.js`
3. Set up your database tables and RLS policies

## 📱 Usage

### Demo Users
The application includes demo users for testing:
- **Agency Owner**: `agency@taxsync.com`
- **Admin User**: `admin@taxsync.com` 
- **Regular User**: `user@example.com`
- **New User**: `newuser@example.com` (triggers onboarding)

### Key Features
- **Dashboard**: Overview of expenses and recent activity
- **Receipts**: Add, categorize, and manage receipts
- **Clients**: Organize expenses by client projects
- **Reports**: Analytics and expense reporting
- **Agency Management**: Multi-tenant user management (for agency owners)

## 🔒 Security

- Environment variables for sensitive configuration
- Secure authentication with Quest Labs
- Row Level Security (RLS) with Supabase
- Input validation and sanitization
- HTTPS enforced in production

## 📊 Performance

- Code splitting with dynamic imports
- Optimized bundle sizes
- Lazy loading of components
- Image optimization
- Caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check that all environment variables are set
   - Ensure Node.js version 18 or higher
   - Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

2. **Netlify Deployment Issues:**
   - Verify `netlify.toml` configuration
   - Check build logs in Netlify dashboard
   - Ensure environment variables are set in Netlify

3. **Quest Labs Integration:**
   - Verify API credentials
   - Check Quest Labs documentation for latest SDK version

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email support@taxsync.pro or create an issue in the repository.