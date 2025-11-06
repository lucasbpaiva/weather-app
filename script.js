const APIkey    = "Q6MWAXWQTYL4HW4QPLF86VA5M";
let unitGroup   = "metric";
const urlBase   = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
let queryParams = `unitGroup=${unitGroup}&elements=add:aqius&key=${APIkey}&contentType=json`;
let weatherData;
let city;
const loadingComponent = document.querySelector("#loadingOverlay");

async function getWeatherData(location) {
    loadingComponent.style.display = "flex";

    let url = `${urlBase}/${location}?${queryParams}`;

    const response    = await fetch(url);
    const weatherData = await response.json();

    const address     = capitalizeWords(weatherData.address);
    const aqi         = weatherData.currentConditions.aqius;
    const sunrise     = weatherData.currentConditions.sunrise.slice(0, -3);
    const sunset      = weatherData.currentConditions.sunset.slice(0, -3);
    const visibility  = weatherData.currentConditions.visibility;
    const windSpeed   = weatherData.currentConditions.windspeed;
    const pressure    = weatherData.currentConditions.pressure;
    const humidity    = weatherData.currentConditions.humidity;
    const feelsLike   = Math.round(weatherData.currentConditions.feelslike);
    const uvindex     = weatherData.currentConditions.uvindex;
    const days        = weatherData.days;
    const tzoffset    = weatherData.tzoffset;
    const currentHour = getCurrentHourInLocation(tzoffset);
    const hours       = days[0].hours.slice(currentHour).concat(days[1].hours.slice(0, currentHour));
    const currentTemp = Math.round(hours[0].temp);
    const description = weatherData.description;
    let conditions    = weatherData.currentConditions.conditions;
    if (conditions.includes(",")) { //ex: "Rain, Overcast"
        conditions = conditions.split(",")[0];
        if (conditions.includes("/")) { //ex: "Freezing Drizzle/Freezing Rain"
            conditions = conditions.split("/")[1];
        }
    }

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
        currentHour, 
        hours,
        description,
    };
    console.log(weatherData);

    loadingComponent.style.display = "none";

    return processedData;
}

function getCurrentHourInLocation(offset) {
    const currentUTCHour = new Date().getUTCHours();
    const currentLocal = (currentUTCHour + offset + 24) % 24;
    return currentLocal;
}

function capitalizeWords(sentence) {
    return sentence
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

cityInput.addEventListener("input", () => {
    city = cityInput.value;
});

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
    weatherData = getWeatherData(city); // This is a promise!
    cityInput.value = "";
    updateBgColor();
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

const htmlBody = document.querySelector("body");
const cards = document.querySelectorAll(".card");

function updateBgColor() {
    weatherData.then((data) => {
        if (data.currentHour < 6 || data.currentHour >= 18) {
            htmlBody.style.backgroundColor = "var(--bg-color1)";
            cityInput.style.backgroundColor = "var(--bg-color2)";
            cards.forEach((card) => {
                card.style.backgroundColor = "var(--bg-color2)";
            });
        } else if (data.conditions === "Clear") {
            htmlBody.style.backgroundColor = "var(--bg-blue)";
            cityInput.style.backgroundColor = "var(--card-blue)";
            cards.forEach((card) => {
                card.style.backgroundColor = "var(--card-blue)";
            });
        } else {
            htmlBody.style.backgroundColor = "var(--bg-gray)";
            cityInput.style.backgroundColor = "var(--card-gray)";
            cards.forEach((card) => {
                card.style.backgroundColor = "var(--card-gray)";
            });
        }
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
        let unit = unitGroup === "metric" ? " km/h" : " mi/h";
        windSpeedVal.textContent = data.windSpeed + unit;
    });
}

const visibility = document.querySelector("#visibilityVal");

function updateVisibility() {
    weatherData.then((data) => {
        let unit = unitGroup === "metric" ? " km" : " mi";
        visibility.textContent = data.visibility + unit;
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
        conditionsDisplay.textContent = cond;
        const currentHour = data.currentHour;
        if ((cond === "Clear" || cond === "Partially cloudy") && (currentHour < 6 || currentHour >= 18)) {
            cond += "-night";
        }
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
                if (dailyConditions.includes("/")) { //ex: "Freezing Drizzle/Freezing Rain"
                    dailyConditions = dailyConditions.split("/")[1];
                }
            }
            weatherIcon.src = `images/${dailyConditions}.png`;

            const tempMin = item.querySelector(".min");
            const tempMax = item.querySelector(".max");
            tempMin.textContent = Math.round(data.days[index].tempmin) + "˚";
            tempMax.textContent = Math.round(data.days[index].tempmax) + "˚";

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
            const datetimeHour = data.hours[i].datetime.slice(0, 2);
            hour.textContent = (i === 0) ? "Now" : datetimeHour;

            const weatherIcon = document.createElement("img");
            weatherIcon.classList.add("weather-icon");
            let conditions = data.hours[i].conditions;
            if (conditions.includes(",")) {
                conditions = conditions.split(",")[0];
                if (conditions.includes("/")) { //ex: "Freezing Drizzle/Freezing Rain"
                    conditions = conditions.split("/")[1];
                }
            }
            if ((conditions === "Clear" || conditions === "Partially cloudy") && (datetimeHour < 6 || datetimeHour >= 18)) {
                conditions += "-night";
            }
            weatherIcon.src = `images/${conditions}.png`;
            weatherIcon.alt = conditions;

            const temperature = document.createElement("p");
            temperature.textContent = Math.round(data.hours[i].temp) + "˚";

            item.append(hour, weatherIcon, temperature);
            hourlyForecast.appendChild(item);
        }
    });
}

