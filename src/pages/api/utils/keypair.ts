import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import config from "./config";

const keypair = Keypair.fromSecretKey(bs58.decode(config.HOUSE_PRIVATE_KEY));

export default keypair;
