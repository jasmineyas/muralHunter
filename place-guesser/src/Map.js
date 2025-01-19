import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const center = {
  lat: 49.246292, // Vancouver latitude
  lng: -123.11934, // Vancouver longitude
};

const Map = ({ activePlayer, userOneGuesses }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Read the API
    libraries,
  });

  const [positions, setPositions] = useState([
    { lat: null, lng: null },
    { lat: null, lng: null },
  ]);

  const [lineCoordinates, setLineCoordinates] = useState([]);


  // Handle map clicks
  const handleMapClick = (event) => {

    if (activePlayer === null) {
      setPositions([
        { lat: null, lng: null },
        { lat: null, lng: null },
      ]);
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    // setMarkerPosition(position); // Update marker position, single-player old code

    setPositions((prevPositions) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[activePlayer - 1] = { lat, lng }; // Update the active player's position
      return updatedPositions;
    });

    // console.log(positions);
  };

  useEffect(() => {
    if (userOneGuesses) {
      setLineCoordinates(positions.filter((pos) => pos.lat && pos.lng));
    }
  }, [userOneGuesses, positions]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps........</div>;

  //console.log({ isLoaded, loadError });

  console.log(positions);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={center}
      onClick={handleMapClick} // Add click handler
    >
      {/* Render the target marker */}
      {userOneGuesses && activePlayer === 3 && (
        <Marker position={userOneGuesses} label="Target" />
      )}

      {/* Render Player 1 and Player 2 markers */}
      {activePlayer === 3 && positions[0].lat && 
        <Marker 
          position={positions[0]} 
          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      />}
      
      {activePlayer === 3 && positions[1].lat && 
        <Marker 
        position={positions[1]} 
        icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      />}

      {/* Render markers for Player 1 and Player 2 */}
      {activePlayer === 1 && positions[0].lat && (
        <Marker
          position={positions[0]}
          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        />
      )}
      {activePlayer === 2 && positions[1].lat && (
        <Marker
          position={positions[1]}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      )}
    </GoogleMap>

  );
};

export default Map;
