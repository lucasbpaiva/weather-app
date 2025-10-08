const APIkey    = "Q6MWAXWQTYL4HW4QPLF86VA5M";
let unitGroup   = "metric";
const urlBase   = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
let queryParams = `unitGroup=${unitGroup}&key=${APIkey}&contentType=json`;
let weatherData;

async function getWeatherData(location) {
    let url = `${urlBase}/${location}?${queryParams}`;

    const response    = await fetch(url);
    const weatherData = await response.json();

    const currentTemp = weatherData.currentConditions.temp;
    const sunrise     = weatherData.currentConditions.sunrise.slice(0, -3);
    const sunset      = weatherData.currentConditions.sunset.slice(0, -3);
    const visibility  = weatherData.currentConditions.visibility;
    const windSpeed   = weatherData.currentConditions.windspeed;
    const pressure    = weatherData.currentConditions.pressure;
    const humidity    = weatherData.currentConditions.humidity;
    const feelsLike   = weatherData.currentConditions.feelslike;

    const processedData = { currentTemp, sunrise, sunset, visibility, windSpeed, pressure, humidity, feelsLike, };
    console.log(weatherData);

    return processedData;
}

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        updateDisplay();
    }
});

searchBtn.addEventListener("click", () => {
    updateDisplay();
});

function updateDisplay() {
    weatherData = getWeatherData(cityInput.value); // This is a promise!
    updateSunriseSunset();
    updateWindSpeed();
}

const sunriseDisplay = document.querySelector("#sunriseDisplay");
const sunsetDisplay  = document.querySelector("#sunsetDisplay");

function updateSunriseSunset() {
    weatherData.then((data) => {
        sunriseDisplay.textContent = data.sunrise;
        sunsetDisplay.textContent = data.sunset;
    });
}

const windSpeedVal = document.querySelector("#windSpeedVal");

function updateWindSpeed() {
    weatherData.then((data) => {
        windSpeedVal.textContent = data.windSpeed + " km/h";
    });
}