import { WagmiConfig } from 'wagmi';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import NiceModal from '@ebay/nice-modal-react';
import { ThemeProvider } from '@totejs/uikit';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Index';
import { GlobalProvider } from './context/global';
import { ModalProvider } from './context/modal';
import { WalletModalProvider } from './context/walletModal';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Resource from './pages/Resource';
import { theme } from './theme';

import './base/global.css';

import { WalletKitProvider } from '@node-real/walletkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { config, options } from './config/wallet';
import { Detail } from './pages/Detail';
import { R } from './pages/R';
import { Redirect } from './pages/Redirect';
import Search from './pages/Search';
import RouteGuard from './router/index';

export interface IRoute {
  children?: Array<IRoute>;
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}

declare global {
  interface Window {
    trustWallet?: any;
  }
}

const routes: Array<IRoute> = [
  {
    path: '/',
    element: <Home></Home>,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/profile',
    element: <Profile></Profile>,
  },
  {
    path: '/resource',
    element: <Resource></Resource>,
  },
  {
    path: '/detail',
    element: <Detail></Detail>,
  },
  {
    path: '/redirect',
    element: <Redirect />,
  },
  {
    path: '/r',
    element: <R />,
  },
  // {
  //   path: '/folder',
  //   element: <Folder></Folder>,
  // },
];

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

// const { chains, provider } = configureChains(
//   [env.NETWORK === 'Mainnet' ? bsc : bscTestnet, gfChain],
//   [publicProvider()],
// );

const queryClient = new QueryClient();

function App() {
  // const client = createClient({
  //   autoConnect: true,
  //   connectors: [
  //     new MetaMaskConnector({ chains }),
  //     new InjectedConnector({
  //       chains,
  //       options: {
  //         name: 'Trust Wallet',
  //         shimDisconnect: true,
  //         getProvider: () => {
  //           try {
  //             if (
  //               typeof window !== 'undefined' &&
  //               typeof window?.trustWallet !== 'undefined'
  //             ) {
  //               // window.ethereum = window?.trustWallet;
  //               // eslint-disable-next-line
  //               Object.defineProperty(window.trustWallet, 'removeListener', {
  //                 value: window.trustWallet.off,
  //               });
  //               return window?.trustWallet;
  //             } else {
  //               return null;
  //             }
  //           } catch (e) {
  //             // eslint-disable-next-line no-console
  //             console.log(e);
  //           }
  //         },
  //       },
  //     }),
  //     // new CoinbaseWalletConnector({
  //     //   chains,
  //     //   options: {
  //     //     appName: 'ComboScan',
  //     //   },
  //     // }),
  //     // new WalletConnectConnector({
  //     //   chains,
  //     //   options: {
  //     //     projectId: '...',
  //     //   },
  //     // }),
  //     // new InjectedConnector({
  //     //   chains,
  //     //   options: {
  //     //     name: 'Injected',
  //     //     shimDisconnect: true,
  //     //   },
  //     // }),
  //   ],
  //   provider,
  //   logger: {
  //     warn: (message: string) => console.log(message),
  //   },
  // });

  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig config={config}>
        <WalletKitProvider options={options} mode="dark">
          <QueryClientProvider client={queryClient}>
            <GlobalProvider>
              <NiceModal.Provider>
                <ModalProvider>
                  <WalletModalProvider>
                    <HashRouter>
                      <Layout>
                        <Routes>
                          {routes.map((item: IRoute) => {
                            return (
                              <Route
                                key={item.path}
                                path={item.path}
                                element={
                                  <RouteGuard>{item.element}</RouteGuard>
                                }
                              />
                            );
                          })}
                        </Routes>
                      </Layout>
                    </HashRouter>
                  </WalletModalProvider>
                </ModalProvider>
              </NiceModal.Provider>
            </GlobalProvider>

            <ReactQueryDevtools initialIsOpen />
            {showDevtools && (
              <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction initialIsOpen={false} />
              </React.Suspense>
            )}
          </QueryClientProvider>
        </WalletKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
