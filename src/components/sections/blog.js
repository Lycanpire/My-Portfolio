import React, { useEffect, useRef, useState } from 'react';
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

const StyledIcon = styled.div`
  color: var(--green);
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  svg {
    width: 16px;
    height: 16px;
  }
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
  overflow: hidden;
  max-height: ${props => props.isOpen ? '2000px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;

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
  const [openPosts, setOpenPosts] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownNotification, setHasShownNotification] = useState(false);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const toggleBlog = (postId) => {
    setOpenPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const shareOnLinkedIn = (post) => {
    // Create a more reliable sharing approach
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Use the full current URL if it's a production site, otherwise use the actual domain
    const shareUrl = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') 
      ? 'https://saaj.space/#blog' // Your actual domain from gatsby config
      : baseUrl + '#blog';
    
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

  const blogPosts = [
    {
      id: 'n8n-app-building',
      title: 'Building Apps Without Code: Unlocking n8n\'s Potential for Custom Solutions',
      date: 'June 29, 2024',
      tags: ['n8n', 'No-Code', 'Automation', 'App Development'],
      content: (
        <>
          <p>
            When you think of app development, you might imagine lines of code, complex frameworks, and long development cycles. But with n8n, building your own custom app—or at least a powerful automation system that feels like one—is surprisingly approachable.
          </p>

          <p>
            In this guide, we'll walk through how you can use n8n to create applications that automate tasks, integrate services, and provide real value to end users, without writing traditional code. Whether you're an entrepreneur, a marketer, or a curious tinkerer, this can open up entirely new possibilities.
          </p>

          <h3>What Makes n8n Different?</h3>
          
          <p>
            n8n isn't just a workflow automation tool. It allows you to:
          </p>

          <ul>
            <li>Connect APIs without coding</li>
            <li>Process, transform, and route data between services</li>
            <li>Add custom logic using JavaScript functions</li>
            <li>Create user-triggered actions (like webhooks)</li>
            <li>Store and manipulate data within workflows</li>
          </ul>

          <p>
            Because of these features, n8n can act as the backend brain of a lightweight app or internal tool.
          </p>

          <h3>Step-by-Step: Building a Simple App with n8n</h3>
          
          <p>Let's build an example: A simple lead collection and notification app.</p>

          <h4>1. Define the App Purpose</h4>
          <p>Our mini app will:</p>
          <ul>
            <li>Collect leads from a web form.</li>
            <li>Validate and clean the data.</li>
            <li>Send a Slack notification.</li>
            <li>Store the lead in Google Sheets.</li>
          </ul>

          <h4>2. Set Up Trigger (Webhook)</h4>
          <p>
            Create a Webhook node in n8n. This will act as your app's entry point—the "API" endpoint that your form will send data to.
          </p>

          <h4>3. Process and Validate Data</h4>
          <p>
            Add a Function node to check the form input: Are required fields present? Is the email formatted properly? This step ensures your app only processes clean, useful data.
          </p>

          <h4>4. Send Notification</h4>
          <p>
            Connect a Slack node to notify your sales team instantly when a new lead arrives. This real-time alert feels like part of a proper backend system.
          </p>

          <h4>5. Store the Lead</h4>
          <p>
            Finally, connect a Google Sheets node (or Airtable, PostgreSQL, etc.) to save the lead for future use. This acts as the app's "database."
          </p>

          <h4>6. Optional: Add Decision Logic</h4>
          <p>
            Want to assign high-value leads to certain team members? Insert an IF node to route leads based on criteria like budget or geography.
          </p>

          <h3>Capabilities That Make n8n Powerful for App-Building</h3>
          
          <h4>Custom Code Support</h4>
          <p>
            Add JavaScript snippets in Function nodes for custom logic when no node fits your need.
          </p>

          <h4>Data Handling</h4>
          <p>
            Manipulate JSON, arrays, and objects without writing backend code.
          </p>

          <h4>Modular Structure</h4>
          <p>
            Every part of your "app" is visible as a node—no hidden server logic.
          </p>

          <h4>API Integrations</h4>
          <p>
            Hundreds of integrations available, or use the HTTP Request node to connect to any REST API.
          </p>

          <h4>Scalability</h4>
          <p>
            Self-host n8n to scale your app or run it securely on your own infrastructure.
          </p>

          <h4>User Interfaces</h4>
          <p>
            While n8n itself is backend-focused, you can easily plug your workflows into frontends built with tools like Retool, Bubble, or custom React apps.
          </p>

          <h3>Real-World Examples</h3>
          
          <ul>
            <li><strong>Internal CRM Tools:</strong> Automate lead management and follow-ups without building a full-fledged CRM system.</li>
            <li><strong>Social Media Posting Apps:</strong> Automatically draft and post updates across platforms.</li>
            <li><strong>Data Collection Pipelines:</strong> Pull, clean, and store data from multiple sources.</li>
          </ul>

          <h3>Is This Really "App Development"?</h3>
          
          <p>
            Some might argue that these are automations, not "real apps." But if an end user can input data and get meaningful, processed results—even if it's via a webhook or an API—the line between automation and app becomes very thin.
          </p>

          <p>
            For internal teams, startups, and solo builders, this is often "app enough"—and massively faster and cheaper than building from scratch.
          </p>

          <h3>Final Thoughts</h3>
          
          <p>
            n8n lowers the barrier for app creation. You can prototype ideas, build MVPs, and automate backend processes in hours instead of weeks. As long as you design responsibly and with clear user outcomes in mind, n8n can be the foundation for surprisingly powerful applications.
          </p>

          <div className="highlight">
            <p>
              Next time you find yourself sketching an app idea on paper, pause and ask: <strong>Can I build this on n8n today?</strong> Chances are, you can—and it might be easier than you think.
            </p>
          </div>
        </>
      )
    },
    {
      id: 'ethical-ai-automation',
      title: 'Building Ethical AI Automation: Balancing Innovation with Responsibility',
      date: 'June 22, 2024',
      tags: ['AI Ethics', 'Automation', 'n8n', 'Responsible Tech'],
      content: (
        <>
          <p>
            In today's automation-driven world, tools like n8n have empowered businesses, developers, and hobbyists to build complex workflows without writing endless lines of code. From scraping data to auto-sending emails, n8n makes connecting apps and services as simple as dragging nodes on a canvas.
          </p>

          <p>
            But as we automate more tasks, especially those involving AI-driven decisions, a critical question arises: <strong>Are we paying enough attention to the ethical implications of what we automate?</strong>
          </p>

          <h3>The Allure of Seamless Automation</h3>
          
          <p>
            Let's be honest: the joy of building an n8n workflow is addictive. You start with a simple trigger—perhaps a form submission on your website—and before you know it, you're auto-enriching the lead data with ChatGPT, categorizing sentiment via an AI API, and feeding the result into your CRM—all hands-free.
          </p>

          <p>
            But here's the catch: <em>Every AI-powered node is making decisions.</em> And with decisions come consequences.
          </p>

          <h3>Where AI Ethics Sneaks Into n8n Workflows</h3>

          <h4>Data Privacy & Consent</h4>
          <p>
            That lead you scraped or enriched—did the user consent to that? Just because n8n enables scraping or enrichment through open APIs doesn't mean it's always ethical (or legal). Data minimization and transparent user consent remain cornerstones of responsible automation.
          </p>

          <h4>Bias in AI Models</h4>
          <p>
            Many n8n users connect their flows to services like OpenAI, Hugging Face models, or other AI endpoints. But do you know how these models were trained? Could they be reinforcing biases—gender, racial, or otherwise—in the data you process? Automating recruitment screening or content moderation via AI without checking for bias is a silent ethical pitfall.
          </p>

          <h4>Accountability & Transparency</h4>
          <p>
            A classic problem: once your n8n flow is live and running 24/7, who's responsible if it misfires or produces a discriminatory result? Who reviews what the AI did? The beauty of automation shouldn't remove the human oversight layer. Keeping logs, adding manual approvals for sensitive decisions, and documenting workflows are essential ethical practices.
          </p>

          <h4>Purpose & Intent</h4>
          <p>
            Why are you automating this? This question seems simple but often gets ignored in the automation rush. Automating outreach is great—but auto-spamming without personalization? Automating AI content generation—amazing—but generating fake reviews or misleading data summaries? Not so great.
          </p>

          <h3>The Grey Zones of AI + Automation</h3>
          
          <p>
            Unlike coding traditional software, where logic and outcome are explicit, AI nodes bring unpredictability. What happens when your AI sentiment analyzer misreads context because of sarcasm? Or when your language model writes unintended offensive content in an automated response?
          </p>

          <p>
            These grey areas aren't rare—they're the norm. And when multiplied at scale by automation platforms like n8n, small errors can cause big problems.
          </p>

          <h3>Building Ethical n8n Flows: A Simple Manifesto</h3>
          
          <div className="manifesto">
            <p>Here are five ground rules that every n8n + AI builder (including myself) should consider:</p>
            <ul>
              <li><strong>Always ask:</strong> "Should this be automated?" Not just "Can it be?"</li>
              <li><strong>Ensure user consent</strong> and data transparency in every data-fetching node.</li>
              <li><strong>Be skeptical of your AI outputs</strong>—test for bias, error, and edge cases.</li>
              <li><strong>Log everything;</strong> make your flows explainable to a third party.</li>
              <li><strong>Keep a human in the loop</strong> for high-impact decisions (e.g., hiring, medical advice, financial recommendations).</li>
            </ul>
          </div>

          <h3>The Future: Responsible Automation at Scale</h3>
          
          <p>
            n8n's open-source nature makes it one of the most democratized automation platforms today. That's both exciting and risky. As AI gets plugged into these flows more deeply—auto-generating content, summarizing legal documents, or qualifying leads—the line between automation convenience and ethical responsibility will blur further.
          </p>

          <p>
            The challenge for builders (like us) is to embrace this complexity—not ignore it. Because in the end, ethical automation isn't about blocking innovation. It's about making sure innovation serves people, not just processes.
          </p>

          <div className="highlight">
            <h4>In Closing</h4>
            <p>
              As you craft your next n8n workflow, pause for a moment. Ask: <strong>Is this flow making a decision I should ethically stand behind?</strong>
            </p>
            <p>
              Because in the quiet corners of low-code automation, the future of AI ethics is quietly taking shape.
            </p>
          </div>
        </>
      )
    }
  ];

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
            <StyledBlogHeader onClick={() => toggleBlog(post.id)} isOpen={openPosts[post.id]}>
              <div>
                <StyledBlogTitle>{post.title}</StyledBlogTitle>
                <StyledBlogMeta>
                  <StyledBlogMetaLeft>
                    <StyledBlogDate>{post.date}</StyledBlogDate>
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
              <StyledIcon isOpen={openPosts[post.id]}>
                <Icon name="ChevronDown" />
              </StyledIcon>
            </StyledBlogHeader>

            <StyledBlogContent isOpen={openPosts[post.id]}>
              {post.content}
            </StyledBlogContent>
          </StyledBlogContainer>
        ))}
      </StyledBlogSection>
    </>
  );
};

export default Blog; 