import cytoscape from 'cytoscape'
import { useEffect } from "react"
import { graph } from './graph'

export const useGraphListeners = (callback: cytoscape.EventHandler) => {
  useEffect(() => {
    graph.on('data add remove', callback)

    return () => {
      graph.off('data add remove', callback)
    }
  }, [callback])
}
