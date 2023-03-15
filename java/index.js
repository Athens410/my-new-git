let now = new Date();
let h2 = document.querySelector("h2");
let date = now.getDate();
let month = now.getMonth();
let year = now.getFullYear();
let dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
  now
);
let hours = now.getHours();
let minutes = now.getMinutes();
if (month === 2) {
  month = "March";
}
h2.innerHTML = `Today is ${dayOfWeek}, ${month} ${date}, ${hours}:${minutes}, ${year}`;

let apiKey = "c75a59350314fa95778c2435a9112873";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather";













async function getWeatherData(city, latitude = null, longitude = null) {
  try {
    let url = `${apiUrl}?q=${city}&units=metric&appid=${apiKey}`;
    if (latitude && longitude) {
      url = `${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    }
    let response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    return null;
  }
}

async function updateHeading(city, latitude = null, longitude = null) {
  let h3 = document.querySelector("h3");
  let h4 = document.querySelector("h4");
   let iconElement = document.querySelector("#icon");
  
   
   
  try {
    let data = await getWeatherData(city, latitude, longitude);
    let temperature = data.main.temp;
    let precipitation = data.weather[0].description;
    let humidity = data.main.humidity;
    
    
    
   
    h4.innerHTML = `It is ${temperature}°C in ${city}`;
    h3.innerHTML = `Precipitation: ${precipitation} | Humidity: ${humidity}%`;
    let iconCode = data.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.setAttribute("src", iconUrl);

    
  } catch (error) {
    h4.innerHTML = `Could not retrieve weather data for ${city}`;
    h3.innerHTML = "";
  }
   
       


  
}
updateHeading("North Carolina");

let pressButton = document.querySelector(".pressButton");
pressButton.addEventListener("click", function () {
  let searchInput = document.querySelector("#city-input").value;
  if (searchInput) {
    updateHeading(searchInput);
  }
});

let cityInput = document.querySelector("#city-input");
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let searchInput = document.querySelector("#city-input").value;
    if (searchInput) {
      updateHeading(searchInput);
    }
  }
});
let currentLocationButton = document.querySelector("#search-button");
currentLocationButton.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      try {
        let response = await axios.get(
          `${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        let temperature = response.data.main.temp;
        let city = response.data.name;
        let h4 = document.querySelector("h4");
        h4.innerHTML = `It is ${temperature}°C in ${city}`;
      } catch (error) {
        console.log(error.response.data.message);
        let h4 = document.querySelector("h4");
        h4.innerHTML =
          "Could not retrieve weather data for your current location.";
      }
    });
  } else {
    let h4 = document.querySelector("h4");
    h4.innerHTML = "Geolocation is not supported by this browser.";
  }
});




    
