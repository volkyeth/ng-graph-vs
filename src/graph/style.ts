export const style: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": "blue",
      width: "20px",
      height: "20px",
      label: "data(text)",
      "text-wrap": "wrap",
      "text-max-width": 160,
      "text-background-color": "#fff",
      "text-background-opacity": 1,
      "text-background-padding": 4,
      "text-background-shape": "roundrectangle",
      "text-border-color": "#aaa",
      "text-border-width": 1,
      "text-border-opacity": 1,
      "text-margin-y": -15,

      "min-zoomed-font-size": 10,
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
      "curve-style": "straight",
    },
  },
  {
    selector: "edge.has",
    style: {
      "target-arrow-shape": "triangle",
    },
  },
];
