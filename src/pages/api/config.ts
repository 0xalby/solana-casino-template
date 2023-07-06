import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "./types";
import config from "./utils/config";
import keypair from "./utils/keypair";

type ConfigResponse = {
  HOUSE_PUBLIC_KEY: string;
  SOLANA_RPC: string;
  GAMES: typeof config.GAMES;
  FEE: number;
};

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<Response<ConfigResponse>>
) => {
  if (req.method === "GET") {
    res.status(200).json({
      success: true,
      data: {
        HOUSE_PUBLIC_KEY: keypair.publicKey.toString(),
        SOLANA_RPC: config.SOLANA_RPC,
        GAMES: config.GAMES,
        FEE: config.FEE
      },
    });
  } else {
    res.status(405).json({
      success: false,
      error: "invalid request method",
    });
  }
};

export default handler;
