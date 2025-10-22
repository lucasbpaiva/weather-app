const APIkey    = "Q6MWAXWQTYL4HW4QPLF86VA5M";
let unitGroup   = "metric";
const urlBase   = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
let queryParams = `unitGroup=${unitGroup}&key=${APIkey}&contentType=json`;
let weatherData;

async function getWeatherData(location) {
    let url = `${urlBase}/${location}?${queryParams}`;

    const response    = await fetch(url);
    const weatherData = await response.json();

    const address     = weatherData.resolvedAddress;
    const currentTemp = weatherData.currentConditions.temp;
    const conditions  = weatherData.currentConditions.conditions;
    const sunrise     = weatherData.currentConditions.sunrise.slice(0, -3);
    const sunset      = weatherData.currentConditions.sunset.slice(0, -3);
    const visibility  = weatherData.currentConditions.visibility;
    const windSpeed   = weatherData.currentConditions.windspeed;
    const pressure    = weatherData.currentConditions.pressure;
    const humidity    = weatherData.currentConditions.humidity;
    const feelsLike   = weatherData.currentConditions.feelslike;
    const uvindex     = weatherData.currentConditions.uvindex;
    const days        = weatherData.days;

    const processedData = { 
        currentTemp, conditions, sunrise, sunset, visibility, windSpeed, pressure, humidity, feelsLike, uvindex, address, days, 
    };
    console.log(weatherData);

    return processedData;
}

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        updateDisplay();
        cityInput.blur();
    }
});

searchBtn.addEventListener("click", () => {
    updateDisplay();
});

function updateDisplay() {
    weatherData = getWeatherData(cityInput.value); // This is a promise!
    cityInput.value = "";
    updateSunriseSunset();
    updateWindSpeed();
    updateVisibility();
    updateHumidity();
    updatePressure();
    updateFeelsLike();
    updateUVindex();
    updateTemperature();
    updateLocation();
    updateConditions();
    updateTenDayForecast();
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
        humidity.textContent = data.humidity + "%";
    });
}

const pressure = document.querySelector("#pressureVal");

function updatePressure() {
    weatherData.then((data) => {
        pressure.textContent = data.pressure;
    });
}

const feelsLike = document.querySelector("#feelsLikeVal");

function updateFeelsLike() {
    weatherData.then((data) => {
        feelsLike.textContent = data.feelsLike + "˚";
    });
}

const temperature = document.querySelector("#temperatureVal");

function updateTemperature() {
    weatherData.then((data) => {
        temperature.textContent = data.currentTemp + "˚";
    });
}

const address = document.querySelector("#location");

function updateLocation() {
    weatherData.then((data) => {
        address.textContent = data.address;
    });
}

const uvindex = document.querySelector("#uvindexVal");

function updateUVindex() {
    weatherData.then((data) => {
        uvindex.textContent = data.uvindex;
    });
}

const conditions = document.querySelector("#conditions");
const largeWeatherIcon = document.querySelector(".weather-icon-large");

function updateConditions() {
    weatherData.then((data) => {
        conditions.textContent = data.conditions;
        largeWeatherIcon.src = `images/${data.conditions}.png`;
    });
}

const forecastItems = document.querySelectorAll(".forecast-item");

function updateTenDayForecast() {
    weatherData.then((data) => {
        let index = 0;
        for (const item of forecastItems) {
            if (index > 0) {
                const weekday = item.querySelector(".weekday");
                const date = new Date(data.days[index].datetime);
                const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                weekday.textContent = weekdays[date.getUTCDay()];
            }

            const weatherIcon = item.querySelector(".weather-icon");
            let dailyConditions = data.days[index].conditions;
            if (dailyConditions.includes(",")) {
                dailyConditions = dailyConditions.split(",")[0];
            }
            weatherIcon.src = `images/${dailyConditions}.png`;

            const tempMin = item.querySelector(".min");
            const tempMax = item.querySelector(".max");
            tempMin.textContent = data.days[index].tempmin + "˚";
            tempMax.textContent = data.days[index].tempmax + "˚";

            index++;
        }
    });
}