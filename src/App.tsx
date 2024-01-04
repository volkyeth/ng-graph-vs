import { CytoscapeComponent } from "./components/app/CytoscapeComponent";
import { AddNegationModal } from "./components/ui/AddNegationModal";
import { proposalSample } from "./graph/samples/proposal";
import { style } from "./graph/style";

function App() {
  return (
    <div className="w-screen h-screen">
      <CytoscapeComponent elements={proposalSample} style={style} />
      <AddNegationModal />
    </div>
  );
}

export default App;
