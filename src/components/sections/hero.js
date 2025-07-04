import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 100px 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 80px 0 20px 2px;
    }
  }

  h3.big-heading {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
    font-size: clamp(2rem, 8vw, 4rem);
  }

  h3.subtitle-heading {
    margin-top: 5px;
    color: var(--slate);
    line-height: 1.1;
    font-size: clamp(1.1rem, 4vw, 2rem);
    font-weight: 400;
    opacity: 0.85;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1><br></br>Hi, my name is</h1>;
  const two = <h3 className="big-heading">Syed Akbar Abbas Jafri(CSM®)</h3>;
  const three = <h3 className="subtitle-heading">I turn business challenges into AI-driven opportunities</h3>;
  const four = (
    <>
      <p>
      I am Syed Akbar Abbas Jafri, an MBA graduate from XIMB with expertise in Product Management, Project Management, AI Consultancy, Scrum practices and Full Stack Software Development. Through my experience at IRIS Business Services, Cognizant, my own startup, and multiple internships, I have honed my skills in driving AI-led solutions, managing cross-functional projects, and building scalable digital products. My diverse background and continuous learning mindset enable me to bridge the gap between technology and business, solve complex problems, and deliver impactful, market-ready solutions.  <a href="https://www.instagram.com/the_guy_is_no_one/" target="_blank" rel="noreferrer"> <br></br>
        However, let's take a moment to catch up on my casual side!
        </a>
      
      </p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href="https://www.linkedin.com/in/syed-akbar-abbas-jafri-151a38150/"
      target="_blank"
      rel="noreferrer">
      Also, Feel free to reach out — whether it's for collaboration, tech talk, or just a good conversation!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
