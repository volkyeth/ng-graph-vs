import { graphStateAtom } from "@/graph/state";
import { cyInstanceAtom } from "@/hooks/useCyInstance";
import { cn } from "@/lib/utils";
import cytoscape, { EdgeSingular, NodeSingular, Singular } from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import edgeConnections from "cytoscape-edge-connections";
import edgehandles, { EdgeHandlesInstance } from "cytoscape-edgehandles";
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
  const [edgeHandles, setEdgeHandles] = useState<EdgeHandlesInstance>();
  const cyContainer = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useAtom(graphStateAtom);
  const [drawMode, setDrawMode] = useState(true);
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
    };

    document.addEventListener("keydown", handleAdjustIterationKeybind);

    return () => {
      document.removeEventListener("keydown", handleAdjustIterationKeybind);
    };
  }, []);

  useEffect(() => {
    if (!edgeHandles) return;

    drawMode ? edgeHandles.enableDrawMode() : edgeHandles.disableDrawMode();

    const handleToggleDrawModeKeybind = (e: KeyboardEvent) => {
      if (e.key === "d") setDrawMode((isEnabled) => !isEnabled);
    };

    document.addEventListener("keydown", handleToggleDrawModeKeybind);

    return () => {
      document.removeEventListener("keydown", handleToggleDrawModeKeybind);
    };
  }, [edgeHandles, drawMode]);

  useEffect(() => {
    if (!cyContainer.current) return;
    /**
     * To use edge connections, we need to remove "negation" edges from the
     * elements array, then add them back in programatically using the api defined
     * in the 'cytoscape-edge-connections' library
     * */

    const instance = cytoscape({
      container: cyContainer.current,
      // autoungrabify: true,
      // maxZoom: 2,
      // minZoom: 0.5,

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

    instance.on("select", (e) => {
      console.log(e.target.classes(), e.target.data());
    });

    instance.on("add remove position data", () => {
      setElements(instance.elements(".point,.negation").jsons());
    });

    instance.on("tap", (e) => {
      instance.add([
        {
          data: {
            conviction: 1,
            consilience: 1,
          },
          position: e.position,
          classes: "point",
        },
      ]);
    });

    // updateLayout(instance, { fit: true, padding: 100 });

    const edgeHandlesInstance = instance.edgehandles({
      canConnect: (sourceNode, targetNode) => {
        if (sourceNode === targetNode) return false;

        // if edge already exists
        if (sourceNode.edgesTo(targetNode).length > 0) return false;
        if (targetNode.edgesTo(sourceNode).length > 0) return false;

        const sourceType = sourceNode.hasClass("aux-node") ? "aux" : "point";
        if (sourceType === "aux") return false;

        const targetType = targetNode.hasClass("aux-node") ? "aux" : "point";
        if (targetType === "point") return true;

        const targetEdge = instance.$(
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

    setEdgeHandles(edgeHandlesInstance);

    // edgeHandlesInstance.enableDrawMode();

    instance.on("ehstart", (_, sourceNode: NodeSingular) => {
      if (sourceNode.hasClass("aux-node")) {
        edgeHandlesInstance.stop();
      }
    });

    instance.on(
      "ehcomplete",
      (
        e,
        sourceNode: NodeSingular,
        targetNode: NodeSingular,
        addedEdge: EdgeSingular
      ) => {
        console.log("ehcomplete", e, sourceNode, targetNode, addedEdge);

        edgeConnections.addEdge({
          data: {
            source: sourceNode.id(),
            target: targetNode.id(),
            conviction: 1,
            consilience: 1,
          },
          classes: "negation",
        });
        addedEdge.remove();
        // updateLayout(instance, { animate: true });
      }
    );

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
      menuRadius: () => 120, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
      selector: ".point",
      commands: [
        {
          fillColor: "#9f9", // optional: custom background color for item
          content: "+ 1", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, (previous) => previous + 1);
          },
        },
        {
          fillColor: "#6f6", // optional: custom background color for item
          content: "+ 5", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, (previous) => previous + 5);
          },
        },
        {
          fillColor: "#3f3", // optional: custom background color for item
          content: "+ 10", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, (previous) => previous + 10);
          },
        },
        {
          fillColor: "orange", // optional: custom background color for item

          content: "Reset", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, 0);
          },
        },
        {
          fillColor: "red", // optional: custom background color for item

          content: "Remove", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            e.closedNeighborhood().edges().remove();
            e.remove();
          },
        },
        {
          fillColor: "#f33", // optional: custom background color for item
          content: "- 10", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, (previous) => previous - 10);
          },
        },
        {
          fillColor: "#f66", // optional: custom background color for item
          content: "- 5", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, (previous) => previous - 5);
          },
        },
        {
          fillColor: "#f99", // optional: custom background color for item
          content: "- 1", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(e, (previous) => previous - 1);
          },
        },
      ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
      fillColor: "rgba(0, 0, 0, 0.75)", // the background colour of the menu
      activeFillColor: "rgba(1, 105, 217, 0.75)", // the colour used to indicate the selected command
      activePadding: 0, // additional size in pixels for the active command
      indicatorSize: 14, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
      separatorWidth: 3, // the empty spacing in pixels between successive commands
      spotlightPadding: 20, // extra spacing in pixels between the element and the spotlight
      adaptativeNodeSpotlightRadius: false, // specify whether the spotlight radius should adapt to the node size
      minSpotlightRadius: 20, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
      maxSpotlightRadius: 300, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
      openMenuEvents: "cxttapstart taphold", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
      itemColor: "white", // the colour of text in the command's content
      itemTextShadowColor: "transparent", // the text shadow colour of the command's content
      zIndex: 9999, // the z-index of the ui div
      atMouse: false, // draw menu at mouse position
      outsideMenuCancel: false, // if set to a number, this will cancel the command if the pointer
    });

    const targetEdge = (e: NodeSingular) =>
      instance.getElementById(e.data("edgeId"));

    const edgeMenu = instance.cxtmenu({
      menuRadius: () => 120, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
      selector: ".aux-node",
      commands: [
        {
          fillColor: "#9f9", // optional: custom background color for item
          content: "+ 1", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous + 1
            );
          },
        },
        {
          fillColor: "#6f6", // optional: custom background color for item
          content: "+ 5", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous + 5
            );
          },
        },
        {
          fillColor: "#3f3", // optional: custom background color for item
          content: "+ 10", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous + 10
            );
          },
        },
        {
          fillColor: "orange", // optional: custom background color for item

          content: "Reset", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(targetEdge(e as unknown as NodeSingular), 0);
          },
        },
        {
          fillColor: "red", // optional: custom background color for item

          content: "Remove", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            e.closedNeighborhood().edges().remove();
            targetEdge(e as unknown as NodeSingular).remove();
          },
        },
        {
          fillColor: "#f33", // optional: custom background color for item
          content: "- 10", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous - 10
            );
          },
        },
        {
          fillColor: "#f66", // optional: custom background color for item
          content: "- 5", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous - 5
            );
          },
        },
        {
          fillColor: "#f99", // optional: custom background color for item
          content: "- 1", // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: (e) => {
            setConviction(
              targetEdge(e as unknown as NodeSingular),
              (previous) => previous - 1
            );
          },
        },
      ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
      fillColor: "rgba(0, 0, 0, 0.75)", // the background colour of the menu
      activeFillColor: "rgba(1, 105, 217, 0.75)", // the colour used to indicate the selected command
      activePadding: 0, // additional size in pixels for the active command
      indicatorSize: 14, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
      separatorWidth: 3, // the empty spacing in pixels between successive commands
      spotlightPadding: 20, // extra spacing in pixels between the element and the spotlight
      adaptativeNodeSpotlightRadius: false, // specify whether the spotlight radius should adapt to the node size
      minSpotlightRadius: 20, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
      maxSpotlightRadius: 300, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
      openMenuEvents: "cxttapstart taphold", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
      itemColor: "white", // the colour of text in the command's content
      itemTextShadowColor: "transparent", // the text shadow colour of the command's content
      zIndex: 9999, // the z-index of the ui div
      atMouse: false, // draw menu at mouse position
      outsideMenuCancel: false, // if set to a number, this will cancel the command if the pointer
    });

    return () => {
      pointMenu.destroy();
      edgeMenu.destroy();
      instance.destroy();
    };
  }, [cyContainer, setCy]);

  return (
    <div
      className={cn(
        "w-full h-full relative border-2 border-transparent",
        drawMode && "border-purple-500"
      )}
    >
      <div ref={cyContainer} className="w-full h-full" />
      <div className="flex absolute gap-2 top-2 right-2">
        <p className="border p-2">Iterations: {algoIterations}</p>
        <button
          className={cn("border p-2", !drawMode && "bg-purple-300")}
          onClick={() => setDrawMode((isEnabled) => !isEnabled)}
        >
          {drawMode ? "Disable drawing" : "Enable drawing"} (D)
        </button>
      </div>
    </div>
  );
};
