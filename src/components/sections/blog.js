import React, { useEffect, useRef, useState } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledBlogSection = styled.section`
  max-width: 1000px;
`;

const StyledTitle = styled.h2`
  font-size: clamp(40px, 5vw, 60px);
  margin: 0 0 10px 0;
  background: linear-gradient(121.57deg, var(--green) 18.77%, rgba(100, 255, 218, 0.66) 60.15%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledSubtitle = styled.p`
  font-size: var(--fz-lg);
  line-height: 1.3;
  color: var(--light-slate);
  margin: 0 0 50px 0;
`;

const StyledNotificationBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--green);
  color: var(--navy);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fz-xs);
  font-weight: 600;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.7);
    }
    70% {
      transform: scale(1.1);
      box-shadow: 0 0 0 10px rgba(100, 255, 218, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(100, 255, 218, 0);
    }
  }
`;

const StyledTitleContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--light-navy);
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  padding: 15px 20px;
  color: var(--lightest-slate);
  font-size: var(--fz-sm);
  z-index: 1000;
  transform: ${props => props.show ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  
  .toast-title {
    color: var(--green);
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .toast-message {
    color: var(--light-slate);
    font-size: var(--fz-xs);
  }
`;

const StyledBlogContainer = styled.div`
  background: var(--light-navy);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-top: 30px;
  border: 1px solid var(--lightest-navy);
  transition: var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px -15px var(--navy-shadow);
  }

  & + & {
    margin-top: 20px;
  }
`;

const StyledBlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: ${props => props.isOpen ? '15px' : '0'};
`;

const StyledBlogTitle = styled.h3`
  font-size: clamp(20px, 4vw, 24px);
  color: var(--lightest-slate);
  margin: 0;
  font-weight: 600;
`;

const StyledBlogMeta = styled.div`
  display: flex;
  align-items: center;
  color: var(--light-slate);
  font-size: var(--fz-xs);
  font-family: var(--font-mono);
  margin-top: 8px;
  justify-content: space-between;
`;

const StyledBlogMetaLeft = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBlogDate = styled.span`
  color: var(--green);
  margin-right: 20px;
`;

const StyledBlogTags = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledTag = styled.span`
  background: var(--navy);
  color: var(--green);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--fz-xs);
`;

const StyledShareButton = styled.button`
  background: transparent;
  border: 1px solid var(--green);
  color: var(--green);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--fz-xs);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 12px;
    height: 12px;
  }
  
  &:hover {
    background: var(--green);
    color: var(--navy);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const StyledBlogContent = styled.div`
  color: var(--light-slate);
  font-size: var(--fz-md);
  line-height: 1.6;
  margin-top: 15px;

  p {
    margin: 0 0 15px 0;
  }

  h3 {
    color: var(--lightest-slate);
    font-size: var(--fz-lg);
    margin: 30px 0 15px 0;
    font-weight: 600;
  }

  h4 {
    color: var(--lightest-slate);
    font-size: var(--fz-md);
    margin: 25px 0 12px 0;
    font-weight: 600;
  }

  ul {
    margin: 15px 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: var(--light-slate);
    }
  }

  strong {
    color: var(--green);
    font-weight: 600;
  }

  em {
    color: var(--lightest-slate);
    font-style: italic;
  }

  .highlight {
    background: linear-gradient(120deg, rgba(100, 255, 218, 0.1) 0%, rgba(100, 255, 218, 0.05) 100%);
    padding: 15px;
    border-radius: var(--border-radius);
    border: 1px solid rgba(100, 255, 218, 0.2);
    margin: 20px 0;
  }

  .manifesto {
    background: var(--navy);
    padding: 20px;
    border-radius: var(--border-radius);
    border-left: 4px solid var(--green);
    margin: 20px 0;
  }
