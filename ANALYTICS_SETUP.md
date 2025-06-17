# Analytics Setup Guide

## Overview
This portfolio now includes a private analytics dashboard that only you can access. The system uses Google Analytics 4 for tracking and provides a beautiful dashboard interface.

## Setup Instructions

### 1. Google Analytics 4 Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Get your Measurement ID (starts with "G-")
4. Add the following to your `.env` file:

```bash
GA_TRACKING_ID=G-XXXXXXXXXX
GATSBY_ANALYTICS_PASSWORD=your_secure_password_here
```

### 2. Environment Variables

Create a `.env` file in your project root with:

```bash
# Google Analytics 4 Measurement ID
GA_TRACKING_ID=G-XXXXXXXXXX

# Analytics Dashboard Password (change this!)
GATSBY_ANALYTICS_PASSWORD=your_secure_password_here
```

### 3. Access Your Analytics Dashboard

1. Start your development server: `npm run develop`
2. Navigate to: `http://localhost:8000/analytics`
3. Enter your password (default: `admin123` if no env var is set)

## Features

### Dashboard Includes:
- **Total Visitors**: Overall site traffic
- **Unique Visitors**: Distinct users
- **Page Views**: Total page loads
- **Average Session Duration**: Time spent on site
- **Top Pages**: Most visited pages
- **Traffic Sources**: Where visitors come from
- **Recent Activity**: Live visitor activity

### Security Features:
- Password-protected access
- Environment variable configuration
- No public access to analytics data

## Customization

### Changing the Password
1. Set the `GATSBY_ANALYTICS_PASSWORD` environment variable
2. Or modify the default password in `src/pages/analytics.js`

### Styling
The dashboard uses styled-components and can be customized in:
- `src/components/AnalyticsDashboard.js`
- `src/pages/analytics.js`

### Real Data Integration
Currently, the dashboard shows mock data. To integrate real Google Analytics data:

1. Set up Google Analytics API access
2. Replace the mock data in `AnalyticsDashboard.js` with real API calls
3. Use the Google Analytics Reporting API v4

## Privacy & GDPR Compliance

The analytics setup includes:
- Anonymized IP addresses
- Respect for Do Not Track headers
- No personal data collection
- GDPR-compliant tracking

## Troubleshooting

### Dashboard Not Loading
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure the development server is running

### Google Analytics Not Tracking
- Verify your GA4 Measurement ID is correct
- Check that the tracking code is loading in browser dev tools
- Ensure your site is accessible to Google's tracking servers

### Password Issues
- Default password is `admin123` if no environment variable is set
- Check that `GATSBY_ANALYTICS_PASSWORD` is set correctly
- Restart your development server after changing environment variables

## Next Steps

For production deployment:
1. Set up proper environment variables on your hosting platform
2. Configure Google Analytics for your production domain
3. Consider implementing real-time data fetching from GA4 API
4. Add more detailed analytics like user behavior, conversion tracking, etc.

# Google Analytics Integration Setup

This guide explains how to integrate real Google Analytics data into your portfolio's analytics dashboard.

## Current Implementation

The analytics dashboard currently uses **realistic mock data** that simulates Google Analytics patterns. This provides a fully functional demo while avoiding API complexity.

## Features Included

✅ **Realistic Data Simulation**
- Generates data based on typical website patterns
- Updates every 30 seconds for real-time feel
- Proper number formatting and time calculations

✅ **Secure Authentication**
- Password-protected access
- Session-based authentication (24-hour expiry)
- Environment variable support for production

✅ **Professional UI**
- Dark theme matching your portfolio
- Responsive design
- Smooth animations and transitions
- Real-time visitor counter with pulse animation

## To Integrate Real Google Analytics Data

### Option 1: Google Analytics Data API v1 (Recommended)

1. **Set up Google Analytics 4**
   - Create a GA4 property in Google Analytics
   - Get your Measurement ID (G-XXXXXXXXXX)

2. **Enable Google Analytics Data API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google Analytics Data API v1"
   - Create service account credentials

3. **Get API Credentials**
   ```bash
   # Download service account JSON file
   # Store it securely (not in git)
   ```

4. **Install Required Packages**
   ```bash
   npm install googleapis@^118.0.0
   ```

