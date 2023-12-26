import cytoscape from 'cytoscape'
import { elements } from './elements'

export const graph = cytoscape({
  elements,
  zoom: 0.5,
  style:
    [{
      selector: 'node',
      style: {
        'background-color': 'red',
        'width': '12px',
        height: '12px'
      }
    }]
})