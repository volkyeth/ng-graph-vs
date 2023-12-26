import { CytoscapeComponent } from './components/app/CytoscapeComponent'
import { elements } from './graph/elements'
import { style } from './graph/style'

function App() {
  return (
    <div className="w-screen h-screen">
      <CytoscapeComponent elements={elements} style={style} />
    </div>
  )
}

export default App
