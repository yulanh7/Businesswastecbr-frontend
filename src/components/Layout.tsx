import React, { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/layout.module.scss';
import utilStyles from '../styles/utils.module.scss';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Container } from "react-bootstrap";
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';

const DynamicResponsiveNavbar = dynamic(() => import('./Navbar'), {
  ssr: false, // Load only on the client side
});

interface LayoutProps {
  children?: ReactNode;
  subTitle?: string;
  topSubTitle?: string;
  loading?: boolean;
}

export default function Layout({ children, subTitle, topSubTitle, loading = false }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 60) { // Change this value based on when you want the header to become fixed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);
  return (
    <div>
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
        <title>Sustainable Business Program recycling training</title>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@300;400;500;600;700&display=swap" rel="stylesheet" type="text/css"></link>
      </Head>
      <main className={styles.pageContainer}>
        {loading &&
          <LoadingSpinner />
        }
        <>
          <div className={isScrolled ? `${styles.headerContainer} ${styles.fixedHeader}` : styles.headerContainer} id="header">
            <div className={styles.headerTop}>
              {/* <Row>
            <Col xs='12' sm='6'>
              </Col>
              </Row> */}
              <div className={styles.headerTopLeft}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.climatechoices.act.gov.au/">

                  <Image src="/images/ECC-Logo.svg" alt="logo" width={100} height={80} className={styles.siteLogo} priority={true}
                  />                  {/* <Image src="/images/Logo-ClimateChoices.svg" alt="logo" width={100} height={50} className={styles.logo} /> */}
                </a>
              </div>
              <div className={styles.headerTopCenter}>
                <h1>Online Interactive Recycling Training
                </h1>
                <DynamicResponsiveNavbar />
              </div>
              <div className={styles.headerTopRight}>
                <a target='_blank' href='https://www.act.gov.au/'>

                  <Image src="/images/ACTGov_inline_black.svg" alt="logo" width={150} height={80} className={styles.actLogo} priority={true}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className={isScrolled ? styles.headerPlaceholder : ''}></div>

          <div className={utilStyles.pageBody}>

            {topSubTitle && <div className={`${utilStyles.text} ${utilStyles.textCenter}`}>{topSubTitle}</div>}
            {
              subTitle &&

              <div className={`${utilStyles.textMd} ${utilStyles.textCenter}`}>
                {subTitle}
              </div>
            }
            {children}
          </div>
          <div className={`${styles.footerContainer} ${utilStyles.pT10px}`}>
            <Container>

              <div className={`${utilStyles.textSm} `}>
                ©2023 Sustainable Business Program recycling training
              </div>
            </Container>
          </div>
        </>

      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  topSubTitle: PropTypes.string,
  subTitle: PropTypes.string,
  loading: PropTypes.bool,
};
