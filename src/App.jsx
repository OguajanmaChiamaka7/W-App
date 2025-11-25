import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const apiKey =
        import.meta.env.VITE_WEATHER_API_KEY ||
        import.meta.env.VITE_WEATHER_KEY;

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 404) throw new Error("City not found");
        throw new Error("Unable to fetch weather");
      }

      const json = await res.json();

      setData({
        name: json.name,
        country: json.sys.country,
        temp: json.main.temp,
        feels: json.main.feels_like,
        desc: json.weather[0].description,
        main: json.weather[0].main,
        icon: json.weather[0].icon,
        wind: json.wind.speed,
      });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Determine background class based on weather
  let bgClass = "bg-default";
  if (data) {
    const main = data.main.toLowerCase();
    if (main.includes("cloud")) bgClass = "bg-cloudy";
    else if (main.includes("rain")) bgClass = "bg-rain";
    else if (main.includes("clear")) bgClass = "bg-sunny";
    else if (main.includes("snow")) bgClass = "bg-snow";
  }

  return (
    <div className={`app-container ${bgClass}`}>
      <div className="container">
        <h1>Weather App</h1>

        <form onSubmit={getWeather} className="form">
          <input
            type="text"
            placeholder="Enter city e.g Lagos"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button disabled={loading}>{loading ? "..." : "Search"}</button>
        </form>

        {error && <p className="error">{error}</p>}

        {data && (
          <div className="card">
            <h2>
              {data.name}, {data.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt="weather-icon"
            />
            <p className="description">{data.desc}</p>
            <h3>{data.temp}°C</h3>
            <p>Feels like {data.feels}°C</p>
            <p>💨 Wind: {data.wind} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
