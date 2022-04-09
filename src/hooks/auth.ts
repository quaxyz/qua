import Api from "libs/api";
import { useQuery } from "react-query";

export const useCustomerData = (initialData?: any) => {
  return useQuery({
    queryKey: ["customer-data"],
    staleTime: 0, // always stale
    cacheTime: 0,
    initialData: initialData,
    queryFn: async () => {
      const { payload } = await Api().get(`/user`);
      return payload;
    },
  });
};
