# Netlify Deployment Guide for TaxSync Pro

## Prerequisites

1. **Node.js 18+** installed locally
2. **GitHub account** with your code repository
3. **Netlify account** (free tier works)
4. **Quest Labs account** with API credentials
5. **Supabase project** set up

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure these files are in your repository root:
- `netlify.toml` - Netlify configuration
- `public/_redirects` - SPA routing support
- `.env.example` - Environment variables template

### 2. Connect to Netlify

#### Option A: GitHub Integration (Recommended)
1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your TaxSync Pro repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

#### Option B: Manual Deploy
1. Build locally: `npm run build`
2. Drag and drop the `dist` folder to Netlify

### 3. Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

```
VITE_QUEST_APIKEY=your_quest_api_key_here
VITE_QUEST_ENTITY_ID=your_quest_entity_id_here
VITE_QUEST_USER_ID=your_quest_user_id_here
VITE_QUEST_TOKEN=your_quest_token_here
VITE_QUEST_ONBOARDING_ID=your_quest_onboarding_id_here
VITE_QUEST_HELP_ID=your_quest_help_id_here
VITE_QUEST_PRIMARY_COLOR=#3b82f6
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_NODE_ENV=production
```

### 4. Trigger Deployment

1. Click "Deploy site" or push code to trigger auto-deploy
2. Monitor build logs in Netlify dashboard
3. Fix any build errors and redeploy

### 5. Configure Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## Troubleshooting Common Issues

### Build Failures

**Error: "Command failed with exit code 1"**
```bash
# Check these items:
1. Node version is 18+ in Netlify settings
2. All environment variables are set
3. Dependencies install correctly
4. ESLint errors are fixed
```

**Fix:**
- Update Node version in Site Settings → Environment
- Check build logs for specific errors
- Test build locally: `npm run build`

### Environment Variables Not Working

**Error: Variables undefined in production**
```bash
# Ensure variables start with VITE_
VITE_QUEST_APIKEY=xxx  ✅ Correct
QUEST_APIKEY=xxx       ❌ Wrong
```

### Routing Issues

**Error: 404 on page refresh**
- Ensure `netlify.toml` has redirect rules
- Check `public/_redirects` file exists

### Quest Labs Integration Issues

**Error: Quest components not loading**
1. Verify API credentials in Netlify environment
2. Check Quest Labs dashboard for correct IDs
3. Ensure SDK version is compatible

### Supabase Connection Issues

**Error: Database connection failed**
1. Verify Supabase URL and keys
2. Check RLS policies are correctly set
3. Ensure environment variables are correct

## Performance Optimization

### 1. Enable Build Optimization
```toml
# In netlify.toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### 2. Configure Caching
Headers are already configured in `netlify.toml` for optimal caching.

### 3. Enable Form Handling
```toml
# Add to netlify.toml for contact forms
[build.processing]
  skip_processing = false
```

## Security Configuration

### 1. Environment Variables
- Never commit `.env` files
- Use Netlify's environment variables for secrets
- Rotate API keys regularly

### 2. Headers Configuration
Security headers are configured in `netlify.toml`:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

### 3. HTTPS
- Enabled automatically by Netlify
- Redirects HTTP to HTTPS
- Free SSL certificates

## Monitoring and Maintenance

### 1. Build Notifications
- Set up Slack/email notifications for failed builds
- Monitor build performance in Netlify analytics

### 2. Error Tracking
```javascript
// Add to your app for production error tracking
window.addEventListener('error', (event) => {
  console.error('Production error:', event.error);
});
```

### 3. Performance Monitoring
- Use Netlify Analytics
- Monitor Core Web Vitals
- Set up uptime monitoring

## Custom Domain Setup

### 1. Add Domain in Netlify
1. Site Settings → Domain Management
2. Add custom domain
3. Choose between subdomain or apex domain

### 2. Configure DNS
For apex domain (example.com):
```
A Record: @ → 75.2.60.5
AAAA Record: @ → 2600:1f14:e22:d501::
```

For subdomain (www.example.com):
```
CNAME Record: www → your-site.netlify.app
```

### 3. SSL Certificate
- Automatically provisioned by Netlify
- Includes www and apex domain
- Auto-renewal enabled

## Deployment Checklist

- [ ] Repository connected to Netlify
- [ ] Build command set to `npm run build`
- [ ] Publish directory set to `dist`
- [ ] Node version set to 18
- [ ] All environment variables configured
- [ ] `netlify.toml` file present
- [ ] `_redirects` file in public folder
- [ ] Build successful without errors
- [ ] Site accessible at Netlify URL
- [ ] Quest Labs integration working
- [ ] Supabase connection successful
- [ ] All routes working correctly
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled and working

## Support

If you encounter issues:
1. Check Netlify build logs
2. Test build locally first
3. Verify all environment variables
4. Check this deployment guide
5. Contact support if needed

Your TaxSync Pro application should now be live on Netlify! 🚀