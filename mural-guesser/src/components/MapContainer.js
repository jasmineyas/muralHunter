import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '400px',
  height: '400px'
};

const VANCOUVER_COORDS = { lat: 49.2827, lng: -123.1207 };

function MapContainer({ guessLocation, setGuessLocation }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading Maps...</div>;

  // Example: Use these variables in the GoogleMap component
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={VANCOUVER_COORDS}
      onClick={(e) => {
        setGuessLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }}
    >
      {/* If the user guessed a location, place a marker */}
      {guessLocation && <Marker position={guessLocation} />}
    </GoogleMap>
  );
}

export default MapContainer;