5. **Update Environment Variables**
   ```bash
   # .env.local
   GA_TRACKING_ID=G-XXXXXXXXXX
   GA_PROPERTY_ID=123456789
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
   GATSBY_ANALYTICS_PASSWORD=your-secure-password
   ```

6. **Replace Mock Data with Real API Calls**
   Update `src/utils/analytics.js` to use the Google Analytics API:

   ```javascript
   import { google } from 'googleapis';

   const analytics = google.analyticsdata('v1beta');

   export const fetchAnalyticsData = async () => {
     const auth = new google.auth.GoogleAuth({
       keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
       scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
     });

     const client = await auth.getClient();
     
     const response = await analytics.properties.runReport({
       auth: client,
       property: `properties/${process.env.GA_PROPERTY_ID}`,
       requestBody: {
         dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
         metrics: [
           { name: 'totalUsers' },
           { name: 'sessions' },
           { name: 'screenPageViews' },
           { name: 'averageSessionDuration' }
         ],
         dimensions: [{ name: 'pagePath' }],
       },
     });

     // Process and return the data
     return processAnalyticsResponse(response.data);
   };
   ```

### Option 2: Google Analytics Reporting API v4 (Legacy)

For Universal Analytics properties, use the older API:

```bash
npm install googleapis@^118.0.0
```

### Option 3: Serverless Function (Netlify/Vercel)

For better security, create a serverless function:

1. **Create API endpoint**
   ```javascript
   // api/analytics.js (Netlify Functions)
   const { google } = require('googleapis');

   exports.handler = async (event) => {
     // Handle authentication and API calls here
     // Return analytics data
   };
   ```

2. **Update frontend to call your API**
   ```javascript
   const response = await fetch('/.netlify/functions/analytics');
   const data = await response.json();
   ```

## Security Best Practices

1. **Environment Variables**
   - Never commit API keys to git
   - Use `.env.local` for local development
   - Set environment variables in production

2. **Authentication**
   - Use strong passwords
   - Implement rate limiting
   - Consider OAuth for production

3. **API Security**
   - Restrict API access to your domain
   - Use service accounts with minimal permissions
   - Monitor API usage

## Current Mock Data Features

The current implementation includes:

- **Visitor Metrics**: Total visitors, unique visitors, page views
- **Session Data**: Average session duration
- **Page Analytics**: Top pages by views
- **Traffic Sources**: Direct, Google, Social Media, etc.
- **Real-time Data**: Currently online visitors
- **Recent Activity**: Simulated page views and actions

## Testing the Dashboard

1. **Access the dashboard**: `http://localhost:3000/analytics`
2. **Default password**: `admin123`
3. **Features to test**:
   - Data refresh button
   - Real-time visitor counter
   - Responsive design
   - Session persistence

## Production Deployment

1. **Set environment variables**:
   ```bash
   GATSBY_ANALYTICS_PASSWORD=your-secure-password
   GA_TRACKING_ID=G-XXXXXXXXXX
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   npm run serve
   ```

3. **Monitor performance**:
   - Check API rate limits
   - Monitor dashboard load times
   - Verify data accuracy

## Troubleshooting

### Common Issues

1. **API Quotas Exceeded**
   - Implement caching
   - Reduce API call frequency
   - Use batch requests

2. **Authentication Errors**
   - Verify service account permissions
   - Check API enablement
   - Validate credentials

3. **Data Not Loading**
   - Check network connectivity
   - Verify property ID
   - Review API response format

### Debug Mode

Enable debug logging:
```javascript
// Add to analytics.js
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) console.log('Analytics API Response:', data);
```

## Next Steps

1. **Real-time Analytics**: Implement WebSocket connections
2. **Data Visualization**: Add charts and graphs
3. **Export Features**: Allow data export to CSV/PDF
4. **Custom Metrics**: Track specific user interactions
5. **A/B Testing**: Compare different page versions

## Support

For issues with:
- **Google Analytics API**: [Google Analytics Documentation](https://developers.google.com/analytics)
- **Gatsby Integration**: [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- **Authentication**: Review security best practices above

---

**Note**: The current mock implementation provides a fully functional analytics dashboard that can be easily upgraded to use real Google Analytics data when needed. 