import { useConfig } from "@/context/config";
import { useCoinflip } from "@/context/games/coinflip";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import styles from "@/styles/Home.module.scss";
import Head from "next/head";
import { SkewLoader } from "react-spinners";
 

export default function Home() {
  const { connected } = useWallet();
  const { data } = useConfig();
  const { status, amount, win, txid, setAmount, flip, reset } = useCoinflip();
  return (
    <>
      <Head>
        <title>Solana Casino</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <div className={styles.navbutton}>
            {connected && <WalletMultiButton />}
          </div>
          <div className={styles.wrapper}>
            <div className={styles.logo}>coinflip</div>
            <div className={styles.content}>
              {!connected ? (
                <WalletMultiButton />
              ) : (
                <div>
                  <div className={styles.button_group}>
                    <div
                      className={`${styles.div1} ${styles.button} ${
                        amount == 0.05 * LAMPORTS_PER_SOL &&
                        styles.button_selected
                      } ${status == "deciding" && styles.button_disabled}`}
                      onClick={() => setAmount(0.05 * LAMPORTS_PER_SOL)}
                    >
                      0.05
                    </div>
                    <div
                      className={`${styles.div2} ${styles.button} ${
                        amount == 0.1 * LAMPORTS_PER_SOL &&
                        styles.button_selected
                      } ${status == "deciding" && styles.button_disabled}`}
                      onClick={() => setAmount(0.1 * LAMPORTS_PER_SOL)}
                    >
                      0.1
                    </div>
                    <div
                      className={`${styles.div3} ${styles.button} ${
                        amount == 0.5 * LAMPORTS_PER_SOL &&
                        styles.button_selected
                      } ${status == "deciding" && styles.button_disabled}`}
                      onClick={() => setAmount(0.5 * LAMPORTS_PER_SOL)}
                    >
                      0.5
                    </div>
                    <div
                      className={`${styles.div4} ${styles.wide_button} ${
                        status == "deciding" && styles.button_disabled
                      }`}
                      onClick={() => {
                        if(status == 'completed') return reset();
                        flip();
                      }}
                    >
                      {status == "deciding" ? (
                        <>
                          <SkewLoader color="black" />
                        </>
                      ) : (
                        <>{status == "completed" ? 'NICE' : 'DOUBLE OR NOTHING'}</>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
