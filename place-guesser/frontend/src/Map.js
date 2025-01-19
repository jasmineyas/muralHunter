import React, { useState, useEffect, act } from 'react';
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  PolylineF,
  InfoWindowF,
} from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 49.273978, // Vancouver latitude
  lng: -123.127337, // Vancouver longitude
};

const DashedPolyline = ({
  path,
  color = '#00FFFF',
  weight = 2,
  dashLength = '10px',
}) => {
  return (
    <PolylineF
      path={path}
      options={{
        strokeColor: color,
        strokeOpacity: 0, // Make the solid line invisible for dashed effect
        strokeWeight: weight, // Line thickness
        icons: [
          {
            icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 },
            offset: '0',
            repeat: dashLength,
          },
        ],
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
  betaTargetPosition,
  mapMode,
  setBetaTargetPosition,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Read the API
    libraries,
  });

  const [distances, setDistances] = useState({ player1: null, player2: null });
  const [betaDistances, setBetaDistances] = useState({
    player1: null,
    player2: null,
  });

  const calculateBetaDistances = () => {
    if (!betaTargetPosition || !positions[0].lat || !positions[1].lat) return;

    const service = new window.google.maps.DistanceMatrixService();
    const origins = [
      new window.google.maps.LatLng(positions[0].lat, positions[0].lng),
      new window.google.maps.LatLng(positions[1].lat, positions[1].lng),
    ];
    const destination = new window.google.maps.LatLng(
      betaTargetPosition.lat,
      betaTargetPosition.lng
    );

    service.getDistanceMatrix(
      {
        origins,
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING, // You can also use WALKING, BICYCLING, or TRANSIT
      },
      (response, status) => {
        if (status === 'OK') {
          const distances = response.rows.map(
            (row) => row.elements[0].distance.text
          );
          setBetaDistances({
            player1: distances[0],
            player2: distances[1],
          });
          console.log('Distances:', distances);
        } else {
          console.error('Error calculating distances:', status);
        }
      }
    );
  };

  console.log('betaTargetPosition:', betaTargetPosition);

  // Function to calculate distances using Distance Matrix API
  const calculateDistances = () => {
    if (!targetPosition || !positions[0].lat || !positions[1].lat) return;

    const service = new window.google.maps.DistanceMatrixService();
    const origins = [
      new window.google.maps.LatLng(positions[0].lat, positions[0].lng),
      new window.google.maps.LatLng(positions[1].lat, positions[1].lng),
    ];
    const destination = new window.google.maps.LatLng(
      targetPosition.lat,
      targetPosition.lng
    );

    service.getDistanceMatrix(
      {
        origins,
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING, // You can also use WALKING, BICYCLING, or TRANSIT
      },
      (response, status) => {
        if (status === 'OK') {
          const distances = response.rows.map(
            (row) => row.elements[0].distance.text
          );
          setDistances({
            player1: distances[0],
            player2: distances[1],
          });
          console.log('Distances:', distances);
        } else {
          console.error('Error calculating distances:', status);
        }
      }
    );
  };

  // Log updated positions whenever the state changes
  useEffect(() => {
    console.log('Updated positions:', positions);
  }, [positions]);

  // Handle map clicks
  const handleMapClick = (event) => {
    console.log('Map clicked:', event.latLng.toJSON());
    console.log('activePlayer', activePlayer);
    console.log('mapMode', mapMode);
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (mapMode === 'input') {
      //   const lat = event.latLng.lat();
      //   const lng = event.latLng.lng();
      // setMarkerPosition(position); // Update marker position, single-player old code
      setPositions((prevPositions) => {
        const updatedPositions = [...prevPositions];
        updatedPositions[activePlayer - 1] = { lat, lng }; // Update the active player's position
        return updatedPositions;
      });
      // console.log(positions);
      console.log(`Player ${activePlayer} dropped a pin at:`, { lat, lng });
    } else if (mapMode === 'beta') {
      //   const lat = event.latLng.lat();
      //   const lng = event.latLng.lng();
      setBetaTargetPosition({ lat, lng });
      console.log('Beta target position updated: ', { lat, lng });
      // Update the target position state
    }
  };

  useEffect(() => {
    if (targetPosition) {
      setLineCoordinates(positions.filter((pos) => pos.lat && pos.lng));
    }
  }, [targetPosition, positions]);

  useEffect(() => {
    if (mapMode === 'result') {
      calculateDistances();
    }
  }, [mapMode, positions, targetPosition]);

  useEffect(() => {
    if (mapMode === 'beta-result') {
      calculateBetaDistances();
    }
  }, [mapMode, positions, betaTargetPosition]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps........</div>;

  //console.log({ isLoaded, loadError });

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onClick={handleMapClick} // Add click handler
      >
        {/* Map the lineCoordinates to draw dashed lines to the target coordinate */}
        {activePlayer === 3 &&
          lineCoordinates.map((coordinate, index) => (
            <DashedPolyline
              key={index}
              path={[coordinate, targetPosition]} // CHANGE THIS
              color="#FF00FF"
              dashLength="10px"
            />
          ))}

        {/* Render Player 1 and Player 2 markers */}
        {activePlayer === 3 && positions[0].lat && (
          <>
            <MarkerF
              position={positions[0]}
              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />
            {distances.player1 && (
              <InfoWindowF
                position={{
                  lat: positions[0].lat + 0.0005,
                  lng: positions[0].lng,
                }} // Offset latitude
                options={{
                  pixelOffset: new window.google.maps.Size(0, -20), // Optional adjustment
                }}
              >
                <div style={{ fontSize: '12px', color: 'black' }}>
                  Distance: {distances.player1}
                </div>
              </InfoWindowF>
            )}
          </>
        )}

        {activePlayer === 3 && positions[1].lat && (
          <>
            <MarkerF
              position={positions[1]}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
            {distances.player2 && (
              <InfoWindowF
                position={{
                  lat: positions[1].lat + 0.0005,
                  lng: positions[1].lng,
                }} // Offset latitude
                options={{
                  pixelOffset: new window.google.maps.Size(0, -20), // Optional adjustment
                }}
              >
                <div style={{ fontSize: '12px', color: 'black' }}>
                  Distance: {distances.player2}
                </div>
              </InfoWindowF>
            )}
          </>
        )}

        {/* BETA */}
        {/* Map the lineCoordinates to draw dashed lines to the target coordinate */}
        {activePlayer === 4 &&
          lineCoordinates.map((coordinate, index) => (
            <DashedPolyline
              key={index}
              path={[coordinate, betaTargetPosition]} // CHANGE THIS
              color="#FF00FF"
              dashLength="10px"
            />
          ))}

        {/* Render Player 1 and Player 2 markers */}
        {activePlayer === 4 && positions[0].lat && (
          <>
            <MarkerF
              position={positions[0]}
              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />
            {betaDistances.player1 && (
              <InfoWindowF
                position={{
                  lat: positions[0].lat + 0.0005,
                  lng: positions[0].lng,
                }} // Offset latitude
                options={{
                  pixelOffset: new window.google.maps.Size(0, -20), // Optional adjustment
                }}
              >
                <div style={{ fontSize: '12px', color: 'black' }}>
                  Distance: {betaDistances.player1}
                </div>
              </InfoWindowF>
            )}
          </>
        )}

        {activePlayer === 4 && positions[1].lat && (
          <>
            <MarkerF
              position={positions[1]}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
            {betaDistances.player2 && (
              <InfoWindowF
                position={{
                  lat: positions[1].lat + 0.0005,
                  lng: positions[1].lng,
                }} // Offset latitude
                options={{
                  pixelOffset: new window.google.maps.Size(0, -20), // Optional adjustment
                }}
              >
                <div style={{ fontSize: '12px', color: 'black' }}>
                  Distance: {betaDistances.player2}
                </div>
              </InfoWindowF>
            )}
          </>
        )}

        {/* END BETA */}
        {mapMode === 'result' && (
          <>
            <MarkerF
              position={targetPosition} // Placeholder marker
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          </>
        )}

        {/* Render markers for Player 1 and Player 2 */}
        {mapMode === 'input' && (
          <>
            {activePlayer === 1 && positions[0].lat && (
              <MarkerF
                position={positions[0]}
                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              />
            )}
            {activePlayer === 2 && positions[1].lat && (
              <MarkerF
                position={positions[1]}
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              />
            )}
          </>
        )}
        {mapMode === 'beta-result' && (
          <>
            <MarkerF
              position={betaTargetPosition} // Placeholder marker
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          </>
        )}
        {mapMode === 'beta' && (
          <>
            <MarkerF
              position={betaTargetPosition} // Placeholder marker
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          </>
        )}
      </GoogleMap>
    </>
  );
};

export default Map;
