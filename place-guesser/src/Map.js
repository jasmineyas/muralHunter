import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline
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

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
    libraries
  });

  
  const [lineCoordinates, setLineCoordinates] = useState([
    { lat: 49.246292, lng: -124.11934 }, // Point 1
    { lat: 49.246292, lng: -122.11934 }, // Point 2
    { lat: 48.246292, lng: -122.11934 } // Point 3
  ]);

  // Handle map clicks
  const handleMapClick = event => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLineCoordinates(prev => [...prev, { lat, lng }]);
    console.log(lineCoordinates);
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
      {/* Map the lineCoordinates to draw dashed lines to the target coordinate */}
      {lineCoordinates.map((coordinate, index) =>
        <DashedPolyline
          key={index}
          path={[coordinate, targetCoordinate]}
          color="#FF00FF"
          dashLength="10px"
        />
      )}

      {/* Render markers at each coordinate */}
      {lineCoordinates.map((coordinate, index) =>
        <Marker key={index} position={coordinate} label={`P${index + 1}`} />
      )}

      {/* Render the target marker */}
      <Marker position={targetCoordinate} label="Target" />

      {/* Render a marker at the clicked position
      {markerPosition && <Marker position={markerPosition} />} */}
    </GoogleMap>
  );
};

export default Map;
