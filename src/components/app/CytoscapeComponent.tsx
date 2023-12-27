import { cyInstanceAtom } from "@/hooks/useCyInstance";
import { Instance, arrow } from "@popperjs/core";
import cytoscape, { EdgeSingular, NodeSingular } from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import popper from "cytoscape-popper";
import { useSetAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import { Root, createRoot } from "react-dom/client";
import { ulid } from "ulid";
import { Point } from "../ui/Point";

cytoscape.use(popper);
cytoscape.use(edgehandles);

interface CytoscapeComponentProps {
  elements?: cytoscape.ElementsDefinition;
  style?: cytoscape.Stylesheet[];
}

export const CytoscapeComponent: React.FC<CytoscapeComponentProps> = ({
  ...cyProps
}) => {
  const setCy = useSetAtom(cyInstanceAtom);
  const cyContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cyContainer.current) {
      /**
       * To use edge connections, we need to remove "negation" edges from the
       * elements array, then add them back in programatically using the api defined
       * in the 'cytoscape-edge-connections' library
       * */

      const instance = cytoscape({
        container: cyContainer.current,
        layout: { name: "cose" },
        autoungrabify: true,
        ...cyProps,
      });

      setCy?.(instance);
      instance.zoom(1);
      instance.center(instance.elements());

      const points = instance.nodes().filter((e) => e.hasClass("point"));
      const reactRoots = [] as Root[];
      const popperDivs = [] as HTMLDivElement[];
      const popperInstances = [] as Instance[];

      for (const point of points) {
        const popper = point.popper({
          content: () => {
            const content = document.createElement("div");

            content.innerHTML = point.data("text");
            document.body.appendChild(content);
            const reactRoot = createRoot(content);

            reactRoot.render(<Point text={point.data("text")} />);
            reactRoots.push(reactRoot);
            popperDivs.push(content);

            return content;
          },
          popper: {
            strategy: "fixed",
            modifiers: [arrow],
            placement: "top",
          },
        });
        popperInstances.push(popper);

        point.on("position", popper.update);
        instance.on("pan zoom resize", popper.update);
      }

      const edgeHandles = instance.edgehandles({
        canConnect: (sourceNode, targetNode) => {
          if (sourceNode === targetNode) return false;
          if (sourceNode.edgesTo(targetNode).length > 0) return false;
          if (
            targetNode.hasClass("relevance") &&
            targetNode.edgesTo(sourceNode).length > 0
          )
            return false;

          return true;
        },
        disableBrowserGestures: true,
      });

      instance.on("add", "node.point", (e) => {
        const point = e.target;
        const popper = point.popper({
          content: () => {
            const content = document.createElement("div");

            content.innerHTML = point.data("text");
            document.body.appendChild(content);
            const reactRoot = createRoot(content);

            reactRoot.render(<Point text={point.data("text")} />);
            reactRoots.push(reactRoot);
            popperDivs.push(content);

            return content;
          },
          popper: {
            strategy: "fixed",
            modifiers: [arrow],
            placement: "top",
          },
        });
        popperInstances.push(popper);

        point.on("position", popper.update);
        instance.on("pan zoom resize", popper.update);
      });

      instance.on(
        "ehcomplete",
        (
          _,
          sourceNode: NodeSingular,
          targetNode: NodeSingular,
          addedEdge: EdgeSingular
        ) => {
          addedEdge.remove();
          const relevanceId = ulid();
          instance.add({
            nodes: [{ data: { id: relevanceId }, classes: "relevance" }],
            edges: [
              {
                data: {
                  id: ulid(),
                  source: sourceNode.id(),
                  target: relevanceId,
                  classes: "has",
                },
              },
              {
                data: {
                  id: ulid(),
                  source: relevanceId,
                  target: targetNode.id(),
                  classes: "negating",
                },
              },
            ],
          });
        }
      );

      edgeHandles.enableDrawMode();

      return () => {
        instance.destroy();
        reactRoots.forEach((root) => {
          root.unmount();
        });
        popperDivs.forEach((div) => {
          document.body.removeChild(div);
        });
        popperInstances.forEach((popper) => {
          popper.destroy();
        });
      };
    }
  }, [cyContainer, cyProps, setCy]);

  return <div ref={cyContainer} style={{ width: "100%", height: "100%" }} />;
};
