import {
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import keypair from "./keypair";
import config from "./config";

export const airdrop = async (
  amount: number,
  address: string
): Promise<string> => {
  try {
  const connection = new Connection(config.SOLANA_RPC, "confirmed");
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(address),
      lamports: amount,
    })
  );
  const txid = await sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair],
    {
      commitment: "processed",
    }
  );
  return txid;
  } catch {
    throw Error('error transfering sol');
  }
};
