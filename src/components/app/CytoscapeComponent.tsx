import { cyInstanceAtom } from "@/hooks/useCyInstance";
import cytoscape, {
  EdgeSingular,
  LayoutOptions,
  NodeSingular,
  Singular,
} from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import dagre from "cytoscape-dagre";
import edgehandles from "cytoscape-edgehandles";
import { useSetAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import { Root } from "react-dom/client";
import { ulid } from "ulid";
import { useTriggerNegationModal } from "../ui/AddNegationModal.state";

cytoscape.use(edgehandles);
cytoscape.use(dagre);
cytoscape.use(cxtmenu);

interface CytoscapeComponentProps {
  elements?: cytoscape.ElementsDefinition;
  style?: cytoscape.Stylesheet[];
}

export const CytoscapeComponent: React.FC<CytoscapeComponentProps> = ({
  style,
  ...cyProps
}) => {
  const setCy = useSetAtom(cyInstanceAtom);
  const cyContainer = useRef<HTMLDivElement>(null);
  const triggerNegationModal = useTriggerNegationModal();

  useEffect(() => {
    if (cyContainer.current) {
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
        ...cyProps,
      });

      setCy?.(instance);

      instance.on("select", (e) => {
        console.log(e.target.classes(), e.target.data());
      });

      updateLayout(instance, { fit: true, padding: 100 });

      const menu = instance.cxtmenu({
        menuRadius: () => 120, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
        selector: "node",

        commands: [
          {
            fillColor: "red", // optional: custom background color for item
            content: "Negate", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              triggerNegationModal((negation) => {
                negate(instance, element, negation);
              });
            },
          },
          {
            fillColor: "#9f9", // optional: custom background color for item
            content: "+ 1", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data("conviction", (element.data("conviction") ?? 0) + 1);
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
            },
          },
          {
            fillColor: "#6f6", // optional: custom background color for item
            content: "+ 5", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data("conviction", (element.data("conviction") ?? 0) + 5);
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
            },
          },
          {
            fillColor: "#3f3", // optional: custom background color for item
            content: "+ 10", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data(
                "conviction",
                (element.data("conviction") ?? 0) + 10
              );
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
            },
          },
          {
            fillColor: "orange", // optional: custom background color for item

            content: "Reset", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data("conviction", 0);
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
            },
          },
          {
            fillColor: "#f33", // optional: custom background color for item
            content: "- 10", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data(
                "conviction",
                (element.data("conviction") ?? 0) - 10
              );
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
            },
          },
          {
            fillColor: "#f66", // optional: custom background color for item
            content: "- 5", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data("conviction", (element.data("conviction") ?? 0) - 5);
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
            },
          },
          {
            fillColor: "#f99", // optional: custom background color for item
            content: "- 1", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: (element) => {
              element.data("conviction", (element.data("conviction") ?? 0) - 1);
              instance.style().update();
              console.log(element.data("conviction")); // `ele` holds the reference to the active element
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

      const reactRoots = [] as Root[];

      const edgeHandles = instance.edgehandles({
        snapThreshold: 0,
        canConnect: (sourceNode, targetNode) => {
          if (sourceNode === targetNode) return false;
          if (instance.$(`edge.has[source = "${sourceNode.id()}"]`).length > 0)
            if (sourceNode.hasClass("relevance")) return false;
          if (sourceNode.data("pointId") === targetNode.data("pointId"))
            return false;
          if (sourceNode.edgesTo(targetNode).length > 0) return false;
          if (
            targetNode.hasClass("relevance") &&
            targetNode.edgesTo(sourceNode).length > 0
          )
            return false;

          return true;
        },
      });

      instance.on("ehstart", (_, sourceNode: NodeSingular) => {
        if (sourceNode.hasClass("relevance")) {
          edgeHandles.stop();
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
          addedEdge.remove();
          const relevanceId = ulid();
          const pointId = ulid();

          e.cy.add({
            nodes: [
              {
                data: { id: relevanceId, conviction: 1 },
                classes: "relevance",
              },
              {
                data: {
                  conviction: 1,
                  pointId: sourceNode.data("pointId"),
                  text: sourceNode.data("text"),
                  id: pointId,
                },
                classes: "point",
              },
            ],
            edges: [
              {
                data: {
                  source: pointId,
                  target: relevanceId,
                },
                classes: "has",
              },
              {
                data: {
                  source: relevanceId,
                  target: targetNode.id(),
                },
                classes: "negating",
              },
            ],
          });

          updateLayout(instance, { animate: true });
        }
      );

      edgeHandles.enableDrawMode();

      console.log(instance.json());

      return () => {
        menu.destroy();
        instance.destroy();
        reactRoots.forEach((root) => {
          setTimeout(() => root.unmount());
        });
      };
    }
  }, [cyContainer, cyProps, setCy]);

  return <div ref={cyContainer} style={{ width: "100%", height: "100%" }} />;
};

const negate = (cy: cytoscape.Core, target: Singular, negation: string) => {
  const relevanceId = ulid();
  const negationId = ulid();
  cy.add({
    nodes: [
      {
        data: { id: relevanceId, conviction: 1 },
        classes: "relevance",
      },
      {
        data: {
          conviction: 1,
          pointId: ulid(),
          text: negation,
          id: negationId,
        },
        classes: "point",
      },
    ],
    edges: [
      {
        data: {
          source: negationId,
          target: relevanceId,
        },
        classes: "has",
      },
      {
        data: {
          source: relevanceId,
          target: target.id(),
        },
        classes: "negating",
      },
    ],
  });

  updateLayout(cy, { animate: true });
};

const updateLayout = (cy: cytoscape.Core, options?: Partial<LayoutOptions>) => {
  cy.layout({
    name: "dagre",
    // @ts-expect-error Type
    fit: false,
    rankDir: "RL",
    nodeDimensionsIncludeLabels: true,
    ...options,
  }).run();
};
