import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './Map';
import placeholder1 from './place-holder.jpg';
import placeholder2 from './place-holder2.jpg';
import uploadPlaceholder from './5.png';
import welcome from './2.png';
import menu from './7.png';
import end from './3.png';
import EXIF from 'exif-js';

function App() {
  const [activePlayer, setActivePlayer] = useState(1);
  const [currentSidePanel, setSidePanel] = useState('start');
  const [currentRound, setCurrentRound] = useState(1);
  const [positions, setPositions] = useState([
    { lat: null, lng: null }, // Player 1 position
    { lat: null, lng: null }, // Player 2 position
  ]);
  const [targetPosition, setTargetPosition] = useState({
    lat: null,
    lng: null,
  });

  const [mapMode, setMapMode] = useState('start'); // Determines map behavior (input/result)
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [fileChanged, setFileChanged] = useState(false);

  const [currentImage, setCurrentImage] = useState(uploadPlaceholder);

  const handleNavigation = (nextState) => {
    setSidePanel(nextState);
  };

  const handleStartStandardGame = () => {
    setMapMode('input');
    handleNavigation('input');
    setCurrentImage(placeholder1); // Placeholder 1 - replace with fetching backend.
    setTargetPosition({ lat: 49.2628, lng: -123.0995 });
  }; // Place Holder Target Position

  const handleSetUpBeta = () => {
    setMapMode('beta');
    handleNavigation('beta');
  };

  const handleStartBetaGame = () => {
    setMapMode('input');
    handleNavigation('input');
  };

  const handleSubmit = () => {
    console.log('Submitting guess...');
    setMapMode('result');
    handleNavigation('result');
    setActivePlayer(1);
  };

  // Fetch a new image for the next mural
  const handleNextMural = () => {
    console.log('Fetching a new image...');
    setPositions([
      { lat: null, lng: null },
      { lat: null, lng: null },
    ]);
    setMapMode('input'); // Reset to input mode
    // Example: Replace with API call or logic to update the image
    setCurrentImage(placeholder2); // Placeholder 2 - Replace with actual URL
    handleNavigation('input');
    setCurrentRound(currentRound + 1);
  };

  const handlePlayAgain = () => {
    handleNavigation('start');
    setCurrentRound(1);
    setMapMode('start');
    setPositions([
      { lat: null, lng: null }, // Player 1 position
      { lat: null, lng: null }, // Player 2 position
    ]);
  };

  useEffect(() => {
    const bothPlayersReady =
      positions[0].lat !== null && positions[1].lat !== null;
    setSubmitEnabled(bothPlayersReady);
  }, [positions]);

  console.log('submitEnabled', submitEnabled);
  //   console.log("Current Side Panel:", currentSidePanel);
  //   console.log("Active Player:", activePlayer);
  //   console.log("Map Mode:", mapMode);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileChanged(true);
      // Preview the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target.result); // Display the image
      };
      reader.readAsDataURL(file);

      // Extract GPS metadata
      EXIF.getData(file, function () {
        const lat = EXIF.getTag(this, 'GPSLatitude');
        const lng = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
        const lngRef = EXIF.getTag(this, 'GPSLongitudeRef');

        if (lat && lng) {
          const latitude = convertToDecimal(lat, latRef);
          const longitude = convertToDecimal(lng, lngRef);
          setTargetPosition({ lat: latitude, lng: longitude });
          console.log('Extracted GPS:', { lat: latitude, lng: longitude });
        } else {
          console.log('No GPS metadata found in the uploaded image.');
        }
      });
    }
  };

  const convertToDecimal = (coords, ref) => {
    const decimal = coords[0] + coords[1] / 60 + coords[2] / 3600;
    return ref === 'S' || ref === 'W' ? -decimal : decimal;
  };

  useEffect(() => {
    setSubmitEnabled(fileChanged);
  }, [fileChanged]);

  return (
    <div className="container">
      <div className="side-panel">
        <div className="content">
          {currentSidePanel === 'start' && (
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
              <img style={{ marginTop: '1em' }} src={welcome} alt="welcome" />
              <button onClick={() => handleNavigation('menu')}>
                Start game
              </button>
            </>
          )}
          {currentSidePanel === 'menu' && (
            <>
              <h1>Choose your game mode!</h1>
              <p>
                Play with a friend using our curated list of Vancouver murals!
              </p>
              <button onClick={handleStartStandardGame}> Standard mode</button>
              <p>Upload your own mural image for your friends to guess! 💪 </p>
              <button onClick={handleSetUpBeta}> Beta </button>
              <img src={menu} alt="select-menu-graphic" />
            </>
          )}
          {currentSidePanel === 'beta' && (
            <>
              <h1>Upload an image of your choice</h1>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {currentImage && (
                <div>
                  <h3>Uploaded Image:</h3>
                  <img
                    src={currentImage}
                    alt="Uploaded Mural"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '500px',
                    }}
                  />
                </div>
              )}
              <p>
                {targetPosition.lat && targetPosition.lng ? (
                  <>
                    <b>Mural location:</b> latitude{' '}
                    {targetPosition.lat.toFixed(2)}, longitude{' '}
                    {targetPosition.lng.toFixed(2)}
                  </>
                ) : (
                  'No location data can be found in the photo. Please upload another image or provide a location manually by dropping a pin on the map.'
                )}
              </p>
              <button onClick={handleStartBetaGame} disabled={!submitEnabled}>
                Finish set up
              </button>
            </>
          )}
          {currentSidePanel === 'input' && (
            <>
              <h1>Round {currentRound} </h1>
              <p>
                {' '}
                On the map, pleaes drop the pin at where you think the mural is
                located, then click the submit button.📍
              </p>
              <img
                className="mural-image"
                src={currentImage}
                alt="currentImage"
              />
              <div className="button-group">
                {/* Player 1 Button */}
                <button
                  className={activePlayer === 1 ? 'active' : ''}
                  onClick={() => setActivePlayer(1)}
                >
                  Player 1
                </button>
                {/* Player 2 Button */}
                <button
                  className={activePlayer === 2 ? 'active' : ''}
                  onClick={() => setActivePlayer(2)}
                >
                  Player 2
                </button>
              </div>
              <button onClick={handleSubmit} disabled={!submitEnabled}>
                Submit
              </button>
            </>
          )}
          {currentSidePanel === 'result' && (
            <>
              <h1>Round {currentRound} result </h1>
              <p> Whose guess is closer?! Please see the map for results.</p>
              <img
                className="mural-image"
                src={currentImage}
                alt="currentImage"
              />
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
                  at an area optometrist office for over 6 decades.
                </p>
                <p>
                  As two longstanding residents, Paisley and Bob capture the
                  essence, history and culture of Mount Pleasant.
                </p>
              </div>
              <div className="button-container">
                <button className="side-by-side" onClick={handleNextMural}>
                  Next mural
                </button>
                <button
                  className="side-by-side"
                  onClick={() => handleNavigation('end')}
                >
                  End game
                </button>
              </div>
            </>
          )}
          {currentSidePanel === 'end' && (
            <>
              <h1>Have a nice day! </h1>
              <p className="welcome-end-text">
                Thank you for playing the game.{' '}
              </p>
              <p className="welcome-end-text">
                Remember to go outside and actually touch grass. 🌿 😎
              </p>
              <img style={{ marginTop: '1em' }} src={end} alt="end" />
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
          setTargetPosition={setTargetPosition}
          mapMode={mapMode}
        />
      </div>
    </div>
  );
}

export default App;
