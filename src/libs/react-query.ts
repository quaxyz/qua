import { QueryClient } from "react-query";

export function getQueryClient(options?: any) {
  return new QueryClient({
    ...options,
    defaultOptions: {
      ...options?.defaultOptions,
      queries: {
        ...options?.defaultOptions?.queries,
        refetchOnWindowFocus: false,
        staleTime: 240 * 1000,
        retry: 1,
      },
    },
  });
}
