import { ConfigProvider } from "@/context/config";
import type { AppProps } from "next/app";
import React from "react";
import Wallet from "./_wallet";

import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

require("@solana/wallet-adapter-react-ui/styles.css");

export default function App(props: AppProps) {
  return (
    <ConfigProvider>
      <Wallet {...props} />
      <ToastContainer
        position="bottom-center"
        hideProgressBar
        draggable={false}
        closeButton={false}
        autoClose={2000}
      />
    </ConfigProvider>
  );
}
