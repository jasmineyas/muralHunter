import React, { useState } from "react";
import "./App.css";
import Map from "./Map";
import placeholder1 from "./place-holder.jpg";
import placeholder2 from "./place-holder2.jpg";

function App() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [currentSidePanel, setSidePanel] = useState("start");
  const [positions, setPositions] = useState([
    { lat: null, lng: null }, // Player 1 position
    { lat: null, lng: null }, // Player 2 position
  ]);
  const [targetPosition, setTargetPosition] = useState({
    lat: 49.2628,
    lng: -123.0995,
  }); // placeholder for mount pleaset

  const [mapMode, setMapMode] = useState("input"); // Determines map behavior (input/result)
  const [currentImage, setCurrentImage] = useState(placeholder1);

  const handleNavigation = (nextState) => {
    setSidePanel(nextState);
  };

  const handleSubmit = () => {
    console.log("Submitting guess...");
    setMapMode("result");
    handleNavigation("result");
  };

  // Fetch a new image for the next mural
  const handleNextMural = () => {
    console.log("Fetching a new image...");
    setPositions([
      { lat: null, lng: null },
      { lat: null, lng: null },
    ]);
    setMapMode("input"); // Reset to input mode
    // Example: Replace with API call or logic to update the image
    setCurrentImage(placeholder2); // Placeholder 2 - Replace with actual URL
    handleNavigation("input");
  };

  console.log("Current Side Panel:", currentSidePanel);
  console.log("Active Player:", activePlayer);
  console.log("Map Mode:", mapMode);

  return (
    <div className="container">
      <div className="side-panel">
        <div className="content">
          {currentSidePanel === "start" && (
            <>
              <h1>Welcome to the Mural Game!</h1>
              <p>
                {" "}
                Guess the locations of beauitful murals around the City of
                Vancouver!
              </p>
              <button onClick={() => handleNavigation("input")}>
                Start Game
              </button>
            </>
          )}
          {currentSidePanel === "input" && (
            <>
              <h1>Round 1 </h1>
              <p>
                {" "}
                On the map, pleaes drop the pin at where you think the mural is
                located, then click the submit button.📍
              </p>
              <img src={placeholder1} alt="placeholder" />
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
              <button onClick={handleSubmit}>Submit</button>
            </>
          )}
          {currentSidePanel === "result" && (
            <>
              <h1>Round 1 result </h1>
              <p> How close did you get?! Please see the map for results.</p>
              <img src={placeholder1} alt="placeholder" />
              <div className="mural-description">
                <p>
                  <b> About this mural - The Present is a Gift (2021) </b>
                </p>
                <p>
                  Artists Drew Young & Jay Senetchko painted the mural - "The
                  Present is a Gift" on the north walls of Belvedere Court
                  apartment building.
                </p>
                <p>
                  The “Present is a Gift” is a play on words to bring awareness
                  to the present moment, to live in the now.
                </p>
                <p>
                  The portraits reference two Mount Pleasant residents.
                  PaisleyNahanee (left side) is a Coast-Salish First Nations who
                  was born and grew up in Mount Pleasant. & Dr. Bob has worked
                  at an area optometrist office for over 6 decades. As two
                  longstanding residents, Paisley and Bob capture the essence,
                  history and culture of Mount Pleasant.
                </p>
              </div>
              <div className="button-container">
                <button className="side-by-side" onClick={handleNextMural}>
                  Next mural
                </button>
                <button
                  className="side-by-side"
                  onClick={() => handleNavigation("end")}
                >
                  {" "}
                  End game{" "}
                </button>
              </div>
            </>
          )}
          {currentSidePanel === "end" && (
            <>
              <h1>Have a nice day! </h1>
              <p>
                {" "}
                Thank you for playing the game. Remember to go outside and
                actually touch grass.
              </p>
              <button onClick={() => handleNavigation("start")}>
                {" "}
                Play again{" "}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="map-container">
        <Map
          activePlayer={activePlayer}
          positions={positions}
          setPositions={setPositions}
          targetPosition={targetPosition}
          mapMode={mapMode}
        />
      </div>
    </div>
  );
}

export default App;
