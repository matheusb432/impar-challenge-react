import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';

import IndexRouter from './router';
import { AppContextProvider } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <IndexRouter />
      </QueryClientProvider>
    </AppContextProvider>
  </React.StrictMode>
);
