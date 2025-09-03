async function getButton(){
    const input=document.getElementById("cityName");
    const result = document.getElementById("result");
    const cityName=input.value;
    
    if(!cityName){
        result.innerText = "Please enter a city name.";
        return;
    }
    
    try{
        const geocodingURL=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;
        const geoResponse= await fetch(geocodingURL);
        const geoData= await geoResponse.json();
        
        if(!geoData.results||geoData.results.length===0)
        {
            result.innerText="City not found";
            return;
        }

        const {latitude,longitude}=geoData.results[0];
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        if (!weatherData.current_weather) {
            document.getElementById("result").innerText = "Weather data not available.";
            return;
        }

        const weather = weatherData.current_weather; 
        
        const weatherDescriptionMap = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            56: "Light freezing drizzle",
            57: "Dense freezing drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            66: "Light freezing rain",
            67: "Heavy freezing rain",
            71: "Slight snow fall",
            73: "Moderate snow fall",
            75: "Heavy snow fall",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        };
        
        function getWeatherCondition(code) {
            return weatherDescriptionMap[code] || "Unknown";
        }
    
        const condition = getWeatherCondition(weather.weathercode);

        
        function getConditionIcon(code, isDay){
            switch(code){
                case 0: return isDay ? "icon/day-sunny.svg" : "icon/night-cloudy.svg";
                case 1: return isDay ? "icon/day-sunny-overcast.svg" : "icon/night-cloudy.svg";
                case 2: return isDay ? "icon/day-sunny-overcast.svg" : "icon/night-cloudy.svg";
                case 3: return "icon/cloudy.svg";
                case 45: return isDay ? "icon/day-fog.svg" : "icon/day-fog (1).svg";
                case 48: return isDay ? "icon/day-fog (2).svg" : "icon/day-fog (1).svg";
                case 51: return isDay ? "icon/weather-drizzle-20-regular.svg" : "icon/night-sprinkle.svg";
                case 53: return isDay ? "icon/weather-drizzle-20-regular.svg" : "icon/night-sprinkle.svg";
                case 55: return isDay ? "icon/weather-drizzle-20-regular.svg" : "icon/night-sprinkle.svg";
                case 56: return isDay ? "icon/weather-snowy-rainy.svg" : "icon/night-sleet-storm.svg";
                case 57: return isDay ? "icon/weather-snowy-rainy.svg" : "icon/night-sleet-storm.svg";
                case 61: return isDay ? "icon/weather-rainy.svg" : "icon/night-showers.svg";
                case 63: return isDay ? "icon/weather-rainy.svg" : "icon/night-showers.svg";
                case 65: return isDay ? "icon/weather-pouring.svg" : "icon/night-rain-wind.svg";
                case 66: return isDay ? "icon/weather-pouring.svg" : "icon/night-rain-mix.svg";
                case 67: return isDay ? "icon/weather-pouring.svg" : "icon/night-rain-mix.svg";
                case 71: return isDay ? "icon/weather-snowy-heavy.svg" : "icon/night-snow.svg";
                case 73: return isDay ? "icon/weather-snowy-heavy.svg" : "icon/night-snow.svg";
                case 75: return isDay ? "icon/weather-snowy-heavy.svg" : "icon/night-snow.svg";
                case 77: return isDay ? "icon/weather-partly-snowy.svg" : "icon/night-snow-wind.svg";
                case 80: return isDay ? "icon/weather-partly-rainy.svg" : "icon/night-showers.svg";
                case 81: return isDay ? "icon/weather-partly-rainy.svg" : "icon/night-showers.svg";
                case 82: return isDay ? "icon/weather-partly-rainy.svg" : "icon/night-showers.svg";
                case 85: return isDay ? "icon/weather-partly-snowy-rainy.svg" : "icon/night-snow-thunderstorm.svg";
                case 86: return isDay ? "icon/weather-partly-snowy-rainy.svg" : "icon/night-snow-thunderstorm.svg";
                case 95: return "icon/weather-partly-lightning.svg";
                case 96: return isDay ? "icon/weather-partly-snowy-rainy.svg" : "icon/night-snow-thunderstorm.svg";
                case 99: return isDay ? "icon/weather-partly-snowy-rainy.svg" : "icon/night-snow-thunderstorm.svg";
                default: return isDay ? "icon/day-sunny.svg" : "icon/night-cloudy.svg";
            }
        }

        const conditionIcon = getConditionIcon(weather.weathercode, weather.is_day);
        const windIcon = "icon/cloudy-windy.svg";
        const bgClass = weather.is_day ? "day" : "night";

        result.innerHTML = `
            <div class="weather-card ${bgClass}">
                <div class="weather-left">
                    <h2>${cityName}</h2>
                    <p><img src="icon/thermometer.svg" alt="Temperature"> ${weather.temperature} °C</p>
                    <p><img src="${weather.is_day ? "icon/sunrise.svg" : "icon/sunset.svg"}" alt="Time"> ${weather.time}</p>
                </div>
                <div class="weather-right">
                    <img src="${conditionIcon}" alt="${condition}">
                    <p><img src="${windIcon}" alt="wind"> ${weather.windspeed} km/h, ${weather.winddirection}°</p>
                    <p><strong>Condition:</strong> ${condition}</p>
                </div>
            </div>
        `;
        input.value = "";


    } catch (error) {
        document.getElementById("result").innerText = "Error fetching data.";
        console.error(error);
    }
}
