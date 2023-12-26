import { ElementsDefinition } from "cytoscape";

export const elements: ElementsDefinition = {
  nodes: [
    {
      data: {
        id: "p0",
      }
    },
    {
      data: {
        id: "p1",
      }
    },
  ],
  edges: [
    { data: { source: 'p1', target: 'p0' }, classes: 'negation' },
  ],
}