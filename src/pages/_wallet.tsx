import { useConfig } from "@/context/config";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import type { AppProps } from "next/app";
import Games from "./_games";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function Wallet(props: AppProps) {
  const { data } = useConfig();

  return (
    <ConnectionProvider endpoint={data.SOLANA_RPC}>
      <WalletProvider wallets={[new PhantomWalletAdapter()]}>
        <WalletModalProvider>
          <Games {...props} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
