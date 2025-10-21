const APIkey    = "Q6MWAXWQTYL4HW4QPLF86VA5M";
let unitGroup   = "metric";
const urlBase   = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
let queryParams = `unitGroup=${unitGroup}&key=${APIkey}&contentType=json`;
let weatherData;

async function getWeatherData(location) {
    let url = `${urlBase}/${location}?${queryParams}`;

    const response    = await fetch(url);
    const weatherData = await response.json();

    const address    = weatherData.resolvedAddress;
    const currentTemp = weatherData.currentConditions.temp;
    const sunrise     = weatherData.currentConditions.sunrise.slice(0, -3);
    const sunset      = weatherData.currentConditions.sunset.slice(0, -3);
    const visibility  = weatherData.currentConditions.visibility;
    const windSpeed   = weatherData.currentConditions.windspeed;
    const pressure    = weatherData.currentConditions.pressure;
    const humidity    = weatherData.currentConditions.humidity;
    const feelsLike   = weatherData.currentConditions.feelslike;

    const processedData = { currentTemp, sunrise, sunset, visibility, windSpeed, pressure, humidity, feelsLike, address, };
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
    updateVisibility();
    updateHumidity();
    updatePressure();
    updateFeelsLike();
    updateTemperature();
    updateLocation();
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

const visibility = document.querySelector("#visibilityVal");

function updateVisibility() {
    weatherData.then((data) => {
        visibility.textContent = data.visibility + " km";
    });
}

const humidity = document.querySelector("#humidityVal");

function updateHumidity() {
    weatherData.then((data) => {
        humidity.textContent = data.humidity + " %";
    });
}

const pressure = document.querySelector("#pressureVal");

function updatePressure() {
    weatherData.then((data) => {
        pressure.textContent = data.pressure + " hPa";
    });
}

const feelsLike = document.querySelector("#feelsLikeVal");

function updateFeelsLike() {
    weatherData.then((data) => {
        feelsLike.textContent = data.feelsLike + "˚C";
    });
}

const temperature = document.querySelector("#temperatureVal");

function updateTemperature() {
    weatherData.then((data) => {
        temperature.textContent = data.currentTemp + "˚C";
    });
}

const address = document.querySelector("#location");

function updateLocation() {
    weatherData.then((data) => {
        address.textContent = data.address;
    });
}