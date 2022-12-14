import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toast } from './components/Toast';

import IndexRouter from './router';
import { AppContextProvider } from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <IndexRouter />
      <Toast />
    </QueryClientProvider>
  </AppContextProvider>,
);
