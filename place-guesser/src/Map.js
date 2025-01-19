import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  OverlayView
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%"
};
const center = {
  lat: 49.246292, // Vancouver latitude
  lng: -123.11934 // Vancouver longitude
};

const targetCoordinate = {
  lat: 49.246292, // Target latitude
  lng: -123.11934 // Target longitude
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

const Map = ({ activePlayer }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
    libraries
  });

  const [positions, setPositions] = useState([
    { lat: null, lng: null }, // Player 1 position
    { lat: null, lng: null } // Player 2 position
  ]);

  const [distances, setDistances] = useState([null, null]); // Distances to target for each player

  const calculateMidpoint = (coord1, coord2) => {
    return {
      lat: (coord1.lat + coord2.lat) / 2,
      lng: (coord1.lng + coord2.lng) / 2
    };
  };

  const handleMapClick = event => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setPositions(prevPositions => {
      const updatedPositions = [...prevPositions];
      updatedPositions[activePlayer - 1] = { lat, lng };
      return updatedPositions;
    });

    setDistances(prevDistances => {
      const updatedDistances = [...prevDistances];
      const targetLatLng = new window.google.maps.LatLng(
        targetCoordinate.lat,
        targetCoordinate.lng
      );
      const playerLatLng = new window.google.maps.LatLng(lat, lng);

      updatedDistances[
        activePlayer - 1
      ] = (window.google.maps.geometry.spherical.computeDistanceBetween(
        playerLatLng,
        targetLatLng
      ) / 1000).toFixed(2); // Convert to kilometers and round to 2 decimal places

      return updatedDistances;
    });
  };

  if (loadError) return <div>Error loading maps. Please try again.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={center}
      onClick={handleMapClick}
    >
      {/* Render markers for Player 1 and Player 2 */}
      {positions[0].lat && <Marker position={positions[0]} label="Player 1" />}
      {positions[1].lat &&
        <Marker
          position={positions[1]}
          label="Player 2"
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />}

      {/* Render dashed polylines and distance labels */}
      {positions.map((position, index) => {
        if (position.lat) {
          const midpoint = calculateMidpoint(position, targetCoordinate);
          return (
            <React.Fragment key={index}>
              <DashedPolyline
                path={[position, targetCoordinate]}
                color="#FF00FF"
                dashLength="10px"
              />
              {/* Distance label */}
              <OverlayView
                position={midpoint}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={{
                    background: "white",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    border: "1px solid #ccc",
                    fontSize: "12px"
                  }}
                >
                  {distances[index]
                    ? `${distances[index]} km`
                    : "Calculating..."}
                </div>
              </OverlayView>
            </React.Fragment>
          );
        }
        return null;
      })}

      {/* Render the target marker */}
      <Marker position={targetCoordinate} label="Target" />
    </GoogleMap>
  );
};

export default Map;