`;

const Blog = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownNotification, setHasShownNotification] = useState(false);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Fetch posts from Markdown using GraphQL
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/posts/" } }
        sort: { frontmatter: { date: DESC } }
        limit: 10
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 200)
            frontmatter {
              title
              description
              date
              slug
              tags
            }
          }
        }
      }
    }
  `);

  const blogPosts = data.allMarkdownRemark.edges.map(({ node }) => ({
    id: node.id,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    date: node.frontmatter.date,
    slug: node.frontmatter.slug,
    tags: node.frontmatter.tags || [],
    excerpt: node.excerpt
  }));

  const shareOnLinkedIn = (post) => {
    // Use the unique post URL for sharing
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin;
    
    // Use the full current URL if it's a production site, otherwise use the actual domain
    const shareUrl = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') 
      ? `https://saaj.space${post.slug}` // Your actual domain + post slug
      : `${baseUrl}${post.slug}`;
    
    // Create a comprehensive description
    const description = `Check out this insightful post about ${post.tags.join(', ').toLowerCase()} by Syed Akbar Abbas Jafri. Read the full article to learn more about ${post.tags[0].toLowerCase()} and automation.`;
    
    // Create the LinkedIn sharing URL using the more reliable method
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(description)}&source=${encodeURIComponent('Syed Akbar Abbas Jafri Portfolio')}`;
    
    // Try the sharing URL first
    const width = 600;
    const height = 500;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    const popup = window.open(
      linkedInUrl,
      'linkedin-share',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    // Fallback if popup is blocked or doesn't work
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Try opening in new tab
      window.open(linkedInUrl, '_blank');
    }
    
    // Additional fallback: Copy to clipboard with sharing info
    const shareText = `${post.title}\n\n${description}\n\nRead more: ${shareUrl}`;
    
    // Show a helpful message to the user
    console.log('LinkedIn sharing info:', {
      url: shareUrl,
      title: post.title,
      description: description,
      shareText: shareText
    });
  };

  // Check for new blog posts and show notification
  useEffect(() => {
    const checkForNewPosts = () => {
      const lastVisit = localStorage.getItem('lastBlogVisit');
      const currentTime = new Date().getTime();
      
      // Show notification if user hasn't visited in the last 24 hours
      // and hasn't seen the notification yet
      if (!lastVisit || (currentTime - parseInt(lastVisit)) > 24 * 60 * 60 * 1000) {
        if (!hasShownNotification) {
          setShowNotification(true);
          setHasShownNotification(true);
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      }
    };

    // Check immediately
    checkForNewPosts();

    // Check every 30 seconds for new posts
    const interval = setInterval(checkForNewPosts, 30000);

    return () => clearInterval(interval);
  }, [hasShownNotification]);

  // Update last visit time when user interacts with blog section
  useEffect(() => {
    const handleBlogInteraction = () => {
      localStorage.setItem('lastBlogVisit', new Date().getTime().toString());
    };

    const blogSection = revealContainer.current;
    if (blogSection) {
      blogSection.addEventListener('click', handleBlogInteraction);
      return () => blogSection.removeEventListener('click', handleBlogInteraction);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  // Count new posts (posts from the last 7 days)
  const newPostsCount = blogPosts.filter(post => {
    const postDate = new Date(post.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return postDate > weekAgo;
  }).length;

  return (
    <>
      <StyledToast show={showNotification}>
        <div className="toast-title">New Blog Posts Available!</div>
        <div className="toast-message">
          {newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'} have been published. Check them out below!
        </div>
      </StyledToast>

      <StyledBlogSection id="blog" ref={revealContainer}>
        <StyledTitleContainer>
          <StyledTitle>Latest Insights</StyledTitle>
          {newPostsCount > 0 && (
            <StyledNotificationBadge>
              {newPostsCount}
            </StyledNotificationBadge>
          )}
        </StyledTitleContainer>
        <StyledSubtitle>
          Thoughts on AI, automation, and the future of technology
        </StyledSubtitle>

        {blogPosts.map((post) => (
          <StyledBlogContainer key={post.id}>
            <StyledBlogHeader>
              <div>
                <StyledBlogTitle>
                  <Link to={post.slug} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </StyledBlogTitle>
                <StyledBlogMeta>
                  <StyledBlogMetaLeft>
                    <StyledBlogDate>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</StyledBlogDate>
                    <StyledBlogTags>
                      {post.tags.map((tag, index) => (
                        <StyledTag key={index}>{tag}</StyledTag>
                      ))}
                    </StyledBlogTags>
                  </StyledBlogMetaLeft>
                  <StyledShareButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      shareOnLinkedIn(post);
                    }}
                  >
                    <Icon name="Linkedin" />
                    Share
                  </StyledShareButton>
                </StyledBlogMeta>
              </div>
            </StyledBlogHeader>

            <StyledBlogContent>
              <p>{post.excerpt}</p>
              <Link 
                to={post.slug}
                style={{
                  color: 'var(--green)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fz-sm)',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '15px',
                  transition: 'var(--transition)',
                  '&:hover': {
                    color: 'var(--lightest-slate)',
                  }
                }}
              >
                Read More →
              </Link>
            </StyledBlogContent>
          </StyledBlogContainer>
        ))}
      </StyledBlogSection>
    </>
  );
};

export default Blog; 