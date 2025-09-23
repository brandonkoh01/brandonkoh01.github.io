const weather_type_images = {
    "Clear": "images/clear.jpg",
    "Clouds": "images/clouds.jpg",
    "Haze": "images/haze.jpg",
    "Mist": "images/mist.jpg",
    "Rain": "images/rain.jpg",
    "Smoke": "images/smoke.jpg",
    "Snow": "images/snow.jpg",
    "Thunderstorm": "images/thunderstorm.jpg"
};

const temp_images = {
    "Hot": "images/hot.jpg",   // Celsius > 25
    "Okay": "images/okay.jpg", // Celsius 5-25
    "Cold": "images/cold.jpg"  // Celsius < 5
};


// DO NOT CHANGE THE FUNCTION SIGNATURE
function check_weather() {

    const userInputElement = document.getElementById("city");

    console.log("=== [START] check_weather() ===");

    //============================================================================
    // Task 1
    // Key in your own OpenWeatherMap.org API key (DO NOT SHARE IT WITH OTHERS)
    //============================================================================
    const weather_api_key = 'f32069d79f1d002b87d2bd66eae75eba';


    //============================================================================
    // Task 2
    // Retrieve the user input (city name) from <input>
    //============================================================================
    const city = userInputElement.value; // Default value, you need to replace this string with actual user input


    // DO NOT MODIFY THIS
    let api_endpoint = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather_api_key}&units=metric`;


    axios.get(api_endpoint)
        .then(response => {
            // Inspect what's in the API response
            console.log(response.data);


            //============================================================================
            // Task 3
            // Retrieve the weather info (e.g. Rain, Clouds, etc.)
            //============================================================================

            // YOUR CODE GOES HERE
            // Make use of const weather_type_images (at the top)
            let weatherArr = response.data.weather;
            let temperature = response.data.main.temp;


            //======================================================================================
            // Task 4
            // Perform JavaScript DOM to reflect weather info and temperature info in the HTML page.
            //======================================================================================

            // YOUR CODE GOES HERE
            // Make use of const temp_images (at the top)

            let weatherImgHTML = '';
            for (weather of weatherArr) {
                weatherImgHTML += `<p><img src="${weather_type_images[weather.main]}"></p>`
            }

            const weatherImgsEl = document.getElementById("weather_images");
            weatherImgsEl.innerHTML = weatherImgHTML;

            const temperatureImgEl = document.getElementById("temperature_image");
            if (temperature > 25) {
                temperatureImgEl.src = temp_images['Hot'];
            }
            if (temperature => 5 && temperature <= 25) {
                temperatureImgEl.src = temp_images['Okay'];
            }
            if (temperature < 5) {
                temperatureImgEl.src = temp_images['Cold'];
            }

        })
        .catch(error => {
            console.log(error.message);
        })

    console.log("=== [END] check_weather() ===");
}
