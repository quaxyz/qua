import React from "react";
import PopupWindow from "libs/popup-window";

export type ReactOauth2Options = {
  id: string;
  url: string;
  redirect_origin: string;
  withHash?: boolean;
};

export function useOath2Login(options: ReactOauth2Options) {
  return React.useCallback(async () => {
    const data = await PopupWindow.open(options.id, `${options.url}`, {
      height: 800,
      width: 600,
      redirect_origin: options.redirect_origin,
      withHash: options.withHash || false,
    });
    return data;
  }, [options]);
}
