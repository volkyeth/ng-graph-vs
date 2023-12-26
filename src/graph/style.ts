export const style: cytoscape.Stylesheet[] =
  [{
    selector: 'node',
    style: {
      'background-color': 'blue',
      width: '20px',
      height: '20px'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      "arrow-scale": 1,
      'curve-style': 'bezier'
    }
  }]
