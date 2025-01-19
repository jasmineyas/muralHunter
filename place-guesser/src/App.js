import "./App.css";
import Map from "./Map";
import placeholder from "./place-holder.jpg";
import React, { useState } from "react";

function App() {
  const [activePlayer, setActivePlayer] = useState(null);

  return (
    <div className="container">
      <div className="image-panel">
        <div className="content">
          <h1>Guess the mural's location </h1>
          <p>
            {" "}
            On the map, pleaes drop the pin at where you think the mural is
            located, then click the submit button.📍
          </p>
          <img src={placeholder} alt="placeholder" />
          <div className="button-group">
            {/* Player 1 Button */}
            <button
              className={activePlayer === 1 ? "active" : ""}
              onClick={() => setActivePlayer(1)}
            >
              Player 1
            </button>
            {/* Player 2 Button */}
            <button
              className={activePlayer === 2 ? "active" : ""}
              onClick={() => setActivePlayer(2)}
            >
              Player 2
            </button>
          </div>
          <button>Submit</button>
        </div>
      </div>
      <div className="map-container">
        <Map activePlayer={activePlayer} />
      </div>
    </div>
  );
}

export default App;
