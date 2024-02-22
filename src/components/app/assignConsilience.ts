import { Core, EdgeSingular, NodeSingular } from "cytoscape";

export const assignConsilience = (cytoscape: Core, iterations: number) => {
  const points = cytoscape.nodes(".point");
  const negations = cytoscape.edges(".negation");

  points.forEach((point) => {
    point.data("consilience", point.data("conviction"));
  });
  negations.forEach((negation) => {
    negation.data("consilience", negation.data("conviction"));
  });

  for (let i = 0; i < iterations; i++) {
    points.forEach((point) => {
      point.scratch("previousConsilience", point.data("consilience"));
    });
    negations.forEach((negation) => {
      negation.scratch("previousConsilience", negation.data("consilience"));
    });
    negations.forEach((negation) => {
      const source = negation.source().hasClass("point")
        ? negation.source()
        : getNegationEdge(negation.source());
      const target = negation.target().hasClass("point")
        ? negation.target()
        : getNegationEdge(negation.target());
      const relevance = negation.scratch("previousConsilience");
      attack(source, target, relevance);
      attack(target, source, relevance);
    });
  }

  cytoscape.style().update();
};

const attack = (
  source: NodeSingular | EdgeSingular,
  target: NodeSingular | EdgeSingular,
  relevance: number
) => {
  const attackPower = Math.min(
    source.scratch("previousConsilience"),
    relevance
  );
  target.data("consilience", target.data("consilience") - attackPower);
};

const getNegationEdge = (auxNode: NodeSingular) =>
  auxNode.cy().getElementById(auxNode.data("edgeId")) as EdgeSingular;
