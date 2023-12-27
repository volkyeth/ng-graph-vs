import { ElementsDefinition } from "cytoscape";

export const duckSample: ElementsDefinition = {
  nodes: [
    {
      data: {
        id: "p0",
        text: "She has no duck",
      },
      classes: "point",
    },
    {
      data: {
        id: "p1",
        text: "She has a duck",
      },
      classes: "point",
    },
    {
      data: {
        id: "p2",
        text: "I saw her duck",
      },
      classes: "point",
    },
    {
      data: {
        id: "p3",
        text: "She did nothing to stop the bullet",
      },
      classes: "point",
    },
    {
      data: {
        id: "p4",
        text: "She ducked to dodge the bullet",
      },
      classes: "point",
    },
    {
      data: {
        id: "p5",
        text: "It could be someone else's duck",
      },
      classes: "point",
    },
    {
      data: {
        id: "r0>1",
      },
      classes: "relevance",
    },
    {
      data: {
        id: "r1>0",
      },
      classes: "relevance",
    },
    {
      data: {
        id: "r2>1>0",
      },
      classes: "relevance",
    },
    {
      data: {
        id: "r3>4",
      },
      classes: "relevance",
    },
    {
      data: {
        id: "r4>3",
      },
      classes: "relevance",
    },
    {
      data: {
        id: "r2>4>3",
      },
      classes: "relevance",
    },
    {
      data: {
        id: "r5>r2>0",
      },
      classes: "relevance",
    },
  ],
  edges: [
    { data: { source: "p0", target: "r0>1" }, classes: "has" },
    { data: { source: "r0>1", target: "p1" }, classes: "negating" },
    { data: { source: "p1", target: "r1>0" }, classes: "has" },
    { data: { source: "r1>0", target: "p0" }, classes: "negating" },
    { data: { source: "p2", target: "r2>1>0" }, classes: "has" },
    { data: { source: "r2>1>0", target: "p0" }, classes: "negating" },
    { data: { source: "p3", target: "r3>4" }, classes: "has" },
    { data: { source: "r3>4", target: "p4" }, classes: "negating" },
    { data: { source: "p4", target: "r4>3" }, classes: "has" },
    { data: { source: "r4>3", target: "p3" }, classes: "negating" },
    { data: { source: "p2", target: "r2>4>3" }, classes: "has" },
    { data: { source: "r2>4>3", target: "p3" }, classes: "negating" },
    { data: { source: "p5", target: "r5>r2>0" }, classes: "has" },
    { data: { source: "r5>r2>0", target: "r2>1>0" }, classes: "negating" },
  ],
};
