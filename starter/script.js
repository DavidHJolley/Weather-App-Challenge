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
const forecastTitle = document.querySelector("#five-day-title");
var forecastTemplate = document.querySelector("#forecast-template");


if(localStorage){
  ShowHistory();
}
console.log(localStorage);

searchForm.addEventListener("submit", function(event) {
  event.preventDefault(); // prevent page refresh
});

searchButton.addEventListener("click", function(){
  fetchWeatherData(document.querySelector('#search-input').value);
  AddCity(document.querySelector('#search-input').value);
  ShowForecast(document.querySelector('#search-input').value)
})

function ShowForecast(city) {
  console.log("Forecast button clicked");

  // Show or hide the forecast title depending on its current state
  if (forecast.classList.contains("d-none")) {
    forecastTitle.classList.remove("d-none");
  } else {
    forecastTitle.classList.add("d-none");
  }

  // Get the current date
  var date = moment();

  // Build the forecast URL using the city parameter
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`;

  // Fetch the forecast data from the API
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      // Use the data to display the 5-day forecast
      var forecastContainer = document.querySelector("#forecast-container");
      var currentDate = moment();

      // Remove any existing forecast elements
      forecastContainer.innerHTML = "";

      // Loop through the forecast data and create an element for each day
      for (let i = 0; i < 5; i++) {
        var forecastDate = currentDate.format("ddd");
        currentDate.add(1, "day");
        var forecastIcon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        var forecastTemp = data.list[i].main.temp;
        var forecastHumidity = data.list[i].main.humidity;
        var forecastWindSpeed = data.list[i].wind.speed;

        // Create a copy of the template for this day of forecast
        var forecastElement = forecastTemplate.content.cloneNode(true);

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
    .catch((error) => {
      // Handle errors
    });
}



// get everything from the history array and put it inito local storage

// get local storage, loop through each item and add new prototype div to html


function ShowHistory(){
  const template = document.querySelector("#history-template");
  const historyContainer = document.querySelector("#history-container");

  // Get the history from localStorage
  const history = JSON.parse(localStorage.getItem("history")) || [];

  // Limit history to a maximum of 4 cities
  if (history.length > 4) {
    history.splice(0, history.length - 4);
    localStorage.setItem("history", JSON.stringify(history));
  }

  // Iterate over the history to create the history buttons
  for(let i=0; i<history.length; i++){
    const city = history[i];
    
    // Create a copy of the template for this city
    const historyElement = template.content.cloneNode(true);

    // Set the text content of the button to the city name
    historyElement.querySelector(".history-name").textContent = city;

    // Add an event listener to the button
    historyElement.querySelector(".history-button").addEventListener("click", function() {
      fetchWeatherData(city);
      ShowForecast(city);
    });
    

    historyContainer.appendChild(historyElement);
  }
}

function AddCity(city) {
  // Get the history from localStorage
  const history = JSON.parse(localStorage.getItem("history")) || [];

  // Check if city is already in history
  if (history.includes(city)) {
    return;
  }
  // Check if input is null
  if(city == null){
    return;
  }
  

  // Add city to history
  history.push(city);

  // If there are more than 4 cities in history, remove the oldest city
  if (history.length > 4) {
    const historyContainer = document.querySelector("#history-container");
    historyContainer.removeChild(historyContainer.childNodes[0]);
    history.shift();
  }

  localStorage.setItem("history", JSON.stringify(history));

  // Create new history button
  const template = document.querySelector("#history-template");
  const historyContainer = document.querySelector("#history-container");

  const historyElement = template.content.cloneNode(true);
  historyElement.querySelector(".history-name").textContent = city;
  historyContainer.appendChild(historyElement);
}


function fetchWeatherData(city){
  // push city to array then add city to history
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

      var history = JSON.parse(localStorage.getItem("city")) || [];
      history.push(cityName);
      console.log(cityName);
      localStorage.setItem("city", JSON.stringify(history));

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

  
}