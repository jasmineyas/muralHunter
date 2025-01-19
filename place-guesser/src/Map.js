import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const center = {
  lat: 37.7749, // Example: San Francisco latitude
  lng: -122.4194, // Example: San Francisco longitude
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Read the API
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState(null);

  // Handle map clicks
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };

    setMarkerPosition(position); // Update marker position
    console.log(position);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps........</div>;

  console.log({ isLoaded, loadError });

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={center}
      onClick={handleMapClick} // Add click handler
    >
      {markerPosition && <Marker position={markerPosition} />} {/* Render marker */}
    </GoogleMap>
  );
};

export default Map;
