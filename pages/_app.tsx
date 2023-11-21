import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import "../src/styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import { Provider } from 'react-redux';
import store from '../store';
import Router from 'next/router';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useRouter } from 'next/router';

config.autoAddCss = false

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    // Add the lang attribute to the <html> tag when the component mounts
    document.documentElement.lang = router.locale || 'en-AU';
  }, [router.locale]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Set the current URL as the previous URL
      localStorage.setItem('previousRoute', localStorage.getItem('currentRoute') || "");
      // Update the current URL
      localStorage.setItem('currentRoute', url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;