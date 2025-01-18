import logo from "./logo.svg";
import "./App.css";
import Map from "./Map";

function App() {
  return (
    <div className="container">
      <div className="image-placeholder">
        <h2>Image Placeholder</h2>
        {/* Replace with an <img> tag if you have an actual image */}
      </div>
      <div className="map-container">
        <Map />
      </div>
    </div>
  );
}

export default App;
