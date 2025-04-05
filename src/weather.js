function weatherApp() {

    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
    const cityName = document.querySelector('#city-name');
    const weatherImg = document.querySelector('#weather-img');
    const temperature = document.querySelector('#temp');
    const weatherStatus = document.querySelector('#weather-status');
    const humidityLevel = document.querySelector('#humidity');
    const windSpeed = document.querySelector('#wind');
    const svgLogos = document.getElementsByClassName('svg');
    const toggleButton = document.querySelector('#toggle');
    const tempSwitch = document.querySelector('#temp-switch-text');
    const toggleContainer = document.querySelector('.toggle-container');

    let searchLink = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]?key=66DFJ3GYA56QMRUNZ83AEG838';

    const defaultCity = 'London';
    toggleContainer.style.display = 'none';
    searchInput.focus();

    async function showWeatherInfo(city) {

        const modifiedLink = searchLink.replace('[location]', city);
        console.log(modifiedLink);

        const tempSpan = document.createElement('span');
        tempSpan.className = 'temp-span';

        const humiditySpan = document.createElement('span');
        humiditySpan.className = 'humidity-span';

        const windSpan = document.createElement('span');
        windSpan.className = 'wind-span';

        const weatherStatusSpan = document.createElement('span');
        weatherStatusSpan.className = 'weather-status-span';

        toggleButton.checked = false;
        tempSwitch.textContent = 'Toggle for °C';

        try {
            const response = await fetch(modifiedLink, { mode: 'cors'});
            const mainData = await response.json();        

            const fullLocation = mainData.resolvedAddress;
            const weatherCondition = mainData.currentConditions.conditions;
            const weatherIcon = mainData.currentConditions.icon;
            const temperatureValue = mainData.currentConditions.temp;
            const humidityValue = mainData.currentConditions.humidity;
            const windValue = mainData.currentConditions.windspeed;

            const icon = await import(`./icons/${weatherIcon}.svg`);
            weatherImg.src = icon.default;
            weatherImg.style.display = 'block';

            [temperature, humidityLevel, windSpeed, weatherStatus].forEach((element) => {
                element.innerHTML = '';
            });

            cityName.textContent = fullLocation;
            tempSpan.textContent = `Temperature: ${temperatureValue}°F`;
            humiditySpan.textContent = `Humidity: ${humidityValue}%`;
            windSpan.textContent = `Wind: ${windValue} mph`;
            weatherStatusSpan.textContent = `Weather: ${weatherCondition}`;

            for (let i = 0; i < svgLogos.length; i++) {
                svgLogos[i].style.display = 'block';
            };

            temperature.appendChild(tempSpan);
            humidityLevel.appendChild(humiditySpan);
            windSpeed.appendChild(windSpan);
            weatherStatus.appendChild(weatherStatusSpan);

            toggleContainer.style.display = 'flex';
            
            console.log(fullLocation, weatherCondition, weatherIcon, temperatureValue, humidityValue, windValue);
        } catch (error) {
            console.error('It Appears that the city you entered is not valid. Please try again.', error);
            cityName.textContent = 'It appears that the city you entered is not valid. Please try again.';
            weatherImg.style.display = 'none';
            temperature.textContent = '';
            weatherStatus.textContent= '';
            humidityLevel.textContent = '';
            windSpeed.textContent = '';
        }
    }

    function checkCityName() {
        const regEx = /^([A-Za-z]+(\.)?)\s[A-Za-z]+$/;
        const locationName = searchInput.value.trim();
        const validName = regEx.test(locationName);

        if (validName) {
            const modCityName = locationName.replace(/\s/, '%20');
            showWeatherInfo(modCityName);
        } else if (locationName) {
            showWeatherInfo(locationName);
        } else {
            cityName.textContent = 'Please enter a valid city name.';
        };
    };

    function convertToCelsius() {
        const tempValue = temperature.textContent.split(': ')[1].split('°')[0];
        const celsiusValue = ((tempValue - 32) * 5) / 9;
        temperature.innerHTML = '';
        temperature.textContent = `Temperature: ${celsiusValue.toFixed(1)}°C`;
    }

    searchButton.addEventListener('click', () => {
        checkCityName();
    })

    toggleButton.addEventListener('change', () => {
        if (toggleButton.checked) {
            convertToCelsius();
            tempSwitch.textContent = 'Toggle for °F';
        } else {
            const tempValue = temperature.textContent.split(': ')[1].split('°')[0];
            const fahrenheitCalc = (tempValue * 9) / 5 + 32;
            temperature.innerHTML = '';
            temperature.textContent = `Temperature: ${fahrenheitCalc.toFixed(1)}°F`;
            tempSwitch.textContent = 'Toggle for °C';
        }
    })
}

export { weatherApp };