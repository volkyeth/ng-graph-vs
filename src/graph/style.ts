import { EdgeSingular, NodeSingular } from "cytoscape";

export const style: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": (node: NodeSingular) =>
        getColor(node.data("consilience")),
      "border-color": "#aaa",
      "border-width": 1,
      shape: "ellipse",
      width: "100px",
      height: "100px",
      label: (point: NodeSingular) =>
        `${point.data("consilience") ?? "-"}/${point.data("conviction")}`,
      "text-wrap": "wrap",
      "text-justification": "left",
      "text-max-width": "360px",
      "text-valign": "center",
    },
  },
  {
    selector: "node.aux-node",
    style: {
      "background-color": (node: NodeSingular) =>
        getColor(
          node.cy().getElementById(node.data("edgeId")).data("consilience")
        ),
      label: (node: NodeSingular) => {
        const negation = node.cy().getElementById(node.data("edgeId"));
        return `${negation.data("consilience") ?? "-"}/${negation.data(
          "conviction"
        )}`;
      },
    },
  },

  {
    selector: "edge.negation",
    style: {
      width: 2,
      "target-arrow-shape": "triangle",
      "source-arrow-shape": (e: EdgeSingular) =>
        e.target().hasClass("aux-node") ? "none" : "triangle",
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

const getColor = (consilience: number) =>
  `hsl(${consilience > 0 ? 120 : 240}, 100%, ${
    100 - Math.min(Math.abs(consilience), 50)
  }%)`;
