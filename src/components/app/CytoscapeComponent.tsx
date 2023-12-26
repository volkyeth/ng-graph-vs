import { cyInstanceAtom } from '@/hooks/useCyInstance'
import cytoscape from 'cytoscape'
import { useSetAtom } from 'jotai'
import React, { useEffect, useRef } from 'react'

import edgeConnections from 'cytoscape-edge-connections'

cytoscape.use(edgeConnections)

interface CytoscapeComponentProps {
  elements?: cytoscape.ElementsDefinition
  style?: cytoscape.Stylesheet[]
}

export const CytoscapeComponent: React.FC<CytoscapeComponentProps> = ({ ...cyProps }) => {
  const setCy = useSetAtom(cyInstanceAtom)
  const cyContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cyContainer.current) {
      /**
       * To use edge connections, we need to remove "negation" edges from the
       * elements array, then add them back in programatically using the api defined
       * in the 'cytoscape-edge-connections' library
       * */

      const instance = cytoscape({
        container: cyContainer.current,
        layout: { name: 'random' },
        ...cyProps,
      })

      setCy?.(instance)
      instance.zoom(1)
      instance.center(instance.elements())

      return () => {
        instance.destroy()
      }
    }
  }, [cyContainer, cyProps, setCy])

  return <div ref={cyContainer} style={{ width: '100%', height: '100%' }} />
}
