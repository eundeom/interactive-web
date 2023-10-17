APIKEY = config.apiKey;
const success = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWebtoon(lat, lon);
};
const error = (err) => {
  window.alert("There is an error");
};
navigator.geolocation.getCurrentPosition(success, error);

const getWebtoon = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`
    );
    const data = await response.json();
    localStorage.setItem("weather", data.weather[0].main);
    localStorage.setItem("wind", JSON.stringify(data.wind));
    localStorage.setItem("main", JSON.stringify(data.main));
    localStorage.setItem("name", data.name);

    console.log(data);
  } catch {}
};

const setTemperature = () => {
  const temperature = Math.floor(
    JSON.parse(localStorage.getItem("main")).temp - 273.15
  );

  const temper = document.getElementById("temper");
  temper.innerText = temperature + "°";
};
setTemperature();

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
  }
};
setWeatherDesc();

const setDate = () => {
  // Today 11 Oct
  var today = new Date();
  var options = { day: "numeric", month: "short" };

  const dayMonth = document.getElementById("today");
  dayMonth.innerText = "today " + today.toLocaleDateString("en-US", options);
};
setDate();
