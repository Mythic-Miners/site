'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        const [url] = queryKey;
        if (typeof url === 'string') {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${url}`,
            {
              credentials: 'include',
            },
          );
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        }
        throw new Error('Invalid queryKey');
      },
    },
  },
});

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
