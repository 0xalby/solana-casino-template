const getStashedSignature = (): string | null => {
  const signature = window.localStorage.getItem("stashed-signature");
  return signature;
};

const burnStash = (): void => {
  window.localStorage.removeItem("stashed-signature");
};

const stashSignature = (signature: string) => {
  window.localStorage.setItem("stashed-signature", signature);
};

const getFee = (amount: number, fee: number): number => {
  return (amount / 100) * fee;
};

const getPrizeFromAmount = (amount: number, fee: number): number => {
  return amount * 2 - getFee(amount, fee);
};

export {
  getStashedSignature,
  stashSignature,
  burnStash,
  getPrizeFromAmount,
  getFee,
};
