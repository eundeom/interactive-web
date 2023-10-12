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
  console.log(lat, lon);
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`
    );
    const data = await response.json();
    console.log("data", data);
  } catch {}
};
