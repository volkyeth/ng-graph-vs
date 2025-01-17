import { graphIdAtom, graphStateAtom, helpDialogOpenAtom } from "@/graph/state";
import { cyInstanceAtom } from "@/hooks/useCyInstance";
import { AlgorithmName, algorithmNames, algorithms } from "@/lib/algorithms";
import { cn } from "@/lib/utils";
import cytoscape, {
  EdgeSingular,
  EventObjectNode,
  NodeSingular,
  Singular,
} from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import edgehandles from "cytoscape-edgehandles";
import { useAtom, useSetAtom } from "jotai";
import { ArrowLeft, HelpCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/button";
import { HelpDialog } from "./HelpDialog";

cytoscape.use(edgehandles);
cytoscape.use(cxtmenu);

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
  const [algo, setAlgo] = useState<AlgorithmName>("lifoRelevance");
  const [editingPoint, setEditingPoint] = useState<NodeSingular | null>(null);
  const [pointText, setPointText] = useState("");
  const [pointConviction, setPointConviction] = useState(0);
  const setGraphId = useSetAtom(graphIdAtom);
  const setHelpDialogOpen = useSetAtom(helpDialogOpenAtom);

  useEffect(() => {
    if (!editingPoint) return;

    setPointText(editingPoint.data("text") ?? "");
    setPointConviction(editingPoint.data("conviction") ?? 0);
  }, [editingPoint]);

  useEffect(() => {
    if (!cy) return;

    const updateCredence = () =>
      algorithms[algo].assignCredence(cy, algoIterations);

    updateCredence();
  }, [cy, algoIterations, algo]);

  useEffect(() => {
    const handleAdjustIterationKeybind = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setAlgoIterations((prev) => prev + 1);
      if (e.key === "ArrowLeft")
        setAlgoIterations((prev) => Math.max(prev - 1, 0));
      if (e.key === "ArrowDown") setAlgoIterations(0); // Reset iterations to 0
      if (e.key === "ArrowUp") {
        // Ensure `cy` and `assignCredence` are accessible here
        if (cy) algorithms[algo].assignCredence(cy, algoIterations);
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

        const sourceType = sourceNode.hasClass("relevance")
          ? "relevance"
          : "point";
        if (sourceType === "relevance") return false;

        const targetType = targetNode.hasClass("relevance")
          ? "relevance"
          : "point";
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
    cy.on("cxttapend", ".point,.relevance", () => {
      eh.stop();
    });

    cy.on("ehstart", (_, sourceNode: NodeSingular) => {
      if (sourceNode.hasClass("relevance")) {
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
        const sourcePosition = sourceNode.position();
        const targetPosition = targetNode.position();

        const relevanceNode = cy.add({
          group: "nodes",
          classes: "relevance",
          data: {
            relevance: 1,
            conviction: 1,
            timestamp: Date.now(),
          },
          locked: true,
          position: {
            x: (sourcePosition.x + targetPosition.x) / 2,
            y: (sourcePosition.y + targetPosition.y) / 2,
          },
        });

        cy.add([
          {
            group: "edges",
            classes: "negation",
            data: {
              source: relevanceNode.id(),
              target: sourceNode.id(),
            },
          },
          {
            group: "edges",
            classes: "negation",
            data: {
              source: relevanceNode.id(),
              target: targetNode.id(),
            },
          },
        ]);

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
          credence: 1,
        },
        position: event.position,
        classes: "point", // Assuming "point" class is for standard nodes
      });
    });

    cy.on("cxttap", ".point", (event: EventObjectNode) => {
      setEditingPoint(event.target as NodeSingular);
      return;
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
      elements,
      layout: { name: "preset", fit: true, padding: 200 },
      ...cyProps,
    });

    setCy?.(instance);

    instance.on("position", "node.point", (e: EventObjectNode) => {
      e.target
        .neighborhood(".relevance")
        .forEach((relevanceNode) =>
          centerRelevanceBetweenEndpoints(relevanceNode, [])
        );
    });

    instance.on("add remove position data", () => {
      setElements(instance.elements().jsons());
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

    const convictionMenu = instance.cxtmenu({
      menuRadius: () => 120,
      selector: ".point,.relevance",
      outsideMenuCancel: 1,
      commands: (element) => [
        ...(element.hasClass("point")
          ? [
              {
                fillColor: "#a2f",
                content: "Edit",
                select: (point: Singular) => {
                  setEditingPoint(point as unknown as NodeSingular);
                },
              },
            ]
          : []),
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

    return () => {
      convictionMenu.destroy();
      instance.destroy();
    };
  }, [cyContainer, setCy]);

  return (
    <div className={cn("w-full h-full relative border-2 border-transparent")}>
      <div ref={cyContainer} className="w-full h-full" />
      <Button
        variant={"outline"}
        className="absolute top-2 left-2 rounded-none gap-2 p-2"
        onClick={() => {
          setGraphId("");
        }}
      >
        <ArrowLeft /> Back
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        className="absolute bottom-2 right-2 rounded-none gap-2 p-2"
        onClick={() => {
          setHelpDialogOpen(true);
        }}
      >
        <HelpCircle />
      </Button>
      <div className="flex absolute gap-2 top-2 right-2">
        <select
          value={algo}
          className="border p-2"
          onChange={(e) => setAlgo(e.target.value as AlgorithmName)}
        >
          {algorithmNames.map((name) => (
            <option key={name} value={name}>
              {algorithms[name].name}
            </option>
          ))}
        </select>
        <p className="border p-2">Iterations: {algoIterations}</p>
      </div>
      <HelpDialog />
      <Dialog
        open={editingPoint !== null}
        onOpenChange={() => setEditingPoint(null)}
      >
        <DialogOverlay />
        <DialogContent className="flex flex-col gap-10 sm:max-w-[425px] bg-white">
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="negation" className="text-right">
              Point {pointText.length}/320
            </Label>
            <Textarea
              autoFocus
              id="point-text"
              value={pointText}
              onChange={(e) => setPointText(e.target.value)}
              maxLength={320}
              onKeyDown={(e) => {
                if (!(e.metaKey || e.ctrlKey)) return;

                if (e.key === "Enter") {
                  e.preventDefault();

                  if (!editingPoint) return;

                  editingPoint.data("text", pointText);
                  editingPoint.data("conviction", pointConviction);
                  setEditingPoint(null);
                }
              }}
            />
            <Label htmlFor="conviction" className="text-right">
              Conviction
            </Label>
            <Input
              id="conviction"
              type="number"
              value={pointConviction}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  if (!editingPoint) return;

                  editingPoint.data("text", pointText);
                  editingPoint.data("conviction", pointConviction);
                  setEditingPoint(null);
                }
              }}
              onChange={(e) => setPointConviction(Number(e.target.value))}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setEditingPoint(null);
                }}
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => {
                if (!editingPoint) return;

                editingPoint.data("text", pointText);
                editingPoint.data("conviction", pointConviction);
                setEditingPoint(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const centerRelevanceBetweenEndpoints = (
  relevanceNode: NodeSingular,
  alreadyCentered: string[]
) => {
  if (alreadyCentered.includes(relevanceNode.id())) return;

  const negations = relevanceNode.edgesTo(
    relevanceNode.neighborhood(".point,.relevance")
  );

  const negatedAPosition = negations[0].target().position();
  const negatedBPosition = negations[1].target().position();

  relevanceNode.unlock();
  relevanceNode.position({
    x: (negatedAPosition.x + negatedBPosition.x) / 2,
    y: (negatedAPosition.y + negatedBPosition.y) / 2,
  });
  relevanceNode.lock();

  relevanceNode
    .neighborhood(".relevance")
    .forEach((neighborRelevance) =>
      centerRelevanceBetweenEndpoints(neighborRelevance, [
        ...alreadyCentered,
        relevanceNode.id(),
      ])
    );
};
