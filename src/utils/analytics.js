// Google Analytics Data API utility
// This uses a simpler approach compatible with Node.js 14

const GA4_ENDPOINT = 'https://analyticsdata.googleapis.com/v1beta/properties';

// Function to format date for GA4 API
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Function to get date range (last 30 days)
const getDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
};

// Mock function that simulates real GA4 data
// In production, you would replace this with actual API calls
export const fetchAnalyticsData = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { startDate, endDate } = getDateRange();
    
    // Generate realistic mock data based on typical patterns
    const baseVisitors = Math.floor(Math.random() * 500) + 200;
    const totalVisitors = baseVisitors + Math.floor(Math.random() * 300);
    const uniqueVisitors = Math.floor(totalVisitors * 0.7);
    const pageViews = totalVisitors * (2 + Math.random() * 2);
    
    // Generate realistic page data
    const pages = [
      { page: '/', views: Math.floor(pageViews * 0.4) },
      { page: '/about', views: Math.floor(pageViews * 0.2) },
      { page: '/projects', views: Math.floor(pageViews * 0.25) },
      { page: '/contact', views: Math.floor(pageViews * 0.1) },
      { page: '/analytics', views: Math.floor(pageViews * 0.05) }
    ];
    
    // Generate realistic traffic sources
    const sources = [
      { source: 'Direct', percentage: 35 + Math.random() * 20 },
      { source: 'Google', percentage: 25 + Math.random() * 15 },
      { source: 'Social Media', percentage: 10 + Math.random() * 10 },
      { source: 'Referral', percentage: 5 + Math.random() * 10 },
      { source: 'Other', percentage: 5 + Math.random() * 10 }
    ];
    
    // Normalize percentages to sum to 100
    const totalPercentage = sources.reduce((sum, source) => sum + source.percentage, 0);
    sources.forEach(source => {
      source.percentage = Math.round((source.percentage / totalPercentage) * 100);
    });
    
    // Generate recent activity
    const activities = [
      { time: '2 minutes ago', action: 'Page view on /projects' },
      { time: '5 minutes ago', action: 'Page view on /about' },
      { time: '12 minutes ago', action: 'Page view on /' },
      { time: '18 minutes ago', action: 'Page view on /contact' },
      { time: '25 minutes ago', action: 'Page view on /projects' },
      { time: '32 minutes ago', action: 'Page view on /' },
      { time: '45 minutes ago', action: 'Page view on /about' },
      { time: '1 hour ago', action: 'Page view on /contact' }
    ];
    
    // Calculate average session duration
    const avgMinutes = Math.floor(Math.random() * 3) + 1;
    const avgSeconds = Math.floor(Math.random() * 60);
    const averageSessionDuration = `${avgMinutes}m ${avgSeconds}s`;
    
    return {
      totalVisitors: Math.round(totalVisitors),
      uniqueVisitors: Math.round(uniqueVisitors),
      pageViews: Math.round(pageViews),
      averageSessionDuration,
      topPages: pages.sort((a, b) => b.views - a.views),
      trafficSources: sources,
      recentActivity: activities,
      dateRange: { startDate, endDate },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Failed to load analytics data');
  }
};

// Function to get real-time visitor count (simulated)
export const getRealTimeVisitors = async () => {
  try {
    // Simulate real-time data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentVisitors = Math.floor(Math.random() * 10) + 1;
    const activePages = [
      { page: '/', visitors: Math.floor(currentVisitors * 0.5) },
      { page: '/projects', visitors: Math.floor(currentVisitors * 0.3) },
      { page: '/about', visitors: Math.floor(currentVisitors * 0.2) }
    ].filter(page => page.visitors > 0);
    
    return {
      currentVisitors,
      activePages,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    throw new Error('Failed to load real-time data');
  }
};

// Function to format numbers with commas
export const formatNumber = (num) => {
  return num.toLocaleString();
};

// Function to format time ago
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}; 