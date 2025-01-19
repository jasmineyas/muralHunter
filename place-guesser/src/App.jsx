import React, { useState } from "react";
import "./App.css";
import Map from "./Map";
import placeholder1 from "./place-holder.jpg";
import placeholder2 from "./place-holder2.jpg";
import welcome from "./2.png";
import end from "./3.png";

function App() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [currentSidePanel, setSidePanel] = useState("start");
  const [currentRound, setCurrentRound] = useState(1);
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
    setActivePlayer(null);
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
    setCurrentRound(currentRound + 1);
  };

  const handlePlayAgain = () => {
    handleNavigation("start");
    setCurrentRound(1);
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
              <h1>Welcome to the mural game!</h1>
              <p className="welcome-end-text">
                Vancouver is home to an incredible collection of vibrant murals
                that bring the city’s streets to life.
              </p>
              <p className="welcome-end-text">
                Explore these works of art and see how many locations you can
                guess! Let’s celebrate creativity and the stories behind each
                masterpiece. 🎨✨
              </p>
              <img style={{ marginTop: "1em" }} src={welcome} alt="welcome" />
              <button onClick={() => handleNavigation("input")}>
                Start game
              </button>
            </>
          )}
          {currentSidePanel === "input" && (
            <>
              <h1>Round {currentRound} </h1>
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
              <h1>Round {currentRound} result </h1>
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
                  End game
                </button>
              </div>
            </>
          )}
          {currentSidePanel === "end" && (
            <>
              <h1>Have a nice day! </h1>
              <p className="welcome-end-text">Thank you for playing the game. </p>
              <p className="welcome-end-text">
                Remember to go outside and actually touch grass. 🌿 😎
              </p>
              <img style={{ marginTop: "1em" }} src={end} alt="end" />
              <button onClick={handlePlayAgain}>Play again</button>
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
