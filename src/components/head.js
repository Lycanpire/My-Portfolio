import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';

// https://www.gatsbyjs.com/docs/add-seo-component/

const Head = ({ title, description, image }) => {
  const { pathname } = useLocation();

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            defaultDescription: description
            siteUrl
            defaultImage: image
            twitterUsername
            keywords
          }
        }
      }
    `,
  );

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
    keywords,
  } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
    keywords: keywords,
  };

  // JSON-LD structured data for Person and Website
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Syed Akbar Abbas Jafri',
      url: seo.url,
      image: seo.image,
      jobTitle: 'AI Product Manager & Digital Transformation Leader',
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance / Consulting',
      },
      sameAs: [
        'https://www.linkedin.com/in/syed-akbar-abbas-jafri-151a38150/',
        'https://www.instagram.com/the_guy_is_no_one/',
        'mailto:saaj.work@gmail.com',
      ],
      description: seo.description,
      email: 'saaj.work@gmail.com',
      knowsAbout: [
        'AI Product Management',
        'AI Consulting',
        'Business Automation',
        'Digital Transformation',
        'SaaS',
        'Product Strategy',
        'AI Solutions',
        'AI Infrastructure',
      ],
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'XIMB',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: siteUrl,
      name: defaultTitle,
      description: defaultDescription,
      sameAs: [
        'https://www.linkedin.com/in/syed-akbar-abbas-jafri-151a38150/',
        'https://www.instagram.com/the_guy_is_no_one/',
      ],
    },
  ];

  return (
    <Helmet title={title} defaultTitle={seo.title} titleTemplate={`%s | ${defaultTitle}`}>
      <html lang="en" />

      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={seo.url} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <meta name="google-site-verification" content="DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk" />

      {/* JSON-LD structured data for Person and Website */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
};
