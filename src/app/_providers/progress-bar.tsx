"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export const AppBar = () => {
  return (
    <ProgressBar
      options={{ showSpinner: false }}
      shallowRouting
      height="4px"
      color="#000"
    />
  );
};
