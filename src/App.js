import './App.css';
import GameBoard from './game/GameBoard';

function App() {
  return (
    <div className="App">
      <header>
        <h1><span className="big">The Smurfs</span> <span className="small">Memory Game</span></h1>
        <div className="brainy-explain">
          <p>"Click <em>every</em> card, but only <em>once</em>."</p>
          <img src="./smurfs/Brainy.webp" alt=""></img>
        </div>
      </header>
      <GameBoard />
    </div>
  );
}

export default App;
