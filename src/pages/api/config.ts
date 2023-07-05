import { NextApiRequest, NextApiResponse } from 'next';
import { Response } from './types';
import config from './utils/config';

type ConfigResponse = typeof config.GAMES;

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<Response<ConfigResponse>>
) => {
  if (req.method === 'GET') {
    res.status(200).json({
        success: true,
        data: config.GAMES
    });
  } else {
    res.status(405).json({
        success: false,
        error: 'invalid request method'
    });
  }
}

export default handler;