'use client'; // This directive is crucial

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  // We use useState to ensure the QueryClient is initialized only once 
  // per session on the client side, and not recreated on every re-render.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}