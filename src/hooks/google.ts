import React from "react";

declare global {
  var google: any;
}

export const useGoogleAuthSetup = () => {
  const handleResponse = React.useCallback(() => {
    console.log("Google auth");
  }, []);

  React.useEffect(() => {
    global.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleResponse,
    });

    global.google?.accounts.id.prompt();
  }, [handleResponse]);
};
