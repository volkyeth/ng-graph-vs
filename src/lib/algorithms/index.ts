import { lifoRelevance } from "./lifoRelevance";
import { naive } from "./naive";

export const algorithms = {
  naive,
  lifoRelevance,
};

export const algorithmNames = Object.keys(algorithms) as AlgorithmName[];

export type AlgorithmName = keyof typeof algorithms;
