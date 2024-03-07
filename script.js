const cityInput = document.querySelector(".city-input");
const serachButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "39d8e59901b16996634bde543311d0f9";

const createWeatherCard = (cityName,weatherItem,index) => {
    if (index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]}) </h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273).toFixed(2)}°C</h4>
                    <h4>Feels Like:${(weatherItem.main.feels_like - 273).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https:/openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Error">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https:/openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Error">
                <h4>Temp: ${(weatherItem.main.temp - 273).toFixed(2)}°C</h4>
                <h4>Feels Like:${(weatherItem.main.feels_like - 273).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const sixDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        console.log(sixDaysForecast);
        sixDaysForecast.forEach((weatherItem, index) =>{
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            }
            else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    }).catch( ()=> {
        alert("ERROR");
    } );
}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName){
        return;
    }
    const geo_coding_api = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(geo_coding_api).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`ERROR for ${cityName}`)
        const {name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("AN ERROR OCCURED")
    });
}
//http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const {name} = data[0];
                getWeatherDetails(name, latitude, longitude);
                // console.log(data)
            }).catch( () => {
                alert("An error occured while fetching this city");
            })
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset geolocation permission to grant access again.")
            };
        }
    )
}

locationButton.addEventListener("click",getUserCoordinates);
serachButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());