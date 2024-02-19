
import { useAtom } from "jotai";
import { useEffect } from "react";
import { CytoscapeComponent } from "./components/app/CytoscapeComponent";
import { AddNegationModal } from "./components/ui/AddNegationModal";
import { graphIdAtom } from "./graph/state";
import { style } from "./graph/style";



function App() {
  const [graphId, setGraphId] = useAtom(graphIdAtom)
  useEffect(() => {
   if (!graphId) setGraphId(Math.random().toString(36).substring(7))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="w-screen h-screen">
      <CytoscapeComponent style={style} />
      <AddNegationModal />
    </div>
  );
}

export default App;
