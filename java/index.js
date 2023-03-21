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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}




function displayForecast(response){
  let forecast = response.data.daily;
let forecastElement = document.querySelector("#forecast");
let forecastHTML = `<div class ="row">`;

forecast.forEach(function (forecastDay,index){

if(index < 6){
  forecastHTML = forecastHTML +




`
<div class="col-2">
 <div class="weather-forecast-date">


 ${formatDay(forecastDay.dt)}
 </div>
            


<img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
alt=""
width="36"
class="img" />




<div class="new-temp">
<span class="weather-forecast-max">
${Math.round(forecastDay.temp.max)}°


</span>
<span class="weather-forecast-min">
 ${Math.round(forecastDay.temp.min)}°
</span>






</div>




</div>`;
















}

});






forecastHTML = forecastHTML + `</div>`;
forecastElement.innerHTML = forecastHTML;














}
function getForecast(coordinates){
console.log(coordinates);

 let apiKey = "6a48a550fc04f170639e60d52b8a6bc5";
 let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
 console.log(apiUrl);

axios.get(apiUrl).then(displayForecast);




}




















async function getWeatherData(city, latitude = null, longitude = null) {
 try {
   let url = `${apiUrl}?q=${city}&units=metric&appid=${apiKey}`;
   if (latitude && longitude) {
     url = `${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
   }
   
   let response = await axios.get(url);
   console.log(response.data);
    celsiusTempature = response.data.main.temp;
    getForecast(response.data.coord);
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
 
   let temperature = Math.round(data.main.temp);
   let precipitation = data.weather[0].description;
   let humidity = data.main.humidity;
    let windSpeed = data.wind.speed;
   let weatherDescription = data.weather[0].description;
  
  
 
   h4.innerHTML = `It is ${temperature}°C in ${city}`;
   h3.innerHTML = `Precipitation: ${precipitation} | Humidity: ${humidity}% | WindSpeed: ${windSpeed} m/s | Weather-Description: ${weatherDescription}`;
   let iconCode = data.weather[0].icon;
   let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
 
   iconElement.setAttribute("src", iconUrl);
  
  
 } catch (error) {
   h4.innerHTML = `Could not retrieve weather data for ${city}`;
   h3.innerHTML = "";
 }
 
     




 }


let celsiusTempature = null;




let fahrenheitElement = document.querySelector("#fahrenheit");


function displayFahrenheitTempature (event){
 event.preventDefault();
 let FahrenheitTempature = (celsiusTempature * 9)/5 + 32;
 let temperatureElement = document.querySelector("#number");
 temperatureElement.innerHTML = Math.round(FahrenheitTempature);


}
 fahrenheitElement.addEventListener("click",displayFahrenheitTempature);














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


updateHeading("North Carolina");