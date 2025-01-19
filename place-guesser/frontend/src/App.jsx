import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './Map';
import welcome from './2.png';
import end from './3.png';
import EXIF from 'exif-js';
import placeholder1 from './place-holder.jpg';
import menu from './7.png';
import uploadPlaceholder from './5.png';

function App() {
  const [activePlayer, setActivePlayer] = useState(1);
  const [currentSidePanel, setSidePanel] = useState('start');
  const [currentRound, setCurrentRound] = useState(1);
  const [positions, setPositions] = useState([
    { lat: null, lng: null },
    { lat: null, lng: null },
  ]);

  const [targetPosition, setTargetPosition] = useState({
    lat: 49.2628,
    lng: -123.0995,
  });

  const [betaTargetPosition, setBetaTargetPosition] = useState({
    lat: null,
    lng: null,
  });

  const [mapMode, setMapMode] = useState('start');
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [fileChanged, setFileChanged] = useState(false);
  const [currentBetaImage, setCurrentBetaImage] = useState(uploadPlaceholder);
  //   const [currentImage, setCurrentImage] = useState(uploadPlaceholder);
  const [muralData, setMuralData] = useState([]);
  const [currentMuralIndex, setCurrentMuralIndex] = useState(0);
  const [lineCoordinates, setLineCoordinates] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchMurals = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/images');
        const data = await response.json();
        setMuralData(data);
        if (data.length > 0) {
          setTargetPosition({ lat: data[0].latitude, lng: data[0].longitude });
        }
      } catch (error) {
        console.error('Error fetching mural data:', error);
      }
    };

    fetchMurals();
  }, []);

  const handleNavigation = (nextState) => {
    setSidePanel(nextState);
  };

  const handleStartGame = () => {
    setMapMode('input');
    setSidePanel('menu');
  };

  const handleStartStandardGame = () => {
    setMapMode('input');
    handleNavigation('input');
    // setCurrentImage(placeholder1); // Placeholder 1 - replace with fetching backend.
    setTargetPosition({
      lat: muralData[currentMuralIndex].latitude,
      lng: muralData[currentMuralIndex].longitude,
    });
  }; // Place Holder Target Position

  const handleNextMural = () => {
    const nextIndex = currentMuralIndex + 1;

    if (nextIndex >= muralData.length) {
      // If there are no more murals, switch to the "end" screen
      setSidePanel('end');
      setMapMode('start'); // Reset map mode if needed
    } else {
      // Otherwise, proceed to the next mural
      setCurrentMuralIndex(nextIndex);
      setTargetPosition({
        lat: muralData[nextIndex].latitude,
        lng: muralData[nextIndex].longitude,
      });
      setCurrentRound((prevRound) => prevRound + 1); // Increment the round number
      setActivePlayer(1);
      setLineCoordinates([]);
      setSidePanel('input');
      setMapMode('input');
      setPositions([
        { lat: null, lng: null },
        { lat: null, lng: null },
      ]);
    }
  };

  const handleSubmit = () => {
    setMapMode('result');
    setSidePanel('result');
    setActivePlayer(3);
  };

  const handleSetUpBeta = () => {
    setMapMode('beta-result');
    handleNavigation('beta');
  };

  const handleStartBetaGame = () => {
    setMapMode('input');
    handleNavigation('beta-input');
  };

  const handleBetaSubmit = () => {
    setMapMode('beta-result');
    setSidePanel('beta-result');
    setActivePlayer(4);
  };

  const handleUploadNextImage = () => {
    handleNavigation('beta');
    setCurrentBetaImage(uploadPlaceholder);
    setMapMode('start');
    setActivePlayer(1);
    setPositions([
      { lat: null, lng: null },
      { lat: null, lng: null },
    ]);
  };

  const handleEndGame = () => {
    handleNavigation('end');
    setActivePlayer(1);
    setMapMode('start');
  };

  const handlePlayAgain = () => {
    setSidePanel('start');
    setCurrentRound(1);
    setPositions([
      { lat: null, lng: null },
      { lat: null, lng: null },
    ]);
    setCurrentMuralIndex(0);
    if (muralData.length > 0) {
      setTargetPosition({
        lat: muralData[0].latitude,
        lng: muralData[0].longitude,
      });
    }
  };

  useEffect(() => {
    const bothPlayersReady =
      positions[0].lat !== null && positions[1].lat !== null;
    setSubmitEnabled(bothPlayersReady);
  }, [positions]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileChanged(true);
      // Preview the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentBetaImage(e.target.result); // Display the image
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
          setBetaTargetPosition({ lat: latitude, lng: longitude });
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

  console.log('from app.jsx', betaTargetPosition);
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
              <button onClick={handleStartGame}>Start game</button>
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
              {currentBetaImage && (
                <div>
                  <h3>Uploaded Image:</h3>
                  <img
                    src={currentBetaImage}
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
                {betaTargetPosition.lat && betaTargetPosition.lng ? (
                  <>
                    <b>Mural location:</b> latitude{' '}
                    {betaTargetPosition.lat.toFixed(2)}, longitude{' '}
                    {betaTargetPosition.lng.toFixed(2)}
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
          {currentSidePanel === 'beta-input' && (
            <>
              <h1>Beta round</h1>
              <p>
                On the map, pleaes drop the pin at where you think the mural is
                located, then click the submit button.📍
              </p>
              <img
                className="mural-image"
                src={currentBetaImage}
                alt="user-uploaded image"
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
              <button onClick={handleBetaSubmit} disabled={!submitEnabled}>
                Submit
              </button>
            </>
          )}
          {currentSidePanel === 'beta-result' && (
            <>
              <h1>Beta result </h1>
              <p> Whose guess is closer?! Please see the map for results.</p>
              <img
                className="mural-image"
                src={currentBetaImage}
                alt="user-upload"
              />
              <div className="button-container">
                <button
                  className="side-by-side"
                  onClick={handleUploadNextImage}
                >
                  Upload next image
                </button>
                <button className="side-by-side" onClick={handleEndGame}>
                  End game
                </button>
              </div>
            </>
          )}

          {currentSidePanel === 'input' && muralData.length > 0 && (
            <>
              <h1>Round {currentRound}</h1>
              <p>
                Drop a pin where you think the mural is located, then click
                submit.
              </p>
              <img
                className="mural-image"
                src={muralData[currentMuralIndex].url}
                alt="Mural"
                style={{ width: '100%' }}
              />
              <div className="button-group">
                <button
                  className={activePlayer === 1 ? 'active' : ''}
                  onClick={() => setActivePlayer(1)}
                >
                  Player 1
                </button>
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

          {currentSidePanel === 'result' && muralData.length > 0 && (
            <>
              <h1>Round {currentRound} Results</h1>
              <img
                className="mural-image"
                src={muralData[currentMuralIndex].url}
                alt="Mural"
                style={{ width: '100%' }}
              />
              <div className="mural-description">
                <p>
                  {muralData[currentMuralIndex]?.description ||
                    'No additional details provided.'}
                </p>
              </div>
              <div className="button-container">
                <button className="side-by-side" onClick={handleNextMural}>
                  Next mural
                </button>
                <button className="side-by-side" onClick={handleEndGame}>
                  End game
                </button>
              </div>
            </>
          )}

          {currentSidePanel === 'end' && (
            <>
              <h1>Thank you for playing!</h1>
              <p className="welcome-end-text">
                We hope you enjoyed exploring Vancouver's murals!
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
          betaTargetPosition={betaTargetPosition}
          lineCoordinates={lineCoordinates}
          setLineCoordinates={setLineCoordinates}
          mapMode={mapMode}
        />
      </div>
    </div>
  );
}

export default App;
