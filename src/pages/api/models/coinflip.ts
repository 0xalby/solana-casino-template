import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import config from "../utils/config";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../utils/mongodb";
import { airdrop } from "../utils/sol";

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
  }

  constructor(
    signature: string,
    address: string,
    amount: number,
    choice: string
  ) {
    if (choice !== "heads" && choice !== "tails") {
      throw Error("invalid choice");
    }
    if (amountsInLamports.includes(amount)) {
      throw Error("invalid amount");
    }
    this.signature = signature;
    this.address = address;
    this.choice = choice;
    this.amount = amount;
  }

  public async flip() {
    const flipResult: 'heads' | 'tails' = (Math.random() > 0.5) ? 'heads' : 'tails';

    const txid = await airdrop(this.amount, this.address);

    const db = await connectToDatabase();
    const collection = db.collection("flip");

    const inserted = await collection.insertOne({
        choice: this.choice,
        amount: this.amount,
        address: this.address,
        signature: this.signature,
        result: flipResult,
        txid: txid
    });

    if(!inserted.insertedId) throw Error('data not inserted');

    const result = {
        _id: inserted.insertedId,
        result: flipResult,
        txid: txid 
    }
    this.result = result;
    return this.json();
  }

  public json() {
    return {
        choice: this.choice,
        amount: this.amount,
        //status: this.status,
        address: this.address,
        signature: this.signature,
        result: !this.result ? null : this.result
    }
  }

}
