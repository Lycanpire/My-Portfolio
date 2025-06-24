import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import anime from 'animejs';
import styled from 'styled-components';
import { IconLoader } from '@components/icons';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;
  overflow: hidden;

  .logo-wrapper {
    width: max-content;
    max-width: 100px;
    transition: var(--transition);
    opacity: ${props => (props.isMounted ? 1 : 0)};
    z-index: 10;
    position: relative;
    svg {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      fill: none;
      user-select: none;
      #B {
        opacity: 0;
      }
    }
  }

  .matrix-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.3;
  }

  .matrix-column {
    position: absolute;
    top: -100%;
    color: var(--green);
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
    animation: matrix-fall 3s linear infinite;
  }

  .crawling-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .crawl-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
    animation: crawl 4s linear infinite;
  }

  .crawl-line:nth-child(1) {
    top: 20%;
    width: 60%;
    left: -60%;
    animation-delay: 0s;
  }

  .crawl-line:nth-child(2) {
    top: 40%;
    width: 40%;
    left: -40%;
    animation-delay: 1s;
  }

  .crawl-line:nth-child(3) {
    top: 60%;
    width: 80%;
    left: -80%;
    animation-delay: 2s;
  }

  .crawl-line:nth-child(4) {
    top: 80%;
    width: 50%;
    left: -50%;
    animation-delay: 3s;
  }

  @keyframes matrix-fall {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }

  @keyframes crawl {
    0% {
      transform: translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateX(100vw);
      opacity: 0;
    }
  }

  .binary-blink {
    position: absolute;
    color: var(--green);
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 12px;
    opacity: 0.6;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const createMatrixColumns = () => {
    const columns = [];
    for (let i = 0; i < 20; i++) {
      const column = [];
      for (let j = 0; j < 20; j++) {
        column.push(Math.random() > 0.5 ? '1' : '0');
      }
      columns.push(column.join(''));
    }
    return columns;
  };

  const createBinaryElements = () => {
    const elements = [];
    for (let i = 0; i < 50; i++) {
      elements.push({
        id: i,
        text: Math.random() > 0.5 ? '1' : '0',
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      });
    }
    return elements;
  };

  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: '#logo path',
        delay: 300,
        duration: 1500,
        easing: 'easeInOutQuart',
        strokeDashoffset: [anime.setDashoffset, 0],
      })
      .add({
        targets: '#logo #B',
        duration: 700,
        easing: 'easeInOutQuart',
        opacity: 1,
      })
      .add({
        targets: '#logo',
        delay: 500,
        duration: 300,
        easing: 'easeInOutQuart',
        opacity: 0,
        scale: 0.1,
      })
      .add({
        targets: '.loader',
        duration: 200,
        easing: 'easeInOutQuart',
        opacity: 0,
        zIndex: -1,
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, []);

  const matrixColumns = createMatrixColumns();
  const binaryElements = createBinaryElements();

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <Helmet bodyAttributes={{ class: `hidden` }} />

      {/* Matrix-style falling 0s and 1s */}
      <div className="matrix-background">
        {matrixColumns.map((column, index) => (
          <div
            key={index}
            className="matrix-column"
            style={{
              left: `${(index / matrixColumns.length) * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {column}
          </div>
        ))}
      </div>

      {/* Crawling lines */}
      <div className="crawling-lines">
        <div className="crawl-line"></div>
        <div className="crawl-line"></div>
        <div className="crawl-line"></div>
        <div className="crawl-line"></div>
      </div>

      {/* Blinking binary elements */}
      {binaryElements.map((element) => (
        <div
          key={element.id}
          className="binary-blink"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
          }}
        >
          {element.text}
        </div>
      ))}

      <div className="logo-wrapper">
        <IconLoader />
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
