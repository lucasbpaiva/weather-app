# ☁️ Weather App

This is a dynamic, modern weather dashboard built with HTML, CSS, and plain JavaScript. I developed this project to deepen my understanding of asynchronous JavaScript concepts, specifically **`fetch` requests**, **Promises**, and **`async`/`await` functions**, which are critical skills for any web development role.

## ✨ Key Features

  * **Real-time Weather Data:** Fetches current conditions, daily forecasts, and hourly forecasts from the Visual Crossing Weather API.
  * **Geolocation Support:** Uses the browser's native Geolocation API to get the weather for the user's current location.
  * **Reverse Geocoding:** Integrates the Nominatim API to convert GPS coordinates (latitude, longitude) into a human-readable city name, ensuring a seamless user experience.
  * **Asynchronous Loading State:** Implements a loading overlay with a spinner to handle network latency and provide visual feedback during API requests.
  * **Metric/Imperial Toggle:** Allows users to switch between Celsius, km/h (`metric`) and Fahrenheit, mi/h (`us`) units using an interactive toggle.
  * **Interactive Hourly Forecast:** Features a hidden scrollbar with trackpad or **directional button** scrolling for an accessive and intuitive user experience.
  * **Dynamic UI:** The background colors dynamically change based on the current weather conditions and time of day (day/night).

## 🚀 Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Core structure and semantic markup. |
| **CSS3** | Styling, layout (Flexbox & Grid), and scrollbar customization. |
| **JavaScript (ES6+)** | Core logic and API integration. |
| **Visual Crossing Weather API** | Provides comprehensive weather data. |
| **Nominatim (OpenStreetMap)** | Used for reverse geocoding (converting coordinates to human-readable addresses). |