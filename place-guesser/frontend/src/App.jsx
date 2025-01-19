import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './Map';
import welcome from './2.png';
import end from './3.png';

function App() {
  const [activePlayer, setActivePlayer] = useState(1);
  const [currentSidePanel, setSidePanel] = useState('start');
  const [currentRound, setCurrentRound] = useState(1);
  const [positions, setPositions] = useState([
    { lat: null, lng: null },
    { lat: null, lng: null },
  ]);
  const [targetPosition, setTargetPosition] = useState({ lat: 49.2628, lng: -123.0995 });
  const [mapMode, setMapMode] = useState('start');
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const [muralData, setMuralData] = useState([]);
  const [currentMuralIndex, setCurrentMuralIndex] = useState(0);

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

  const handleStartGame = () => {
    setMapMode('input');
    setSidePanel('input');
  };

  const handleNextMural = () => {
    const nextIndex = (currentMuralIndex + 1) % muralData.length;
    setCurrentMuralIndex(nextIndex);
    setTargetPosition({
      lat: muralData[nextIndex].latitude,
      lng: muralData[nextIndex].longitude,
    });
    setCurrentRound((prevRound) => prevRound + 1);
    setSidePanel('input');
    setMapMode('input');
    setPositions([
      { lat: null, lng: null },
      { lat: null, lng: null },
    ]);
  };

  const handleSubmit = () => {
    setMapMode('result');
    setSidePanel('result');
  };

  const handlePlayAgain = () => {
    setSidePanel('start');
    setCurrentRound(1);
    setMapMode('start');
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

  return (
    <div className="container">
      <div className="side-panel">
        <div className="content">
          {currentSidePanel === 'start' && (
            <>
              <h1>Welcome to the mural game!</h1>
              <p>
                Vancouver is home to an incredible collection of vibrant murals
                that bring the city’s streets to life.
              </p>
              <img style={{ marginTop: '1em' }} src={welcome} alt="welcome" />
              <button onClick={handleStartGame}>Start Game</button>
            </>
          )}

          {currentSidePanel === 'input' && muralData.length > 0 && (
            <>
              <h1>Round {currentRound}</h1>
              <p>Drop a pin where you think the mural is located, then click submit.</p>
              <img
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
              <p>
                About this mural: {muralData[currentMuralIndex].description}
              </p>
              <img
                src={muralData[currentMuralIndex].url}
                alt="Mural"
                style={{ width: '100%' }}
              />
              <button onClick={handleNextMural}>Next Mural</button>
            </>
          )}

          {currentSidePanel === 'end' && (
            <>
              <h1>Thank you for playing!</h1>
              <p>We hope you enjoyed exploring Vancouver's murals!</p>
              <img style={{ marginTop: '1em' }} src={end} alt="end" />
              <button onClick={handlePlayAgain}>Play Again</button>
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
