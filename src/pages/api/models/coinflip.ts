import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import config from "../utils/config";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../utils/mongodb";
import { airdrop } from "../utils/sol";
import { getFee } from "../utils/fee";
import keypair from "../utils/keypair";

const amountsInLamports = config.GAMES.COINFLIP.AMOUNTS.map(
  (amount) => amount * LAMPORTS_PER_SOL
);

export class Coinflip {
  private signature: string;
  private address: string;
  private amount: number;
  private choice: "heads" | "tails";
  //private status: "created" | "flipped" | "deciding" | "completed";

  private result?: {
    _id: ObjectId;
    result: "heads" | "tails";
    txid: string;
  };

  constructor(
    signature: string,
    address: string,
    amount: number,
    choice: string
  ) {

    if (choice !== "heads" && choice !== "tails") {
      throw Error("invalid choice");
    }



    if (!amountsInLamports.includes(amount)) {
      throw Error("invalid amount");
    }
    this.signature = signature;
    this.address = address;
    this.choice = choice;
    this.amount = amount;
  }

  public async verifyTransaction() {

    const connection = new Connection(config.SOLANA_RPC, "confirmed");

    const transaction = await connection.getTransaction(this.signature, {
      maxSupportedTransactionVersion: 0,
    });
  
    if (!transaction) throw Error("transaction does not exist");
    if (!transaction.meta) throw Error("no transaction metadata");
  
    const keys = transaction.transaction.message.staticAccountKeys.map((key) =>
      key.toString()
    );
  
    if (keys[0] !== this.address) throw Error("source address does not match");
    if (keys[1] !== keypair.publicKey.toString()) throw Error("bank address does not match");
  
    const transactionAmount =
      transaction.meta.postBalances[1] - transaction.meta.preBalances[1];
    if (transactionAmount != (this.amount + getFee(this.amount)))
      throw Error("transaction amounts don't match");
  }

  public async validateSignature() {
    const db = await connectToDatabase();
    const flip = db.collection("flip");
    const signature = await flip.findOne({ signature: this.signature });
    if(signature) throw Error('signature already used');
  }

  public async flip(): Promise<{
    address: string;
    amount: number;
    choice: "heads" | "tails";
    signature: string;
    win: boolean;
    date: EpochTimeStamp;
    txid?: string;
  }> {
    const db = await connectToDatabase();
    const flip = db.collection("flip");

    const flipResult: "heads" | "tails" =
      Math.random() > 0.5 ? "heads" : "tails";

    let flipData = {
      address: this.address,
      amount: this.amount,
      choice: this.choice,
      signature: this.signature,
      win: flipResult == this.choice,
      date: Date.now(),
    };

    const _id = await flip.insertOne(flipData);

    if (flipResult !== this.choice) {
      return flipData;
    }

    const txid = await airdrop(this.amount, this.address);
    await flip.updateOne({ _id: _id }, { $set: { txid: txid } });

    return {
      ...flipData,
      txid: txid,
    };
  }

  public json() {
    return {
      choice: this.choice,
      amount: this.amount,
      //status: this.status,
      address: this.address,
      signature: this.signature,
      result: !this.result ? null : this.result,
    };
  }
}
