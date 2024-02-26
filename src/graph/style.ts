import { NodeSingular } from "cytoscape";

export const style: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": (node: NodeSingular) =>
        getColor(node.data("credence")),
      "border-color": "#aaa",
      "border-width": 1,
      shape: "ellipse",
      width: "100px",
      height: "100px",
      label: (point: NodeSingular) =>
        `${point.data("credence") ?? "-"}/${point.data("conviction")}`,
      "text-wrap": "wrap",
      "text-justification": "left",
      "text-max-width": "360px",
      "text-valign": "center",
    },
  },
  {
    selector: "node.relevance",
    style: {
      "border-color": "#aaa",
      "border-width": 1,
      shape: "diamond",
      "background-color": (node: NodeSingular) =>
        getColor(node.data("relevance")),
      label: (node: NodeSingular) =>
        `${node.data("relevance") ?? "-"}/${node.data("conviction")}`,
    },
  },

  {
    selector: "edge.negation",
    style: {
      width: 2,
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "curve-style": "straight",
    },
  },
  {
    selector: ".point:selected",
    style: {
      "border-color": "blue",
    },
  },
];

const getColor = (intensity: number) =>
  `hsl(${intensity > 0 ? 120 : 240}, 100%, ${
    100 - Math.min(Math.abs(intensity), 50)
  }%)`;
