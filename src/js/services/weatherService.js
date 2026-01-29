/**
 * Weather Service Module
 * Handles fetching weather data from Open-Meteo API
 * Uses fixed cafe location coordinates to determine menu offerings
 */

/**
 * Cafe location coordinates
 * These coordinates determine which menu items are displayed based on weather
 */
const cafeLocation = {
    latitude: 26.268723209022,
    longitude: -109.04000175228389
};

/**
 * Fetch current weather data from Open-Meteo API
 * @returns {Promise<{temperature: number, windSpeed: number, description: string}>} Weather data
 * @throws {string} Error message if API call fails
 */
async function fetchWeatherData() {
    try {
        // Build the API URL with cafe's fixed coordinates
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cafeLocation.latitude}&longitude=${cafeLocation.longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
        
        const response = await fetch(url);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract and structure the weather data
        return {
            temperature: data.current.temperature_2m,
            windSpeed: data.current.wind_speed_10m,
            weatherCode: data.current.weather_code,
            timezone: data.timezone
        };
    } catch (error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
}

/**
 * Get current weather for the cafe's location
 * This is the main function that should be called from other modules
 * @returns {Promise<{temperature: number, windSpeed: number, weatherCode: number, timezone: string}|{temperature: null, windSpeed: null, error: string}>} 
 * Weather data or error object with fallback values
 */
async function getWeather() {
    try {
        // Fetch weather data for the cafe's location
        const weatherData = await fetchWeatherData();
        
        return weatherData;
    } catch (error) {
        // Log the error for debugging
        console.error("Weather Service Error:", error);
        
        // Return a fallback object so the page doesn't break
        return {
            temperature: null,
            windSpeed: null,
            weatherCode: null,
            timezone: null,
            error: error.message
        };
    }
}

/**
 * Export functions for use in other modules
 * Supports both ES6 modules and traditional script inclusion
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getWeather, fetchWeatherData };
}
