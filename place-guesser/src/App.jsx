import React, { useState } from "react";
import "./App.css";
import Map from "./Map";
import placeholder1 from "./place-holder.jpg";
import placeholder2 from "./place-holder2.jpg";

function App() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("start");
  const [userOneGuesses, setUserOneGusses] = useState(null);
  const [currentGuess, setCurrentGuess] = useState({
    lat: 49.2628,
    lng: -123.0995,
  }); // placeholder for mount pleaset
  const [currentImage, setCurrentImage] = useState(placeholder1); // Track current image

  const handleNavigation = (nextState) => {
    setCurrentScreen(nextState);
  };

  const handleSubmit = () => {
    console.log("Submitting guess...");
    setUserOneGusses({ lat: 49.2606, lng: -123.246 }); // placeholder, UBC
    handleNavigation("result");
  };

  // Fetch a new image for the next mural
  const fetchNewImage = () => {
    console.log("Fetching a new image...");
    // Example: Replace with API call or logic to update the image
    setCurrentImage(placeholder2); // Placeholder 2 - Replace with actual URL
  };

  const handleNextMural = () => {
    fetchNewImage();
    setUserOneGusses(null);
    handleNavigation("input");
  };

  console.log("Current Screen:", currentScreen);

  return (
    <div className="container">
      <div className="side-panel">
        <div className="content">
          {currentScreen === "start" && (
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
          {currentScreen === "input" && (
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
          {currentScreen === "result" && (
            <>
              <h1>Round 1 result </h1>
              <p> How close did you get?! Please see the map for results.</p>
              <img src={placeholder1} alt="placeholder" />
              <div className="mural-description">
                <p>
                  {" "}
                  <b> About this mural - The Present is a Gift (2021) </b>{" "}
                </p>
                <p>
                  {" "}
                  Artists Drew Young & Jay Senetchko painted the mural - "The
                  Present is a Gift" on the north walls of Belvedere Court
                  apartment building.
                </p>
                <p>
                  {" "}
                  The “Present is a Gift” is a play on words to bring awareness
                  to the present moment, to live in the now.
                </p>
                <p>
                  {" "}
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
                  {" "}
                  Next mural
                </button>{" "}
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
          {currentScreen === "end" && (
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
        <Map activePlayer={activePlayer} />
      </div>
    </div>
  );
}

export default App;
