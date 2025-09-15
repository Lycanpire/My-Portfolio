// Import the Google Analytics Data API client library
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

exports.handler = async function handler() {
  try {
    // --- MOCK DATA MODE ---
    // Set USE_MOCK_DATA=true in Netlify environment variables to use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';

    if (useMockData) {
      console.log("Serving mock data for testing.");
      const currentVisitors = Math.floor(Math.random() * 15) + 1;
      const activePagesRaw = [
        { page: '/', weight: 0.5 },
        { page: '/projects', weight: 0.25 },
        { page: '/about', weight: 0.15 },
        { page: '/contact', weight: 0.1 },
      ];

      const activePages = activePagesRaw
        .map(({ page, weight }) => ({
          page,
          visitors: Math.floor(currentVisitors * weight),
        }))
        .filter((p) => p.visitors > 0);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({
          currentVisitors,
          activePages,
          timestamp: new Date().toISOString(),
          mode: 'mock'
        }),
      };
    }

    // --- LIVE GA4 DATA ---
    // Check for required environment variables
    if (!process.env.GA4_PROPERTY_ID || !process.env.GA4_CLIENT_EMAIL || !process.env.GA4_PRIVATE_KEY) {
      console.error("Missing GA4 environment variables");
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing Google Analytics environment variables. Set GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY.',
          mode: 'error'
        }),
      };
    }

    // Initialize the GA4 client with credentials from environment variables
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_CLIENT_EMAIL,
        // The private key needs to be properly formatted (replace \\n with \n)
        private_key: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    // Make the API call to get the real-time report
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      limit: 10, // Limit to top 10 pages
    });
    
    // Extract the active users count from the response
    let currentVisitors = 0;
    let activePages = [];
    
    if (response.rows && response.rows.length > 0) {
      // Sum up all active users across pages
      currentVisitors = response.rows.reduce((total, row) => {
        return total + parseInt(row.metricValues[0].value);
      }, 0);
      
      // Build active pages array
      activePages = response.rows
        .map(row => ({
          page: row.dimensionValues[0].value,
          visitors: parseInt(row.metricValues[0].value)
        }))
        .filter(page => page.visitors > 0)
        .sort((a, b) => b.visitors - a.visitors);
    }
    
    // Return the successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({
        currentVisitors,
        activePages,
        timestamp: new Date().toISOString(),
        mode: 'live'
      }),
    };

  } catch (error) {
    console.error("Error fetching GA4 data:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: "Failed to fetch real-time data from GA4.",
        details: error.message,
        mode: 'error'
      }),
    };
  }
};


