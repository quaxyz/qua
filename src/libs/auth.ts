import { createContext } from "react";

type AuthContextType = {
  status: string;
  loading: boolean;
  publicKey: string | null | undefined;
  setPublicKey: (key: string) => void;
};

export const AuthContext = createContext<null | AuthContextType>(null);
