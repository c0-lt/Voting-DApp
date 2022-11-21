import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Voting from "./components/Voting";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Intro />
          <Voting />
          <hr />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
