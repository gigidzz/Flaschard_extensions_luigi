import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Assuming you'll create these components later
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import PracticePage from './pages/PracticePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className='w-full h-full min-h-screen bg-blue-200'>
          <Navbar />
          <main className='max-w-7xl mx-auto mt-14'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;