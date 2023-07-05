const config = {
  HOUSE_PRIVATE_KEY: "...",
  SOLANA_RPC: "...",
  MONGODB: {
    URI: "...",
    DBNAME: "...",
  },

  GAMES: {
    COINFLIP: {
      ENABLED: true,
      AMOUNTS: [0.05, 0.1, 0.5],
    },
  },
};
export default config;
