import { NodeSingular } from "cytoscape";
import { Algorithm } from "./Algorithm";
/**
 * @description In this algo, the relevance of negations is resolved before iterating on the credence of the points. Older negations are resolved first.
 */
export const lifoRelevance: Algorithm = {
  name: "LIFO Relevance",
  assignCredence: (cytoscape, iterations) => {
    const points = cytoscape.nodes(".point");
    const relevanceNodes = cytoscape.nodes(".relevance");

    points.forEach((point) => {
      point.data("credence", point.data("conviction"));
    });
    relevanceNodes.forEach((relevanceNode) => {
      relevanceNode.data("relevance", relevanceNode.data("conviction"));
    });

    // First, resolve all negations from newest to oldest
    relevanceNodes
      .sort((a, b) => b.data("timestamp") - a.data("timestamp"))
      .forEach((relevanceNode) => {
        const [A, B]: NodeSingular[2] = relevanceNode.outgoers("node");
        const relevance = relevanceNode.data("relevance");

        setupPhaseAttack(A, B, relevance);
        setupPhaseAttack(B, A, relevance);
      });

    // Now reset the credence of the points, and start iterating
    points.forEach((point) => {
      point.data("credence", point.data("conviction"));
    });

    for (let i = 0; i < iterations; i++) {
      points.forEach((point) => {
        point.scratch("roundCredence", point.data("credence"));
      });

      relevanceNodes.forEach((relevanceNode) => {
        const [A, B]: NodeSingular[2] = relevanceNode.outgoers("node");
        const relevance = relevanceNode.data("relevance");

        iterationPhaseAttack(A, B, relevance);
        iterationPhaseAttack(B, A, relevance);
      });
    }

    cytoscape.style().update();
  },
};

const setupPhaseAttack = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  if (!source.hasClass("point")) return;

  target.hasClass("point")
    ? setupPhaseAttackCredence(source, target, relevance)
    : attackRelevance(source, target, relevance);
};

const attackRelevance = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  const attackSign = source.data("credence") > 0 ? 1 : -1;
  const attackPower = Math.min(Math.abs(source.data("credence")), relevance);

  target.data(
    "relevance",
    // Relevance can't go negative
    Math.max(target.data("relevance") - attackPower * attackSign, 0)
  );
};

const setupPhaseAttackCredence = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  const attackSign = source.data("credence") > 0 ? 1 : -1;
  const attackPower = Math.min(Math.abs(source.data("credence")), relevance);

  target.data("credence", target.data("credence") - attackPower * attackSign);
};

const iterationPhaseAttack = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  if (!source.hasClass("point") || !target.hasClass("point")) return;

  iterationPhaseAttackCredence(source, target, relevance);
};

const iterationPhaseAttackCredence = (
  source: NodeSingular,
  target: NodeSingular,
  relevance: number
) => {
  const attackSign = source.scratch("roundCredence") > 0 ? 1 : -1;
  const attackPower = Math.min(
    Math.abs(source.scratch("roundCredence")),
    relevance
  );

  target.data("credence", target.data("credence") - attackPower * attackSign);
};
