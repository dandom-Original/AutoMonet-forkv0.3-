import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from './utils/query-client';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import FallbackLoader from './components/ui/FallbackLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Create a client
const queryClient = createQueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <React.Suspense fallback={<FallbackLoader />}>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                {/* Add other routes here */}
              </Route>
            </Routes>
          </Router>
        </React.Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
