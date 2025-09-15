# Google Analytics 4 (GA4) Real-time Integration Setup Guide

This guide will help you connect your Netlify function to Google Analytics 4 for real-time visitor data.

## Prerequisites ✅

- ✅ Google Analytics 4 property set up
- ✅ Service account JSON file downloaded (`my-portfolio-cd4d1-18f0d53ebf74.json`)
- ✅ Service account added to GA4 with Viewer permissions
- ✅ `@google-analytics/data` package installed

## Step 1: Find Your GA4 Property ID 🔍

1. Go to your Google Analytics dashboard
2. Navigate to **Admin** (gear icon ⚙️ in bottom-left)
3. In the **Property** column, select **Property Settings**
4. Your **Property ID** will be displayed in the top right (e.g., `123456789`)
5. Copy this ID - you'll need it for the environment variable

## Step 2: Configure Netlify Environment Variables 🔧

### Option A: Using Netlify Dashboard (Recommended)

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `GA4_PROPERTY_ID` | `123456789` | Your GA4 Property ID (numbers only) |
| `GA4_CLIENT_EMAIL` | `netlify-ga4-reporter@my-portfolio-cd4d1.iam.gserviceaccount.com` | From your JSON file |
| `GA4_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n<YOUR_PRIVATE_KEY_CONTENT_WITH_\n_ESCAPES>\n-----END PRIVATE KEY-----\n` | Full private key from JSON file |

### Option B: Using Netlify CLI

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set GA4_PROPERTY_ID "123456789"
netlify env:set GA4_CLIENT_EMAIL "netlify-ga4-reporter@my-portfolio-cd4d1.iam.gserviceaccount.com"
netlify env:set GA4_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\n<YOUR_PRIVATE_KEY_CONTENT_WITH_\n_ESCAPES>\n-----END PRIVATE KEY-----\n"
```

## Step 3: Deploy and Test 🚀

1. **Deploy your site** to Netlify (if not already deployed)
2. **Test the function** by visiting: `https://your-site-name.netlify.app/.netlify/functions/realtime-analytics`
3. **Check your analytics dashboard** at: `https://your-site-name.netlify.app/analytics`

## Step 4: Switch from Mock to Live Data 🔄

### For Testing (Mock Data)
Set this environment variable to use mock data:
```
USE_MOCK_DATA=true
```

### For Production (Live GA4 Data)
Remove or set to false:
```
USE_MOCK_DATA=false
```
or simply don't set this variable at all.

## Troubleshooting 🔧

### Common Issues:

1. **"Missing Google Analytics environment variables"**
   - Check that all three environment variables are set correctly
   - Ensure the private key includes the full `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines

2. **"Failed to fetch real-time data from GA4"**
   - Verify the Property ID is correct (numbers only, no spaces)
   - Check that the service account has Viewer permissions in GA4
   - Ensure the Google Analytics Data API is enabled in your Google Cloud project

3. **Function returns mock data instead of live data**
   - Check that `USE_MOCK_DATA` is not set to `true`
   - Verify environment variables are properly configured

### Testing Commands:

```bash
# Test the function locally (if using Netlify CLI)
netlify functions:serve

# Check environment variables
netlify env:list
```

## Security Notes 🔒

- Never commit the service account JSON file to your repository
- The private key in environment variables is encrypted by Netlify
- Consider rotating your service account keys periodically
- The service account only has Viewer permissions, limiting potential damage

## Next Steps 🎯

Once everything is working:
1. Monitor your analytics dashboard for real-time updates
2. Consider adding more GA4 metrics (bounce rate, session duration, etc.)
3. Set up alerts for unusual traffic patterns
4. Integrate with other analytics tools if needed

---

**Need Help?** Check the Netlify function logs in your dashboard under "Functions" → "realtime-analytics" for detailed error messages.
