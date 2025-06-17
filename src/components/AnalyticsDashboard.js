import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { fetchAnalyticsData, getRealTimeVisitors, formatNumber, formatTimeAgo } from '../utils/analytics';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #0a192f;
  padding: 2rem;
  font-family: 'SF Mono', 'Fira Code', 'Roboto Mono', monospace;
`;

const DashboardCard = styled.div`
  background: #112240;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(2, 12, 27, 0.7);
  border: 1px solid #233554;
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

const Title = styled.h1`
  color: #ccd6f6;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #8892b0;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #64ffda 0%, rgba(100, 255, 218, 0.1) 100%);
  color: #0a192f;
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1rem 0;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(2, 12, 27, 0.7);
  }
`;

const RealTimeCard = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, rgba(255, 107, 107, 0.1) 100%);
  color: #0a192f;
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1rem 0;
  text-align: center;
  animation: ${pulse} 2s infinite;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ccd6f6;
  font-size: 1.2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #233554;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.percentage}%;
    background-color: #64ffda;
    transition: width 0.5s ease-in-out;
  }
`;

const RefreshButton = styled.button`
  background: #64ffda;
  color: #0a192f;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(100, 255, 218, 0.8);
  }
`;

const LastUpdated = styled.div`
  color: #8892b0;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 1rem;
`;

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyticsData();
      setAnalytics(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const data = await getRealTimeVisitors();
      setRealTimeData(data);
    } catch (err) {
      console.error('Failed to load real-time data:', err);
    }
  };

  useEffect(() => {
    loadAnalytics();
    loadRealTimeData();
    
    // Refresh real-time data every 30 seconds
    const realTimeInterval = setInterval(loadRealTimeData, 30000);
    
    return () => clearInterval(realTimeInterval);
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Loading analytics dashboard...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardCard>
          <h2 style={{ color: '#e74c3c' }}>Error: {error}</h2>
          <RefreshButton onClick={loadAnalytics}>Retry</RefreshButton>
        </DashboardCard>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Title>Analytics Dashboard</Title>
      <Subtitle>Last 30 days • Real-time data updates every 30 seconds</Subtitle>
      
      <DashboardCard delay="0s">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#ccd6f6', margin: 0 }}>Overview</h2>
          <RefreshButton onClick={loadAnalytics}>Refresh Data</RefreshButton>
        </div>
        <Grid>
          <StatCard>
            <StatNumber>{formatNumber(analytics.totalVisitors)}</StatNumber>
            <StatLabel>Total Visitors</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatNumber(analytics.uniqueVisitors)}</StatNumber>
            <StatLabel>Unique Visitors</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatNumber(analytics.pageViews)}</StatNumber>
            <StatLabel>Page Views</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{analytics.averageSessionDuration}</StatNumber>
            <StatLabel>Avg. Session Duration</StatLabel>
          </StatCard>
        </Grid>
        
        {realTimeData && (
          <div style={{ marginTop: '2rem' }}>
            <RealTimeCard>
              <StatNumber>{realTimeData.currentVisitors}</StatNumber>
              <StatLabel>Currently Online</StatLabel>
            </RealTimeCard>
          </div>
        )}
      </DashboardCard>

      <DashboardCard delay="0.1s">
        <h2 style={{ marginBottom: '1.5rem', color: '#ccd6f6' }}>Top Pages</h2>
        {analytics.topPages.map((page, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0.5rem 0',
            borderBottom: index < analytics.topPages.length - 1 ? '1px solid #233554' : 'none'
          }}>
            <span style={{ color: '#8892b0' }}>{page.page}</span>
            <span style={{ fontWeight: 'bold', color: '#ccd6f6' }}>{formatNumber(page.views)} views</span>
          </div>
        ))}
      </DashboardCard>

      <DashboardCard delay="0.2s">
        <h2 style={{ marginBottom: '1.5rem', color: '#ccd6f6' }}>Traffic Sources</h2>
        {analytics.trafficSources.map((source, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#8892b0' }}>{source.source}</span>
              <span style={{ fontWeight: 'bold', color: '#ccd6f6' }}>{source.percentage}%</span>
            </div>
            <ProgressBar percentage={source.percentage} />
          </div>
        ))}
      </DashboardCard>

      <DashboardCard delay="0.3s">
        <h2 style={{ marginBottom: '1.5rem', color: '#ccd6f6' }}>Recent Activity</h2>
        {analytics.recentActivity.map((activity, index) => (
          <div key={index} style={{ 
            padding: '0.75rem 0',
            borderBottom: index < analytics.recentActivity.length - 1 ? '1px solid #233554' : 'none'
          }}>
            <div style={{ color: '#495670', fontSize: '0.9rem' }}>{activity.time}</div>
            <div style={{ color: '#ccd6f6', marginTop: '0.25rem' }}>{activity.action}</div>
          </div>
        ))}
      </DashboardCard>

      {lastUpdated && (
        <LastUpdated>
          Last updated: {formatTimeAgo(lastUpdated)}
        </LastUpdated>
      )}
    </DashboardContainer>
  );
};

export default AnalyticsDashboard; 