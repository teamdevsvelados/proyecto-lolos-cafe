
/**
 * Weather Service Module
 * Handles fetching weather data from Open-Meteo API
 * Uses fixed cafe location coordinates to determine menu offerings
 */

/**
 * Cafe location coordinates
 * These coordinates determine which menu items are displayed based on weather
 */

window.WeatherService = {
  cafeLocation: {
    //warm
    //latitude: 1.3521,
    //longitude: 103.81

    //cold
    //latitude: 64.1355,
    //longitude: -21.8954

    //Lolo's
    latitude: 26.268723209022,
    longitude: -109.04000175228389
  },

  fetchWeatherData: async function () {
    // Build the API URL with cafe's fixed coordinates
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.cafeLocation.latitude}&longitude=${this.cafeLocation.longitude}&current_weather=true&timezone=auto`;
      const response = await fetch(url);

      // Check if the response is successful
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();

      // Extract and structure the weather data
      return {
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        weatherCode: data.current_weather.weathercode,
        timezone: data.timezone
      };
    } catch (error) {
      // Log the error for debugging
      console.error("WeatherService Error:", error);
      // Return a fallback object so the page doesn't break
      return {
        temperature: null,
        windSpeed: null,
        weatherCode: null,
        timezone: null,
        error: error.message
      };
    }
  },

  getWeather: async function () {
    return await this.fetchWeatherData();
  }
};