// Celsius/Fahrenheit switch logic ----------------------------------------------

const switchButton   = document.querySelector('.switch-button');
const switchBtnRight = document.querySelector('.switch-button-case.right');
const switchBtnLeft  = document.querySelector('.switch-button-case.left');
const activeSwitch   = document.querySelector('.active');

function switchToCelsius(){
	switchBtnRight.classList.remove('active-case');
	switchBtnLeft.classList.add('active-case');
	activeSwitch.style.left = '0%';
	activeSwitch.style.borderRadius = "20px 0 0 20px";

    unitGroup = "metric";
    queryParams = `unitGroup=${unitGroup}&elements=add:aqius&key=${APIkey}&contentType=json`;
    updateDisplay();
}

function switchToFahrenheit(){
	switchBtnRight.classList.add('active-case');
	switchBtnLeft.classList.remove('active-case');
	activeSwitch.style.left = '50%';
	activeSwitch.style.borderRadius = "0 20px 20px 0";

    unitGroup = "us";
    queryParams = `unitGroup=${unitGroup}&elements=add:aqius&key=${APIkey}&contentType=json`;
    updateDisplay();
}

switchBtnLeft.addEventListener('click', function(){
	switchToCelsius();
}, false);

switchBtnRight.addEventListener('click', function(){
	switchToFahrenheit();
}, false);

// geolocation --------------------------------------------------------------------------------------
const locationBtn = document.querySelector("#locationBtn");

locationBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            city = await getAddressFromCoords(lat, lon);
            updateDisplay();
        });
    } else {
        alert("It seems geolocation is not available in your browser.");
    }
});

async function getAddressFromCoords(lat, lon) {
    let nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
        const response = await fetch(nominatimUrl);
        if (!response.ok) {
            throw new Error(`Reverse Geocoding failed with status: ${response.status}`);
        }
        const data = await response.json();

        const address = data.address;
        if (address.city) return address.city;
        if (address.town) return address.town;
        if (address.village) return address.village;

        // Fallback to full display name e.g. "London, Greater London, England, SW1A 2DU, United Kingdom"
        return data.display_name.split(",")[0] || "Your Location";

    } catch (error) {
        console.error("Reverse geocoding error: ", error);
        // Fallback to coordinates on error
        return `${lat},${lon}`;
    }
}

// scroll button for hourly forecast

const hourlyItemsContainer = document.querySelector(".hourly-items-container");
const scrollLeftBtn = document.querySelector("#scrollLeftBtn");
const scrollRightBtn = document.querySelector("#scrollRightBtn");
const scrollAmount = 300; // Scroll distance in pixels

scrollLeftBtn.addEventListener("click", () => {
    hourlyItemsContainer.scrollBy(-scrollAmount, 0);
});

scrollRightBtn.addEventListener("click", () => {
    hourlyItemsContainer.scrollBy(scrollAmount, 0);
});