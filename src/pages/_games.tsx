import { CoinflipProvider } from "@/context/games/coinflip";
import type { AppProps } from "next/app";

export default function Games(props: AppProps) {
  return (
    <CoinflipProvider>
      {/* more games can be added by using the provider */}
      <props.Component {...props} />
    </CoinflipProvider>
  );
}
