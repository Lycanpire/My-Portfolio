import React, { useState } from 'react';
import styled from 'styled-components';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a192f;
  color: #ccd6f6;
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  background: #0a192f;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: #112240;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(2, 12, 27, 0.7);
  border: 1px solid #233554;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  color: #ccd6f6;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #8892b0;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #233554;
  border-radius: 8px;
  background: #0a192f;
  color: #ccd6f6;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #64ffda;
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.2);
  }
  
  &::placeholder {
    color: #8892b0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: #64ffda;
  color: #0a192f;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(100, 255, 218, 0.8);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #8892b0;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #64ffda;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const AnalyticsPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get password from environment variable or use default
  const ADMIN_PASSWORD = process.env.GATSBY_ANALYTICS_PASSWORD || 'admin123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setSuccess('Authentication successful!');
        setError('');
        
        // Store authentication in session storage
        sessionStorage.setItem('analytics_authenticated', 'true');
        sessionStorage.setItem('analytics_auth_time', new Date().toISOString());
      } else {
        setError('Incorrect password. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already authenticated on component mount
  React.useEffect(() => {
    const isAuth = sessionStorage.getItem('analytics_authenticated');
    const authTime = sessionStorage.getItem('analytics_auth_time');
    
    if (isAuth && authTime) {
      // Check if authentication is still valid (24 hours)
      const authDate = new Date(authTime);
      const now = new Date();
      const hoursDiff = (now - authDate) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setIsAuthenticated(true);
      } else {
        // Clear expired authentication
        sessionStorage.removeItem('analytics_authenticated');
        sessionStorage.removeItem('analytics_auth_time');
      }
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('analytics_authenticated');
    sessionStorage.removeItem('analytics_auth_time');
  };

  if (isAuthenticated) {
    return (
      <PageContainer>
        <div style={{ 
          position: 'fixed', 
          top: '1rem', 
          right: '1rem', 
          zIndex: 1000 
        }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 107, 107, 0.1)',
              color: '#ff6b6b',
              border: '1px solid #ff6b6b',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Logout
          </button>
        </div>
        <AnalyticsDashboard />
      </PageContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Analytics Access</Title>
        <Subtitle>Enter your password to access the analytics dashboard</Subtitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </Button>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(100, 255, 218, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(100, 255, 218, 0.2)'
        }}>
          <p style={{ 
            color: '#64ffda', 
            fontSize: '0.8rem', 
            margin: 0,
            textAlign: 'center'
          }}>
            💡 Tip: Set GATSBY_ANALYTICS_PASSWORD environment variable for production
          </p>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default AnalyticsPage; 