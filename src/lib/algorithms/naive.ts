import { NodeSingular } from "cytoscape";
import { Algorithm } from "./Algorithm";
/**
 * @description This is a naive algorithm that runs all attacks in parallel from the first iteration
 * - The initial consilience of a point or negation is its conviction
 * - On each round, every point simultaneously attacks every neighbor with its consilience
 *  - The attack power is modulated by the consilience of the negation
 *  - The attack can be positive or negative, depending on the sign of the consilience
 *  - The consilience of a point or negation is updated by the sum of all attacks
 */
export const naive: Algorithm = {
  name: "Naive",
  assignConsilience: (cytoscape, iterations) => {
    const points = cytoscape.nodes(".point");
    const relevanceNodes = cytoscape.nodes(".relevance");

    points.forEach((point) => {
      point.data("consilience", point.data("conviction"));
    });
    relevanceNodes.forEach((relevanceNode) => {
      relevanceNode.data("relevance", relevanceNode.data("conviction"));
    });

    for (let i = 0; i < iterations; i++) {
      points.forEach((point) => {
        point.scratch("roundConsilience", point.data("consilience"));
      });
      relevanceNodes.forEach((relevanceNode) => {
        relevanceNode.scratch(
          "roundRelevance",
          relevanceNode.data("relevance")
        );
      });

      relevanceNodes.forEach((relevanceNode) => {
        const [A, B]: NodeSingular[2] = relevanceNode.outgoers("node");
        const relevance = relevanceNode.scratch("roundRelevance");

        attack(A, B, relevance);
        attack(B, A, relevance);
      });
    }

    cytoscape.style().update();
  },
};

const attack = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  if (!source.hasClass("point")) return;

  target.hasClass("point")
    ? attackConsilience(source, target, relevance)
    : attackRelevance(source, target, relevance);
};

const attackRelevance = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  const attackSign = source.scratch("roundConsilience") > 0 ? 1 : -1;
  const attackPower = Math.min(
    Math.abs(source.scratch("roundConsilience")),
    relevance
  );

  target.data(
    "relevance",
    // Relevance can't go negative
    Math.max(target.data("relevance") - attackPower * attackSign, 0)
  );
};

const attackConsilience = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  const attackSign = source.scratch("roundConsilience") > 0 ? 1 : -1;
  const attackPower = Math.min(
    Math.abs(source.scratch("roundConsilience")),
    relevance
  );

  target.data(
    "consilience",
    target.data("consilience") - attackPower * attackSign
  );
};
