import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import type { AppContext } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import setCookie from 'set-cookie-parser';
import { useTranslation } from 'react-i18next';

import Layout from 'src/components/Layout';
import { store, persistor } from 'src/redux';
import { IS_AUTH } from 'src/query/user';

import { withApollo, initApolloClient } from '../apollo/withApollo';

// Skip Adding FontAwesome CSS
config.autoAddCss = false;

const FONT = `
  @font-face {
    font-family: "Nanum Gothic";
    src: url("/fonts/Nanum Gothic.woff2");
    font-style: normal;
    font-weight: 400;
    font-display: fallback;
  }

  @font-face {
    font-family: "Nanum Gothic";
    src: url("/fonts/Nanum Gothic Bold.woff2");
    font-style: bold;
    font-weight: 600;
    font-display: fallback;
  }
`;

function ElainaBlog({ Component, pageProps, apolloClient, cookies }: any) {
  if (typeof window !== 'undefined') {
    if (cookies[0] && cookies[1]) {
      document.cookie = cookies[0];
      document.cookie = cookies[1];
    }
  }

  useTranslation();

  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <meta charSet='utf-8' />
            {/* <link rel='icon' href='%PUBLIC_URL%/favicon.ico' /> */}
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='theme-color' content='#000000' />
            <meta name='description' content='Elaina Blog Theme' />
            {/* <link rel='apple-touch-icon' href='%PUBLIC_URL%/logo192.png' /> */}
            {/* <link rel='manifest' href='%PUBLIC_URL%/manifest.json' /> */}
            <title>Elaina Blog</title>
            <style>{FONT}</style>
          </Head>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}

export interface AppCommonProps {
  app: {
    isLogin: boolean;
  };
}

export const appCommponProps: AppCommonProps = {
  app: {
    isLogin: false
  }
};

ElainaBlog.getInitialProps = async (context: AppContext) => {
  const { ctx, Component } = context;
  const client = initApolloClient({}, ctx);
  const { data } = await client.query({ query: IS_AUTH });

  const combinedCookieHeader = data.isAuth.cookie;
  const cookies = setCookie.splitCookiesString(combinedCookieHeader || '');
  const isLogin = data.isAuth.isAuth;

  let pageProps: AppCommonProps = {
    app: {
      isLogin
    }
  };

  if (Component.getInitialProps) {
    Object.assign(pageProps, await Component.getInitialProps(ctx));
  }

  Object.assign(appCommponProps, pageProps);

  return { pageProps, cookies };
};

export default withApollo(ElainaBlog);
