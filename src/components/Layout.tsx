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
  children: ReactNode;
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
        {/* <link rel="icon" href="/favicon.png" /> */}
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
      </Head>
      <main className={styles.pageContainer}>
        {loading &&
          <LoadingSpinner />
        }
        <>
          <div className={isScrolled ? `${styles.headerContainer} ${styles.fixedHeader}` : styles.headerContainer} id="header">
            <Container className={styles.headerTop}>
              <div className={utilStyles.logBox}>
                <a target="_blank" rel="noopener noreferrer" href="https://www.climatechoices.act.gov.au/">
                  <div className={utilStyles.logTextBox}>

                    <div className={utilStyles.first}>
                      Everyday
                    </div>
                    <div className={utilStyles.second}>
                      climate
                    </div>
                    <div className={utilStyles.third}>
                      choices
                    </div>
                  </div>
                  {/* <Image src="/images/Logo-ClimateChoices.svg" alt="logo" width={100} height={50} className={styles.logo} /> */}
                </a>
              </div>
              <DynamicResponsiveNavbar />
              <a target='_blank' href='https://www.act.gov.au/'>

                <Image src="/images/ACTGov_inline_rev.svg" alt="logo" width={100} height={50} className={styles.logo} priority={true}
                />
              </a>
            </Container>
          </div>
          <div className={isScrolled ? styles.headerPlaceholder : ''}></div>

          <div className={utilStyles.pageBody}>

            <div className={`${utilStyles.text} ${utilStyles.textCenter}`}>{topSubTitle}</div>
            <div className={`${utilStyles.textMd} ${utilStyles.textCenter}`}>
              {subTitle}
            </div>
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
