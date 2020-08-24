const {
  getCity,
  getLocation
} = require('../lib/ipdata.js');

const {
  getForecastByCity
} = require('../lib/weather.js');

/**
 * Forecast controller.
 * @param {object} req request object.
 * @returns {Promise}.
 */
const fetchForecast = async (city=false,ip)=>{

  //Get the current city or the location info.
  const location = await (city?getCity():getLocation(ip));
  
  //Get the city name.
  const cityName = city?location:location.city;

  //Get the city weather condition for the next 5 days.
  const forecastInfo = await getForecastByCity(cityName);

  return {
    city: location,
    forecast: forecastInfo
  };

};

module.exports = {
  fetchForecast
};