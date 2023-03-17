import React, { useState, useEffect } from "react";
import calendar from "./icons/calendar.svg";
import clock from "./icons/clock.svg";
import temp from "./icons/temp.svg";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useReactPWAInstall } from "react-pwa-install";
import myLogo from "./icons/icon512.png";

function App() {
  /**
   * J'ai utilisé l'API meteo source pour afficher la data météo
   * tu peux faire un nouveau compte sur https://www.meteosource.com et avoir ton propre API_KEY sinon tu peux utiliser le mien 😁
  */
  // Constants:
  const api_key = "2768kcpxtraqa6wtgmsbrclyjz8428l5y6i53gir";
  const api_url = `https://www.meteosource.com/api/v1/free/point?place_id=paris&sections=all&timezone=UTC&language=en&units=metric&key=${api_key}`;

  // State:
  const [dateState, setDateState] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({});
  const [network, setNetwork] = useState(window.navigator.onLine);
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

  const checkLocalStorage = () => {
    let data = localStorage.getItem("@weather");
    console.log("aza",data);
    if(data) {
      setWeatherData(JSON.parse(data));
    };
  }
  
  const getWeatherData = () => {
    axios.get(api_url)
    .then((response) => {
      // console.log("J'appelle un serveur", response.data);
      localStorage.setItem("@weather", JSON.stringify(response.data));
      setWeatherData(response.data)
      setTimeout(() => {
        setLoading(false);
      }, 1000); 
    })
    .catch(() => {
      checkLocalStorage();
      setTimeout(() => {
        setLoading(false);
      }, 1000); 
    });
  };

  const updateNetwork = () => {
    setNetwork(window.navigator.onLine);
  };

  const handleInstall = () => {
    pwaInstall({
      title: "Avec weather app vous pouvez consulter",
      logo: myLogo,
      features: (
        <ul>
          <li>La data</li>
          <li>Le temps</li>
          <li>La température</li>
        </ul>
      ),
      description: "Support me and INSTALL my weather app 😁",
    })
    .then(() => alert("Appli installé avec succés 😁"))
    .catch(() => alert("Installation annulée 😥"));
  };
  
  useEffect(() => {
    window.addEventListener("offline", updateNetwork);
    window.addEventListener("online", updateNetwork);
    return () => {
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("online", updateNetwork);
    };
  });

  useEffect(() => {
    getWeatherData();
  }, []);

  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {/* Connection State */}
          <h4>Connection State: {network ? "Connected" : "Disconnected"}</h4>
          
          {/* Date & Time */}
          <h4>Today is</h4>
          <div className="Time-container">
            <img src={calendar} className="icon" alt="calendar" />
            <p>
              {" "}
              {dateState.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <img src={clock} className="icon" alt="clock" />
            <p>
              {dateState.toLocaleString("fr-FR", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
              })}
            </p>
          </div>
        </div>
          
        {/* Weather API Data */}
        {!loading ? (
          <div>
            <h4>Weather in Paris Now</h4>
            <p> <img src={temp} className="icon" alt="temp" />{weatherData?.current?.summary}</p>
            <p> <img src={temp} className="icon" alt="temp" />{weatherData?.current?.temperature} degrees</p>
          </div>
        ) 
        : 
        (
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        )}

        {/* Installation GUIDE */}
        <div>
          <h4>Installation guide</h4>
          <p>is browser supported ? : {supported() + ""}</p>
          <p>is app already installed ? : {isInstalled() + ""}</p>
        </div>
        {supported() && !isInstalled() && (
          <div>
            <button class="button-38" onClick={handleInstall}>Install Me 😁</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
