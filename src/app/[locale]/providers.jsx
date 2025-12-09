'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider here

export default function Providers({ children, initialUser }) {
  // Create a client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ AuthProvider is now INSIDE QueryClientProvider */}
      {/* It can now successfully use useQueryClient() */}
      <AuthProvider initialUser={initialUser}>
         {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}