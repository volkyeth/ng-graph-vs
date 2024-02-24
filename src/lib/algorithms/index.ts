import { naive } from "./naive";

export const algorithms = {
  naive: naive,
};

export type AlgorithmName = keyof typeof algorithms;
