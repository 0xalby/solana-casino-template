import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

interface ConfigData {
  FEE: number;
  HOUSE_PUBLIC_KEY: string;
  SOLANA_RPC: string;
  GAMES: {
    COINFLIP: {
      ENABLED: boolean;
      AMOUNTS: number[];
    };
  };
}

interface ConfigContextType {
  data: ConfigData;
  loading: boolean;
}

const defaultValues = {
  FEE: 0,
  HOUSE_PUBLIC_KEY: "",
  SOLANA_RPC: "",
  GAMES: {
    COINFLIP: {
      ENABLED: false,
      AMOUNTS: [],
    },
  },
};

const ConfigContext = createContext<ConfigContextType>({
  data: defaultValues,
  loading: true,
});

const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ConfigData>(defaultValues);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/config");
        const configData = await response.json();
        console.log("config:", configData);
        if (configData.success == false) throw Error(configData.error);
        setData({
          FEE: configData.data.FEE,
          HOUSE_PUBLIC_KEY: configData.data.HOUSE_PUBLIC_KEY,
          SOLANA_RPC: configData.data.SOLANA_RPC,
          GAMES: {
            COINFLIP: {
              ENABLED: configData.data.GAMES.COINFLIP.ENABLED,
              AMOUNTS: configData.data.GAMES.COINFLIP.AMOUNTS.map(
                (amount: number) => amount * LAMPORTS_PER_SOL
              ),
            },
          },
        });
      } catch (error) {
        console.error("error fetching config:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return loading ? (
    <>loading configuration...</>
  ) : (
    <ConfigContext.Provider value={{ data, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

const useConfig = (): ConfigContextType => useContext(ConfigContext);

export { useConfig, ConfigProvider };
