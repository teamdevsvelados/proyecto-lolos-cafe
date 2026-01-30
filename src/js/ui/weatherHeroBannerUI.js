
import { getWeather } from "../services/weatherService.js";

(() => {
  
  function updateHeroByTemperature(temperature) {
    const tempElement = document.getElementById("weather-temp");
    const iconElement = document.getElementById("weather-icon");
    const heroImage = document.getElementById("hero-image");
    const heroTitle = document.getElementById("hero-title");
    const heroText = document.getElementById("hero-text");

    tempElement.textContent = `${Math.round(temperature)}°C`;

    if (temperature < 12) {
      iconElement.src = "/public/images/hero-banner/icon-weather/cold.png";
      heroImage.src = "/public/images/hero-banner/lolos-banner-cold.png";
      heroTitle.textContent = "Un abrazo en cada sorbo";
      heroText.textContent = "Cafés y bebidas calientes pensadas para reconfortar, entrar en calor y acompañar los días fríos.";
    }
    
    else if (temperature >= 12 && temperature < 25) {
      iconElement.src = "/public/images/hero-banner/icon-weather/cloudy.png";
      heroImage.src = "/public/images/hero-banner/lolos-banner-temp.png";
      heroTitle.textContent = "Todo tipo de bebida para tu mood";
      heroText.textContent = "Siente el clima perfecto mientras disfrutas de nuestra selección de bebidas calientes y refrescantes.";
    } 
    
    else {
      iconElement.src = "/public/images/hero-banner/icon-weather/sun.png";
      heroImage.src = "/public/images/hero-banner/lolos-banner-sun.png";
      heroTitle.textContent = "El plan perfecto para los días de calor";
      heroText.textContent = "Frappés y bebidas a las rocas pensadas para refrescarte al instante y acompañar cualquier momento del día.";
    }
  }
 
  async function initHeroWeather() {
    try {
      const weather = await getWeather();
      console.log("Clima recibido:", weather); 
      if (weather.temperature == null) return;
      updateHeroByTemperature(weather.temperature);
    } catch (error) {
      console.error("Error actualizando hero:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", initHeroWeather);
})();
