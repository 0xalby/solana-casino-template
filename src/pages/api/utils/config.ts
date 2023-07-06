const config = {
  FEE: 3, //%
  HOUSE_PRIVATE_KEY: "kA3CxFYmjJKSXXf6fL4bkzz734KtVBgn2hMERxMPKLFF8uM9whv6rC69zRzL7hgR758FT8Sm7NT2E2oqcyrWpSK",
  SOLANA_RPC: "https://solana-devnet.g.alchemy.com/v2/demo",
  MONGODB: {
    URI: "mongodb+srv://admin:odara@cluster0.curzrrh.mongodb.net/?retryWrites=true&w=majority",
    DBNAME: "coinflip",
  },
  GAMES: {
    COINFLIP: {
      ENABLED: true,
      AMOUNTS: [0.05, 0.1, 0.5],
    },
  },
};
export default config;
