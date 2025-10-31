const APIkey    = "Q6MWAXWQTYL4HW4QPLF86VA5M";
let unitGroup   = "metric";
const urlBase   = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
let queryParams = `unitGroup=${unitGroup}&elements=add:aqius&key=${APIkey}&contentType=json`;
let weatherData;

async function getWeatherData(location) {
    let url = `${urlBase}/${location}?${queryParams}`;

    const response    = await fetch(url);
    const weatherData = await response.json();

    const address     = weatherData.resolvedAddress;
    const aqi         = weatherData.currentConditions.aqius;
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
    const currentHour = new Date().getHours();
    const hours       = days[0].hours.slice(currentHour).concat(days[1].hours.slice(0, currentHour));
    const description = weatherData.description;

    const processedData = { 
        aqi,
        currentTemp, 
        conditions, 
        sunrise, 
        sunset, 
        visibility, 
        windSpeed, 
        pressure, 
        humidity, 
        feelsLike, 
        uvindex, 
        address, 
        days, 
        hours,
        description,
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
    updateAQindex();
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
    updateHourlyForecast();

    weatherData.then((data) => {
        console.log(data.hours);
    });
}

const aqindex = document.querySelector("#aqiVal");
const airCondition = document.querySelector(".air-condition")

function updateAQindex() {
    weatherData.then((data) => {
        const aqiValue = data.aqi;
        aqindex.textContent = aqiValue;

        if (aqiValue <= 50) {
            airCondition.textContent = "Good";
            airCondition.className = "air-condition"; //keep only this class and remove others
            airCondition.classList.add("aqi-1");
        } else if (aqiValue <= 100) {
            airCondition.textContent = "Moderate";
            airCondition.className = "air-condition"; //keep only this class and remove others
            airCondition.classList.add("aqi-2");
        } else if (aqiValue <= 150) {
            airCondition.textContent = "Unhealthy for sensitive groups";
            airCondition.className = "air-condition"; //keep only this class and remove others
            airCondition.classList.add("aqi-3");
        } else if (aqiValue <= 200) {
            airCondition.textContent = "Unhealthy";
            airCondition.className = "air-condition"; //keep only this class and remove others
            airCondition.classList.add("aqi-4");
        } else if (aqiValue <= 300) {
            airCondition.textContent = "Very unhealthy";
            airCondition.className = "air-condition"; //keep only this class and remove others
            airCondition.classList.add("aqi-5");
        } else {
            airCondition.textContent = "Hazardous";
            airCondition.className = "air-condition"; //keep only this class and remove others
            airCondition.classList.add("aqi-6");
        }
    });
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
        windSpeedVal.textContent = data.windSpeed;
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

const conditionsDisplay = document.querySelector("#conditions");
const largeWeatherIcon = document.querySelector(".weather-icon-large");

function updateConditions() {
    weatherData.then((data) => {
        let cond = data.conditions;
        if (cond.includes(",")) {
            cond = cond.split(",")[0];
        }
        conditionsDisplay.textContent = cond;
        largeWeatherIcon.src = `images/${cond}.png`;
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

function updateHourlyForecast() {
    const hourlyForecast = document.querySelector(".hourly-items-container");
    hourlyForecast.replaceChildren(); //remove all child nodes

    weatherData.then((data) => {
        const description = document.querySelector(".description");
        description.textContent = data.description;

        for (let i = 0; i < 24; i++) {
            const item = document.createElement("div");
            item.classList.add("hour-item");

            const hour = document.createElement("p");
            hour.textContent = (i === 0) ? "Now" : data.hours[i].datetime.slice(0, 2);

            const weatherIcon = document.createElement("img");
            weatherIcon.classList.add("weather-icon");
            let conditions = data.hours[i].conditions;
            if (conditions.includes(",")) {
                conditions = conditions.split(",")[0];
            }
            weatherIcon.src = `images/${conditions}.png`;
            weatherIcon.alt = conditions;

            const temperature = document.createElement("p");
            temperature.textContent = `${data.hours[i].temp}˚`;

            item.append(hour, weatherIcon, temperature);
            hourlyForecast.appendChild(item);
        }
    });
}