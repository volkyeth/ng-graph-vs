export const style: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": "blue",
      width: "20px",
      height: "20px",
    },
  },
  {
    selector: "node.relevance",
    style: {
      "background-color": "#ccc",
      width: 4,
      height: 4,
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "curve-style": "bezier",
    },
  },
  {
    selector: "edge.has",
    style: {
      "target-arrow-shape": "none",
    },
  },
];
