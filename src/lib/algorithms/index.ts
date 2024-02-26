import { naive } from "./naive";

export const algorithms = {
  naive: naive,
};

export const algorithmNames = Object.keys(algorithms) as AlgorithmName[];

export type AlgorithmName = keyof typeof algorithms;
