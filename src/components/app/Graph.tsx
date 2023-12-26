import { graph } from '@/graph/graph'
import { useEffect, useRef } from 'react'

export const Graph: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    container.current && graph.mount(container.current)
    graph.layout({ name: 'cose' }).run()
    graph.zoom(0.1)
  }, [])

  return <div ref={container} style={{ width: '100%', height: '100%' }} />
}
