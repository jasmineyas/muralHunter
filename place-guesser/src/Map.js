import React from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

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
    googleMapsApiKey: process.env.JASMINE_REACT_APP_GOOGLE_MAPS_API_KEY, // Read the API
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10} // Adjust the zoom level as needed
    />
  );
};

export default Map;
