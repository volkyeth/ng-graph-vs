
interface Node extends cytoscape.NodeDefinition {
  content: string
}

type Negation = Node
type Point = Node

// Edges must either originate or terminate from a Negation
// but there's no way to guarantee this with types, since
// the source & target are set by string identifiers