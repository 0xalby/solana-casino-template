import config from "./config"

export const getFee = (amount: number): number => {
    return (amount / 100) * config.FEE;
}