import { graphStateAtom } from "@/graph/state";
import { cyInstanceAtom } from "@/hooks/useCyInstance";
import { cn } from "@/lib/utils";
import cytoscape, { EdgeSingular, NodeSingular, Singular } from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import edgeConnections from "cytoscape-edge-connections";
import edgehandles from "cytoscape-edgehandles";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { assignConsilience } from "./assignConsilience";

cytoscape.use(edgehandles);
cytoscape.use(cxtmenu);
cytoscape.use(edgeConnections);

interface CytoscapeComponentProps {
  elements?: cytoscape.ElementsDefinition;
  style?: cytoscape.Stylesheet[];
}

export const CytoscapeComponent: React.FC<CytoscapeComponentProps> = ({
  style,
  ...cyProps
}) => {
  const [cy, setCy] = useAtom(cyInstanceAtom);
  const cyContainer = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useAtom(graphStateAtom);
  const [algoIterations, setAlgoIterations] = useState(0);

  useEffect(() => {
    if (!cy) return;

    assignConsilience(cy, algoIterations);
  }, [cy, algoIterations]);

  useEffect(() => {
    const handleAdjustIterationKeybind = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setAlgoIterations((prev) => prev + 1);
      if (e.key === "ArrowLeft")
        setAlgoIterations((prev) => Math.max(prev - 1, 0));
      if (e.key === "ArrowDown") setAlgoIterations(0); // Reset iterations to 0
      if (e.key === "ArrowUp") {
        // Ensure `cy` and `assignConsilience` are accessible here
        if (cy) assignConsilience(cy, algoIterations);
      }
    };

    document.addEventListener("keydown", handleAdjustIterationKeybind);

    return () => {
      document.removeEventListener("keydown", handleAdjustIterationKeybind);
    };
  }, [cy, algoIterations]);

  useEffect(() => {
    if (!cy) return;

    const eh = cy.edgehandles({
      canConnect: (sourceNode, targetNode) => {
        if (sourceNode === targetNode) return false;

        // if edge already exists
        if (sourceNode.edgesTo(targetNode).length > 0) return false;
        if (targetNode.edgesTo(sourceNode).length > 0) return false;

        const sourceType = sourceNode.hasClass("aux-node") ? "aux" : "point";
        if (sourceType === "aux") return false;

        const targetType = targetNode.hasClass("aux-node") ? "aux" : "point";
        if (targetType === "point") return true;

        const targetEdge = cy.$(
          `#${targetNode.data("edgeId")}`
        ) as EdgeSingular;
        if (
          targetEdge.source() === sourceNode ||
          targetEdge.target() === sourceNode
        )
          return false;

        return true;
      },
      snap: true,
      snapThreshold: 100,
    });

    // Listen for the `cxttapstart` event to initiate edge creation
    cy.on("cxttapstart", ".point", (event) => {
      const node = event.target;
      eh.start(node); // Start edge drawing from the node
    });

    // Listen for the `ehstop` event to finalize edge creation
    cy.on("cxttapend", ".point,.aux-node", () => {
      eh.stop();
    });

    cy.on("ehstart", (_, sourceNode: NodeSingular) => {
      if (sourceNode.hasClass("aux-node")) {
        eh.stop();
      }
    });

    cy.on(
      "ehcomplete",
      (
        _,
        sourceNode: NodeSingular,
        targetNode: NodeSingular,
        addedEdge: EdgeSingular
      ) => {
        // @ts-expect-error Property does not exist
        cy.edgeConnections().addEdge({
          data: {
            source: sourceNode.id(),
            target: targetNode.id(),
            conviction: 1,
            consilience: 1,
          },
          classes: "negation",
        });
        addedEdge.remove();
      }
    );

    return () => {
      eh.destroy();
      cy.off("cxttapstart");
      cy.off("cxttapend");
      cy.off("ehstart");
      cy.off("ehcomplete");
    };
  }, [cy]);

  useEffect(() => {
    if (!cy) return;

    // Listen for double tap events on the background to create a point
    cy.on("dbltap", (event) => {
      if (event.target !== cy) return;

      cy.add({
        group: "nodes",
        data: {
          conviction: 1,
          consilience: 1,
        },
        position: event.position,
        classes: "point", // Assuming "point" class is for standard nodes
      });
    });

    cy.on("tap", (event) => {
      if (event.target !== cy) return;

      cy.elements().unselect();
    });

    return () => {
      // Clean up listeners
      cy.off("dbltap");
      cy.off("tap");
    };
  }, [cy]);

  useEffect(() => {
    if (!cyContainer.current) return;

    const instance = cytoscape({
      container: cyContainer.current,
      style,
      elements: elements.filter((e) => e.classes === "point"),
      layout: { name: "preset", fit: true, padding: 200 },
      ...cyProps,
    });

    // @ts-expect-error Property does not exist
    const edgeConnections = instance.edgeConnections();

    elements
      .filter((e) => e.classes === "negation")
      .forEach(edgeConnections.addEdge);

    setCy?.(instance);

    instance.on("add remove position data", () => {
      setElements(instance.elements(".point,.negation").jsons());
    });

    const setConviction = (
      e: Singular,
      set: number | ((previous: number) => number)
    ) => {
      const previousConviction = e.data("conviction") ?? 0;
      e.data(
        "conviction",
        typeof set === "function" ? set(previousConviction) : set
      );
    };

    const pointMenu = instance.cxtmenu({
      menuRadius: () => 120,
      selector: ".point",
      outsideMenuCancel: 1,
      commands: [
        {
          fillColor: "#9f9",
          content: "+ 1",
          contentStyle: {},
          select: (e) => {
            setConviction(e, (previous) => previous + 1);
          },
        },
        {
          fillColor: "#6f6",
          content: "+ 5",
          contentStyle: {},
          select: (e) => {
            setConviction(e, (previous) => previous + 5);
          },
        },
        {
          fillColor: "#3f3",
          content: "+ 10",
          contentStyle: {},
          select: (e) => {
            setConviction(e, (previous) => previous + 10);
          },
        },
        {
          fillColor: "orange",
          content: "Reset",
          contentStyle: {},
          select: (e) => {
            setConviction(e, 0);
          },
        },
        {
          fillColor: "red",
          content: "Remove",
          contentStyle: {},
          select: (e) => {
            e.closedNeighborhood().edges().remove();
            e.remove();
          },
        },
        {
          fillColor: "#32f",
          content: "- 10",
          contentStyle: {},
          select: (e) => {
            setConviction(e, (previous) => previous - 10);
          },
        },
        {
          fillColor: "#66f",
          content: "- 5",
          contentStyle: {},
          select: (e) => {
            setConviction(e, (previous) => previous - 5);
          },
        },
        {
          fillColor: "#99f",
          content: "- 1",
          contentStyle: {},
          select: (e) => {
            setConviction(e, (previous) => previous - 1);
          },
        },
      ],
      fillColor: "rgba(0, 0, 0, 0.75)",
      activeFillColor: "rgba(1, 105, 217, 0.75)",
      activePadding: 0,
      indicatorSize: 14,
      separatorWidth: 3,
      spotlightPadding: 20,
      adaptativeNodeSpotlightRadius: false,
      minSpotlightRadius: 20,
      maxSpotlightRadius: 300,
      openMenuEvents: "tap", // Adjusted to open on tap
      itemColor: "white",
      itemTextShadowColor: "transparent",
      zIndex: 9999,
      atMouse: false,
    });

    const targetEdge = (e: NodeSingular) =>
      instance.getElementById(e.data("edgeId"));

    const edgeMenu = instance.cxtmenu({
      menuRadius: () => 120,
      selector: ".aux-node",
      outsideMenuCancel: 1,
      commands: [
        {
          fillColor: "#9f9",
          content: "+ 1",
          contentStyle: {},
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous + 1
            );
          },
        },
        {
          fillColor: "#6f6",
          content: "+ 5",
          contentStyle: {},
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous + 5
            );
          },
        },
        {
          fillColor: "#3f3",
          content: "+ 10",
          contentStyle: {},
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous + 10
            );
          },
        },
        {
          fillColor: "orange",
          content: "Reset",
          contentStyle: {},
          select: (e) => {
            setConviction(targetEdge(e as unknown as NodeSingular), 0);
          },
        },
        {
          fillColor: "red",
          content: "Remove",
          contentStyle: {},
          select: (e) => {
            e.closedNeighborhood().edges().remove();
            targetEdge(e as unknown as NodeSingular).remove();
          },
        },
        {
          fillColor: "#f33",
          content: "- 10",
          contentStyle: {},
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous - 10
            );
          },
        },
        {
          fillColor: "#f66",
          content: "- 5",
          contentStyle: {},
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous - 5
            );
          },
        },
        {
          fillColor: "#f99",
          content: "- 1",
          contentStyle: {},
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous - 1
            );
          },
        },
      ],
      fillColor: "rgba(0, 0, 0, 0.75)",
      activeFillColor: "rgba(1, 105, 217, 0.75)",
      activePadding: 0,
      indicatorSize: 14,
      separatorWidth: 3,
      spotlightPadding: 20,
      adaptativeNodeSpotlightRadius: false,
      minSpotlightRadius: 20,
      maxSpotlightRadius: 300,
      openMenuEvents: "tap", // Adjusted to open on tap
      itemColor: "white",
      itemTextShadowColor: "transparent",
      zIndex: 9999,
      atMouse: false,
    });

    return () => {
      pointMenu.destroy();
      edgeMenu.destroy();
      instance.destroy();
    };
  }, [cyContainer, setCy]);

  return (
    <div className={cn("w-full h-full relative border-2 border-transparent")}>
      <div ref={cyContainer} className="w-full h-full" />
      <div className="flex absolute gap-2 top-2 right-2">
        <p className="border p-2">Iterations: {algoIterations}</p>
      </div>
    </div>
  );
};
