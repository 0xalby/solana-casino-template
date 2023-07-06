import { useConfig } from "@/context/config";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import { burnStash, getFee, getPrizeFromAmount, getStashedSignature, stashSignature } from "./utils";
import { toast } from "react-toastify";

type states = "initialized" | "deciding" | "completed";

interface CoinflipContextType {
  choice: "heads" | "tails";
  amount: number;
  signature: string;
  address: string;
  txid?: string;
  win: boolean;
  status: states;
  setChoice: (choice: "heads" | "tails") => void;
  setAmount: (amount: number) => void;
  flip: () => void;
  reset: () => void;
}

const CoinflipContext = createContext<CoinflipContextType>({
  choice: "heads",
  amount: 0,
  signature: "",
  address: "",
  status: "initialized",
  win: false,
  setChoice: () => {},
  setAmount: () => {},
  flip: () => {},
  reset: () => {},
});

const CoinflipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const config = useConfig();
  const { data } = config;

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [choice, setChoice] = useState<"heads" | "tails">("heads");

  const [amount, setAmount] = useState<number>(data.GAMES.COINFLIP.AMOUNTS[0]);
  const [signature, setSignature] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<states>("initialized");

  const [txid, setTxid] = useState<string | undefined>();
  const [win, setWin] = useState<boolean>(false);

  const flip = async () => {
    if (loading) return;
    if (!connection) return;
    if (status != "initialized") return;
    if (address == "") return;
    if (!data.GAMES.COINFLIP.AMOUNTS.includes(amount)) return;

    try {
      setStatus("deciding");

      const transfer = async () => {
        try {
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(address),
              toPubkey: new PublicKey(data.HOUSE_PUBLIC_KEY),
              lamports: amount + getFee(amount, data.FEE),
            })
          );
          const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight },
          } = await connection.getLatestBlockhashAndContext();
          const signature = await sendTransaction(transaction, connection, {
            minContextSlot,
          });

          await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature,
          });
          return signature;
        } catch {
          setStatus("initialized");
          toast.error("error sending SOL");
        }
        toast.info("sent transaction");
      };

      const stashedSignature = getStashedSignature();
      if (stashedSignature) burnStash();
      const signature = stashedSignature ? stashedSignature : await transfer();
      if (!signature) return toast.error("no signature");
      toast.success("transaction confirmed");
      toast.info("flipping...");

      const decide = async (
        signature: string
      ): Promise<{ win: boolean; txid?: string }> => {
        const response = await fetch("/api/game/coinflip", {
          method: "POST",
          body: JSON.stringify({
            choice: choice,
            address: address,
            signature: signature,
            amount: amount,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        if (!response.ok) {
          responseData.error != "signature already used" &&
            stashSignature(signature);
          toast.error("error flipping - try again");
          setStatus("initialized");
          throw Error("flip failed");
        } else {
          if (responseData.data.win) {
            //false by default
            setWin(true);
            setTxid(responseData.data.txid);
            return { win: true, txid: responseData.data.txid };
          }
          return { win: false };
        }
      };

      const decided = await decide(signature);
      toast.success("flipped");

      if (decided.win) {
        setTxid(txid);
        toast.info(`you win ${getPrizeFromAmount(amount, data.FEE)}`);
        toast.info(decided.txid);
      } else {
        toast.info("you lose");
      }

      setStatus("completed");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!publicKey) return;
    setAddress(publicKey.toString());
  }, [publicKey]);

  const reset = async () => {
    setSignature("");
    setLoading(false);
    setStatus("initialized");
    setTxid(undefined);
    setWin(false);
    setAmount(data.GAMES.COINFLIP.AMOUNTS[0]);
  };

  return loading ? (
    <>coinflip loading....</>
  ) : (
    <CoinflipContext.Provider
      value={{
        choice: choice,
        amount: amount,
        signature: signature,
        address: address,
        status: status,
        win: win,
        txid: txid,
        setChoice: setChoice,
        setAmount: setAmount,
        flip: flip,
        reset: reset,
      }}
    >
      {children}
    </CoinflipContext.Provider>
  );
};

const useCoinflip = (): CoinflipContextType => useContext(CoinflipContext);

export { useCoinflip, CoinflipProvider };
