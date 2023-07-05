import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../types";
import { number, object, string } from "yup";
import { Coinflip } from "../../models/coinflip";
import { BooleanLiteral, StringLiteral } from "typescript";
import { ObjectId } from "mongodb";

const flipSchema = object({
  choice: string().required(),
  address: string().required(),
  signature: string().required(),
  amount: number().required(),
});

type CoinFlipResponse = {
  win: boolean;
  prize: number;
  amount: number;
  txid: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<CoinFlipResponse>>
) => {
  if (req.method === "POST") {
    try {
      const { choice, address, signature, amount } = await flipSchema.validate(
        req.body
      );
      const coinflip = new Coinflip(signature, address, amount, choice);
      const data = await coinflip.flip();

      if (!data.result) throw Error('no result yielded');
    
      return res.status(200).json({ success: true, data: {
        win: data.result.result == choice,
        prize: data.amount * 2,
        amount: data.amount,
        txid: data.result.txid
      } });
      
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "invalid method" });
  }
};

export default handler;
