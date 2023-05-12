import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { Toast } from './components/Toast';

import IndexRouter from './router';
import { AppContextProvider } from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const FIVE_MINUTES = 1000 * 60 * 5;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
    },
  },
});

root.render(
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <IndexRouter />
      <Toast />
    </QueryClientProvider>
  </AppContextProvider>,
);
