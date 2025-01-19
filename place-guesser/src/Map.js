import React, { useState, useEffect, act } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const center = {
  lat: 49.246292, // Vancouver latitude
  lng: -123.11934, // Vancouver longitude
};

const DashedPolyline = ({
  path,
  color = "#00FFFF",
  weight = 2,
  dashLength = "10px"
}) => {
  return (
    <Polyline
      path={path}
      options={{
        strokeColor: color,
        strokeOpacity: 0, // Make the solid line invisible for dashed effect
        strokeWeight: weight, // Line thickness
        icons: [
          {
            icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 2 },
            offset: "0",
            repeat: dashLength
          }
        ]
      }}
    />
  );
};

const Map = ({
  activePlayer,
  positions,
  setPositions,
  targetPosition,
  lineCoordinates,
  setLineCoordinates,
  mapMode,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Read the API
    libraries,
  });

  // Log updated positions whenever the state changes
  useEffect(() => {
    console.log("Updated positions:", positions);
  }, [positions]);

  // Handle map clicks
  const handleMapClick = (event) => {
    console.log("Map clicked:", event.latLng.toJSON());
    console.log("activePlayer", activePlayer);
    console.log("mapMode", mapMode);
    if (mapMode === "input") {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      // setMarkerPosition(position); // Update marker position, single-player old code
      setPositions((prevPositions) => {
        const updatedPositions = [...prevPositions];
        updatedPositions[activePlayer - 1] = { lat, lng }; // Update the active player's position
        return updatedPositions;
      });
      // console.log(positions);
      console.log(`Player ${activePlayer} dropped a pin at:`, { lat, lng });
    }
  };

  useEffect(() => {
    if (targetPosition) {
      setLineCoordinates(positions.filter((pos) => pos.lat && pos.lng));
    }
  }, [targetPosition, positions]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps........</div>;

  //console.log({ isLoaded, loadError });

  console.log(positions);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      onClick={handleMapClick} // Add click handler
    >

      {/* Map the lineCoordinates to draw dashed lines to the target coordinate */}
      {activePlayer === 3 && lineCoordinates.map((coordinate, index = 0) =>
          <DashedPolyline
            key={index}
            path={[coordinate, targetPosition]}
            color="#FF00FF"
            dashLength="10px"
          />
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
      {mapMode === "input" && (
        <>
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
        </>
      )}
      {mapMode === "result" && (
        <>
          <Marker
            position={targetPosition} // Placeholder marker
            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          />
        </>
      )}
    </GoogleMap>

  );
};

export default Map;
