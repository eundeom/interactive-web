APIKEY = config.apiKey;
const success = (position) => {
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;
	getWeatherSummary(lat, lon);
	getHourlyWeather(lat, lon);
};
const error = (err) => {
	window.alert('There is an error');
};
navigator.geolocation.getCurrentPosition(success, error);

const getWeatherSummary = async (lat, lon) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`
		);
		const data = await response.json();
		localStorage.setItem('weather', data.weather[0].main);
		localStorage.setItem('wind', JSON.stringify(data.wind));
		localStorage.setItem('main', JSON.stringify(data.main));
		localStorage.setItem('name', data.name);

		// console.log(data);
	} catch {}
};

const setTemperature = () => {
	const temperature = Math.floor(
		JSON.parse(localStorage.getItem('main')).temp - 273.15
	);

	const temper = document.getElementById('temper');
	temper.innerText = temperature + '°';
};
setTemperature();

const setName = () => {
	const locationName = localStorage.getItem('name');

	const locName = document.getElementById('location');
	locName.innerText = locationName;
};
setName();

const setWeatherDesc = () => {
	const description = localStorage.getItem('weather');

	const weatherDesc = document.getElementById('weather-description');
	weatherDesc.innerText = description;

	// change image and background color
	const weatherImg = document.getElementById('weatherImg');
	const weatherBackground = document.getElementById('weather-summary');
	if (description == 'Sunny') {
		weatherImg.src = 'resources/svg/weather-sun.png';
		weatherBackground.style.backgroundColorcolor = '#4C87DE';
	} else if (description == 'Clouds') {
		weatherImg.src = 'resources/svg/weather-cloud.png';
	}
};
setWeatherDesc();

const setDate = () => {
	var today = new Date();
	var options = { day: 'numeric', month: 'short' };

	const dayMonth = document.getElementById('today');
	dayMonth.innerText = 'today ' + today.toLocaleDateString('en-US', options);
};
setDate();

const hourlyWeatherGraph = document.getElementById('hourlyPredictionChart');
const getHourlyWeather = async (lat, lon) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}`
		);
		const data = await response.json();
		const hourlyWeatherData = [];
		const hourlyWeatherLabel = [];
		for (let i = 0; i < 8; i++) {
			if (data.list[i].rain == undefined) {
				hourlyWeatherLabel.push(0);
			} else {
				hourlyWeatherLabel.push(data.list[i].rain['3h']);
			}
			hourlyWeatherData.push(Math.floor(data.list[i].main.temp - 273.15));
		}

		new Chart(hourlyWeatherGraph, {
			type: 'line',
			data: {
				labels: hourlyWeatherLabel,
				datasets: [
					{
						label: false,
						data: hourlyWeatherLabel,
						borderColor: '#629cf3',
						borderWidth: 3,
						pointRadius: 0,
						pointStyle: 'none',
						fill: {
							target: 'origin',
							above: '#629cf3',
						},
					},
				],
			},
			options: {
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
							color: '#5f5f5f',
						},
					},
					y: {
						display: false,
						max: 10,
					},
				},
			},
		});
	} catch {
		console.log('get hourly weather error');
	}
};
