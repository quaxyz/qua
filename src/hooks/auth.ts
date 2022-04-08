import Api from "libs/api";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { COOKIE_STORAGE_NAME } from "libs/cookie";
import { useRouter } from "next/router";

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

export function useLogout() {
  // const storeAuth = useStoreAuth();
  const { deactivate } = useWeb3React();

  return async () => {
    Cookies.remove(COOKIE_STORAGE_NAME);

    // if (storeAuth) {
    //   await destroyKeyPair();
    //   storeAuth?.setPublicKey(null);
    // }

    deactivate();
  };
}
