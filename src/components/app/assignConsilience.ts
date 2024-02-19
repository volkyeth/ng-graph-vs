import { Core, NodeSingular } from "cytoscape";

export const assignConsilience = (cytoscape: Core, iterations: number) => {
  const points = cytoscape.nodes(".point");
  const negations = cytoscape.edges(".negation");
  const auxNodes = cytoscape.nodes(".aux-node");

  points.forEach((point) => {
    point.data("consilience", point.data("conviction"));
  });
  negations.forEach((negation) => {
    negation.data("consilience", negation.data("conviction"));
  });

  for (let i = 0; i < iterations; i++) {
    auxNodes.forEach((auxNode) => {
      auxNode.scratch(
        "previousConsilience",
        cytoscape.getElementById(auxNode.data("edgeId")).data("consilience")
      );
    });
    points.forEach((point) => {
      point.scratch("previousConsilience", point.data("consilience"));
    });
    negations.forEach((negation) => {
      negation.scratch("previousConsilience", negation.data("consilience"));
    });
    negations.forEach((negation) => {
      const relevance = negation.scratch("previousConsilience");
      attack(negation.source(), negation.target(), relevance);
      attack(negation.target(), negation.source(), relevance);
    });
  }

  cytoscape.style().update();
};

const attack = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  const attackPower = Math.min(
    source.scratch("previousConsilience"),
    relevance
  );
  target.data("consilience", target.data("consilience") - attackPower);
};
