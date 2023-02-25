const searchButton = document.querySelector("#search-button");
const key = "861d8ddf9f661771f0f281f3ad67bbc1";
const domCity = document.querySelector("#city");
const domDate = document.querySelector("#date");
const domIcon = document.querySelector("#icon");
const domTemp = document.querySelector("#temp");
const domHumidity = document.querySelector("#humidity");
const domWind = document.querySelector("#wind");
const forecast = document.querySelector("#forecast-search-button"); 

const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", function(event) {
  event.preventDefault(); // prevent page refresh
})

searchButton.addEventListener("click", function() {
    var city = document.querySelector('#search-input').value;
    var date = moment();
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    
    // Fetch current weather data
    fetch(currentUrl)
    .then(response => response.json())
    .then(data => {
        // Use the data to display the current weather conditions
        const cityName = data.name;
        const date = moment.unix(data.dt).format("MMMM Do YYYY, h:mm:ss a");
        const icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        // Display the weather conditions in the UI

        domCity.textContent = "City: " + cityName;
        domDate.textContent = "Date: " + date;
        domIcon.src = icon;
        domTemp.textContent = "Temperature: " + temp + "Degrees";
        domHumidity.textContent = "Humidity: " + humidity;
        domWind.textContent = "Windspeed: " + windSpeed;
    })
    .catch(error => {
        // Handle errors
    });

    // Fetch 5-day forecast data
    
    
})

forecast.addEventListener("click", function() {
    var city = document.querySelector('#search-input').value;
    var date = moment();
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`;
    fetch(forecastUrl)
  .then(response => response.json())
  .then(data => {
    // Use the data to display the 5-day forecast
    const forecastContainer = document.querySelector("#forecast-container");
    const template = document.querySelector("#forecast-template");
    var currentDate = moment();

    // Remove any existing forecast elements
    forecastContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      const forecastDate = currentDate.format("ddd");
      currentDate.add(1, "day");
      const forecastIcon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
      const forecastTemp = data.list[i].main.temp;
      const forecastHumidity = data.list[i].main.humidity;
      const forecastWindSpeed = data.list[i].wind.speed;

      // Create a copy of the template for this day of forecast
      const forecastElement = template.content.cloneNode(true);

      // Update the content of the forecast element with the forecast data
      forecastElement.querySelector(".forecast-date").textContent = forecastDate;
      forecastElement.querySelector(".forecast-icon").src = forecastIcon;
      forecastElement.querySelector(".forecast-temp").textContent = `Temperature: ${forecastTemp} Degrees`;
      forecastElement.querySelector(".forecast-humidity").textContent = `Humidity: ${forecastHumidity}`;
      forecastElement.querySelector(".forecast-wind").textContent = `Windspeed: ${forecastWindSpeed}`;

      // Add the forecast element to the container
      forecastContainer.appendChild(forecastElement);
    }
  })
  .catch(error => {
    // Handle errors
  });
})


