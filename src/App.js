import "./App.css";
import Artists from "./components/Artists";
import Tracks from "./components/Tracks";

function App() {
  return (
    <div className="App">
      <h1>Visualise Spotify API DATA</h1>
      <Artists />
      <Tracks />
    </div>
  );
}

export default App;
