import { Core } from "cytoscape";

export interface Algorithm {
  name: string;
  assignConsilience: (cytoscape: Core, iterations: number) => void;
}
