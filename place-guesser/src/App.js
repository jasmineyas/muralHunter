import "./App.css";
import Map from "./Map";
import placeholder from "./place-holder.jpg";

function App() {
  return (
    <div className="container">
      <div className="image-panel">
        <div className="content">
          <h1>Guess the mural's location </h1>
          <p>
            {" "}
            On the map, pleaes drop the pin at where you think the mural is
            located, then click the submit button.📍
          </p>
          <img src={placeholder} alt="placeholder" />
          <button>Submit</button>
        </div>
      </div>
      <div className="map-container">
        <Map />
      </div>
    </div>
  );
}

export default App;
