// src/App.js
import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import './App.css';

// Earth's approximate radius in km
const R = 6371;

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

// Example mural location (replace with the real lat/lng of the mural)
const MURAL_LOCATION = { lat: 49.28, lng: -123.11 };

function App() {
  const [guessLocation, setGuessLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const handleCheckDistance = () => {
    if (guessLocation) {
      const dist = getDistanceFromLatLonInKm(
        MURAL_LOCATION.lat,
        MURAL_LOCATION.lng,
        guessLocation.lat,
        guessLocation.lng
      );
      setDistance(dist.toFixed(2));
    }
  };

  return (
    <div className="App">
      <h1>Mural Guesser</h1>

      {/* The main layout container */}
      <div className="layout-container">
        {/* Left side (1/3) - Mural image */}
        <div className="mural-section">
          <img
            src="/path/to/your/mural.jpg"
            alt="Mural"
            className="mural-image"
          />
        </div>

        {/* Right side (2/3) - Map and distance info */}
        <div className="map-section">
          <p>Click on the map where you think the mural is located!</p>

          <MapContainer
            guessLocation={guessLocation}
            setGuessLocation={setGuessLocation}
          />

          <button onClick={handleCheckDistance}>
            Check Distance
          </button>

          {distance && (
            <h2>Your guess is {distance} km away!</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
