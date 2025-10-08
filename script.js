const APIkey = "Q6MWAXWQTYL4HW4QPLF86VA5M";
let unitGroup = "metric";
const urlBase = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
let queryParams = `unitGroup=${unitGroup}&key=${APIkey}&contentType=json`;

async function getWeatherData(location) {
    let url = `${urlBase}/${location}?${queryParams}`;
    const response = await fetch(url);
    const weatherData = await response.json();

    const currentTemp = weatherData.currentConditions.temp;
    const sunrise = weatherData.currentConditions.sunrise;
    const sunset = weatherData.currentConditions.sunset;
    const visibility = weatherData.currentConditions.visibility;
    const windSpeed = weatherData.currentConditions.windspeed;
    const pressure = weatherData.currentConditions.pressure;
    const humidity = weatherData.currentConditions.humidity;
    const feelsLike = weatherData.currentConditions.feelslike;

    const processedData = { currentTemp, sunrise, sunset, visibility, windSpeed, pressure, humidity, feelsLike, };
    console.log(processedData);
}

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

cityInput.addEventListener("change", () => {
    getWeatherData(cityInput.value);
});

searchBtn.addEventListener("click", () => {
    getWeatherData(cityInput.value);
});