import React, { useState } from 'react';
import EXIF from 'exif-js';

const PhotoUpload = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [photoLocation, setPhotoLocation] = useState(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Set image preview
      };
      reader.readAsDataURL(file);

      // Extract EXIF metadata
      EXIF.getData(file, function () {
        const lat = EXIF.getTag(this, 'GPSLatitude');
        const lng = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
        const lngRef = EXIF.getTag(this, 'GPSLongitudeRef');

        if (lat && lng) {
          const latitude = convertToDecimal(lat, latRef);
          const longitude = convertToDecimal(lng, lngRef);
          setPhotoLocation({ latitude, longitude });
        } else {
          alert('No GPS data found in this photo.');
        }
      });
    }
  };

  // Helper function to convert EXIF GPS data to decimal format
  const convertToDecimal = (coords, ref) => {
    const decimal = coords[0] + coords[1] / 60 + coords[2] / 3600;
    return ref === 'S' || ref === 'W' ? -decimal : decimal;
  };

  return (
    <div>
      <h1>Photo Upload</h1>
      <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      {imagePreview && (
        <div>
          <h2>Preview:</h2>
          <img
            src={imagePreview}
            alt="Uploaded"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
      {photoLocation && (
        <div>
          <h2>Photo Location:</h2>
          <p>Latitude: {photoLocation.latitude}</p>
          <p>Longitude: {photoLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
