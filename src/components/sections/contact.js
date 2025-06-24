import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const StyledPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 29, 47, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledPopup = styled.div`
  background: #112240;
  color: #ccd6f6;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(2,12,27,0.7);
  min-width: 320px;
  text-align: center;
  position: relative;

  .close-btn {
    position: absolute;
    top: 12px;
    right: 16px;
    background: none;
    border: none;
    color: #64ffda;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .connect-options {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1.5rem;
  }

  .connect-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    background: #233554;
    color: #64ffda;
    border: none;
    border-radius: 6px;
    padding: 0.7rem 1.2rem;
    font-size: 1.1rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
  }
  .connect-btn:hover {
    background: #64ffda;
    color: #0a192f;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What's Next?</h2>
      <h2 className="title">Let's connect!</h2>
      <p>
        I'm always open to engaging conversations—whether it's about AI, product strategy, building scalable tech infrastructure, or navigating the exciting world of digital business. If you're curious about turning automation ideas into full-fledged AI platforms or want to chat about product management and technology trends (or even life beyond work 😊), feel free to reach out.<br />
        <br />
        You can find me on LinkedIn, Instagram, or via email—I do my best to respond to every message.<br />
        <br />
        Also, if you're thinking of creating your own personal tech portfolio, launching an AI-driven solution, or simply want guidance on starting your digital journey, I'd be glad to share insights.<br />
        Let's build something awesome together! 🚀
      </p>
      <button className="email-link" onClick={() => setShowPopup(true)}>
        Connect Now
      </button>
      {showPopup && (
        <StyledPopupOverlay>
          <StyledPopup ref={popupRef}>
            <button className="close-btn" onClick={() => setShowPopup(false)} aria-label="Close">&times;</button>
            <h3>Connect with me</h3>
            <div className="connect-options">
              <a
                className="connect-btn"
                href="https://www.linkedin.com/in/syed-akbar-abbas-jafri-151a38150/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span role="img" aria-label="LinkedIn">🔗</span> LinkedIn
              </a>
              <a
                className="connect-btn"
                href="https://www.instagram.com/the_guy_is_no_one/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span role="img" aria-label="Instagram">📸</span> Instagram
              </a>
              <a
                className="connect-btn"
                href="mailto:saaj.work@gmail.com"
              >
                <span role="img" aria-label="Email">✉️</span> saaj.work@gmail.com
              </a>
            </div>
          </StyledPopup>
        </StyledPopupOverlay>
      )}
    </StyledContactSection>
  );
};

export default Contact;
