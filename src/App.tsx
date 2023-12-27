import { AddPointButton } from "./components/app/AddPointButton";
import { CytoscapeComponent } from "./components/app/CytoscapeComponent";
import { duckSample } from "./graph/samples/duck";
import { style } from "./graph/style";

function App() {
  return (
    <div className="w-screen h-screen">
      <CytoscapeComponent elements={duckSample} style={style} />
      <AddPointButton className="absolute right-10 bottom-10 rounded-full bg-blue-500 p-4 w-fit h-fit" />
    </div>
  );
}

export default App;
