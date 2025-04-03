function weatherApp() {

    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
    const cityName = document.querySelector('#city-name');
    const weatherImg = document.querySelector('#weather-img');
    const temperature = document.querySelector('#temp');
    const weatherStatus = document.querySelector('#weather-status');
    const humidityLevel = document.querySelector('#humidity');
    const windSpeed = document.querySelector('#wind');

    let searchLink = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date]?key=66DFJ3GYA56QMRUNZ83AEG838';

    const theDate = new Date();
    const currentDate = theDate.toISOString().slice(0, 10);
    const defaultCity = 'London';
    const defaultDate = currentDate;

    async function showWeatherInfo(city) {
        const date = currentDate;

        const modifiedLink = searchLink.replace('[location]', city).replace('[date]', date);
        console.log(modifiedLink);
        try {
            const response = await fetch(modifiedLink, { mode: 'cors'});
            const mainData = await response.json();

            cityName.textContent = mainData.resolvedAddress;

            const fullLocation = mainData.resolvedAddress;
            const weatherCondition = mainData.currentConditions.conditions;
            const weatherIcon = mainData.currentConditions.icon;
            const temperatureValue = mainData.currentConditions.temp;
            const humidityValue = mainData.currentConditions.humidity;
            const windValue = mainData.currentConditions.windspeed;

            const icon = await import(`./icons/${weatherIcon}.svg`);
            weatherImg.src = icon.default;
            weatherImg.style.display = 'block';
            
            console.log(fullLocation, weatherCondition, weatherIcon, temperatureValue, humidityValue, windValue);
        } catch (error) {
            console.error('It Appears that the city you entered is not valid. Please try again.', error);
        }
    }

    function checkCityName() {
        const regEx = /^[A-Za-z]+\s[A-Za-z]+$/
        const searchInput = document.querySelector('#search-input');
        const cityName = searchInput.value.trim();
        const validName = regEx.test(cityName);

        if (validName) {
            const modCityName = cityName.replace(/\s/, '%20');
            showWeatherInfo(modCityName);
        } else if (cityName) {
            showWeatherInfo(cityName);
        } else {
            cityName.textContent = 'Please enter a valid city name.';
        }
    }

    searchButton.addEventListener('click', () => {
        checkCityName();
    })
}

export { weatherApp };