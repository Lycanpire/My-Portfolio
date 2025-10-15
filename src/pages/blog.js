import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const BlogRedirect = () => {
  useEffect(() => {
    // Redirect to pensieve page
    navigate('/pensieve', { replace: true });
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem',
      color: '#64ffda'
    }}>
      Redirecting to blog...
    </div>
  );
};

export default BlogRedirect;
