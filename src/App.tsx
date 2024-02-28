import { useAtomValue } from "jotai";
import { CytoscapeComponent } from "./components/app/CytoscapeComponent";
import { Home } from "./components/app/Home";
import { graphIdAtom } from "./graph/state";
import { style } from "./graph/style";

function App() {
  const graphId = useAtomValue(graphIdAtom);

  return (
    <div className="w-screen h-screen">
      {graphId ? <CytoscapeComponent style={style} /> : <Home />}
    </div>
  );
}

export default App;
