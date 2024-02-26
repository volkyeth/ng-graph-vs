import { Core } from "cytoscape";

export interface Algorithm {
  name: string;
  assignCredence: (cytoscape: Core, iterations: number) => void;
}
