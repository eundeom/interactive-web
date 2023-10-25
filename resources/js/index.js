APIKEY = config.apiKey;
const success = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherSummary(lat, lon);
  getHourlyWeather(lat, lon);
};
const error = (err) => {
  window.alert("There is an error");
};
navigator.geolocation.getCurrentPosition(success, error);

const getWeatherSummary = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`
    );
    const data = await response.json();
    localStorage.setItem("weather", data.weather[0].main);
    localStorage.setItem("wind", JSON.stringify(data.wind));
    localStorage.setItem("main", JSON.stringify(data.main));
    localStorage.setItem("name", data.name);
  } catch {}
};
const setTemperature = () => {
  const temperature = Math.floor(
    JSON.parse(localStorage.getItem("main")).temp - 273.15
  );
  const temper = document.getElementById("temper");
  temper.innerText = temperature + "°";

  const spanCelsius = document.getElementById("spanCelsius");
  const spanFahrenheit = document.getElementById("spanFahrenheit");
  spanFahrenheit.style.fontSize = "80%";
  spanCelsius.style.fontSize = "80%";
  spanFahrenheit.style.color = "#b4cff2";
};
setTemperature();

const changeTemp = () => {
  const temperature = Math.floor(
    JSON.parse(localStorage.getItem("main")).temp - 273.15
  );

  const checkBox = document.getElementById("switchCheck");
  const spanCelsius = document.getElementById("spanCelsius");
  const spanFahrenheit = document.getElementById("spanFahrenheit");

  if (checkBox.checked) {
    temper.innerText = temperature + 273.15 + "°";
    spanCelsius.style.color = "#b4cff2";
    spanFahrenheit.style.color = "#ffffff";
  } else {
    temper.innerText = temperature + "°";
    spanCelsius.style.color = "#ffffff";
    spanFahrenheit.style.color = "#b4cff2";
  }
};

const setName = () => {
  const locationName = localStorage.getItem("name");

  const locName = document.getElementById("location");
  locName.innerText = locationName;
};
setName();

const setWeatherDesc = () => {
  const description = localStorage.getItem("weather");

  const weatherDesc = document.getElementById("weather-description");
  weatherDesc.innerText = description;

  // change image and background color
  const weatherImg = document.getElementById("weatherImg");
  const weatherBackground = document.getElementById("weather-summary");
  if (description == "Sunny") {
    weatherImg.src = "resources/svg/weather-sun.png";
    weatherBackground.style.backgroundColorcolor = "#4C87DE";
  } else if (description == "Clouds") {
    weatherImg.src = "resources/svg/weather-cloud.png";
  } else if (description == "Rain") {
    weatherImg.src = "resources/svg/weather-rain.png";
  } else if (description == "Mist") {
    weatherImg.src = "resources/svg/weather-mist.png";
  } else if (description == "Snow") {
    predictImg.src = "resources/svg/weather-snow.png";
  }
};
setWeatherDesc();

const setDate = () => {
  var today = new Date();
  var options = { day: "numeric", month: "short" };

  const dayMonth = document.getElementById("today");
  dayMonth.innerText = "today " + today.toLocaleDateString("en-US", options);
};
setDate();

const setHumidity = () => {
  const humi = JSON.parse(localStorage.getItem("main")).humidity;
  const humiText = document.getElementById("humi");
  humiText.innerText = humi + "%";
  humiText.style.fontSize = "200%";

  const humiState = document.getElementById("humiState");
  if (humi > 35 && humi < 60) {
    humiState.innerText = "Good";
  } else {
    humiState.innerText = "Bad";
  }
  const humiBar = document.getElementById("humiBar");
  humiBar.style.width = humi + "%";
};
setHumidity();

const setWind = () => {
  const wind = JSON.parse(localStorage.getItem("wind")).speed;
  const windText = document.getElementById("windText");
  windText.innerText = wind + "km/h";
  windText.style.fontSize = "200%";
};
setWind();

const setFeelsLike = () => {
  const feelLike = Math.floor(
    JSON.parse(localStorage.getItem("main")).feels_like - 273.15
  );
  const feelText = document.getElementById("feelText");
  feelText.innerText = feelLike + "°";
  feelText.style.fontSize = "200%";

  const humiBar = document.getElementById("feelBar");
  humiBar.style.width = feelLike + "%";
};
setFeelsLike();
const hourlyPredictionHour = document.getElementById("hourlyPredictionHour");
let currentHour = new Date().getHours();
for (let i = 0; i < 8; i++) {
  const hour = document.createElement("span");
  hour.innerText = (currentHour % 24) + ":00";
  hourlyPredictionHour.appendChild(hour);
  currentHour += 3;
}

const hourlyWeatherGraph = document.getElementById("hourlyPredictionChart");
const getHourlyWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}`
    );
    const data = await response.json();
    console.log(data);
    const hourlyWeatherData = [];
    const hourlyWeatherLabel = [];
    for (let i = 0; i < 8; i++) {
      if (data.list[i].rain == undefined) {
        hourlyWeatherLabel.push(0);
      } else {
        hourlyWeatherLabel.push(data.list[i].rain["3h"]);
        // const rainPercentage = Math.floor((data.list[i].rain["3h"] / 10) * 100);
        // hourlyWeatherLabel.push(rainPercentage);
      }
      hourlyWeatherData.push(Math.floor(data.list[i].main.temp - 273.15));
    }
    const hourlyPredictionTemp = document.getElementById(
      "hourlyPredictionTemp"
    );
    for (let i = 0; i < 8; i++) {
      const temperature = document.createElement("span");
      temperature.innerText = hourlyWeatherData[i] + "°";
      hourlyPredictionTemp.appendChild(temperature);
      temperature.classList.add("detail-text");
    }
    const hourlyPredictionImg = document.getElementById("hourlyPredictionImg");
    for (let i = 0; i < 8; i++) {
      const predictImg = document.createElement("img");
      const description = data.list[i].weather[0].main;
      predictImg.width = "25";
      if (description == "Sunny") {
        predictImg.src = "resources/svg/weather-sun-b.png";
        weatherBackground.style.backgroundColorcolor = "#4C87DE";
      } else if (description == "Clouds") {
        predictImg.src = "resources/svg/weather-cloud-b.png";
      } else if (description == "Rain") {
        predictImg.src = "resources/svg/weather-rain-b.png";
      } else if (description == "Mist") {
        predictImg.src = "resources/svg/weather-mist-b.png";
      } else if (description == "Snow") {
        predictImg.src = "resources/svg/weather-snow.png";
      }
      hourlyPredictionImg.appendChild(predictImg);
    }

    new Chart(hourlyWeatherGraph, {
      type: "line",
      data: {
        labels: hourlyWeatherLabel,
        datasets: [
          {
            data: hourlyWeatherLabel,
            borderColor: "#629cf3",
            borderWidth: 3,
            pointRadius: 0,
            pointStyle: "none",
            fill: {
              target: "origin",
              above: "#629cf3",
            },
          },
        ],
      },
      options: {
        maintainAspectRation: false,
        reponsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              color: "#5f5f5f",
            },
          },
          y: {
            display: false,
            max: 7,
          },
        },
      },
    });
  } catch {
    console.log("get hourly weather error");
  }
};
