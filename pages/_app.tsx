import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import "../src/styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import { Provider } from 'react-redux';
import store from '../store';
import Router from 'next/router';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const MyApp = ({ Component, pageProps }: AppProps) => {
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