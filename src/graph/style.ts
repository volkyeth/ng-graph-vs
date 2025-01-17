import { EdgeSingular, NodeSingular } from "cytoscape";

export const style: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": (node: NodeSingular) =>
        getColor(node.data("credence")),
      "border-color": "#aaa",
      "border-width": 1,
      shape: "round-rectangle",
      width: "400px",
      height: "160px",
      label: (point: NodeSingular) =>
        `[${point.data("credence") ?? "-"}/${point.data(
          "conviction"
        )}] ${breakLongWords(point.data("text") ?? "").replace(/\n/g, " ")}`,
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
      "line-style": (edge) =>
        edge.source().data("relevance") > 0 ? "solid" : "dashed",

      width: (edge: EdgeSingular) =>
        Math.min(Math.max(1, edge.source().data("relevance")), 6),
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
  `hsl(${intensity > 0 ? 120 : 200}, 100%, ${
    100 - Math.min(Math.abs(intensity), 50)
  }%)`;

const breakLongWords = (text: string) =>
  text.replace(/[^\s]{46,}/g, (word) =>
    (word.match(/.{1,46}/g) ?? []).join("\n")
  );
