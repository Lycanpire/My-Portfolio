import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Jobs, Featured, Projects, Blog, Contact } from '@components';
import { Link } from 'gatsby';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Jobs />
      <Featured />
      <Projects />
      <Blog />
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Private Tools</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link to="/expense-tracker/" className="inline-link">Expense Tracker — Akbar & Noor</Link>
          <span style={{ color: '#8892b0' }}>|</span>
          <Link to="/expense-tracker-akbar-arya/" className="inline-link">Expense Tracker — Akbar & Arya</Link>
        </div>
      </div>
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
