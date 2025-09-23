/* Task 6 - API call */
function get_all_drinks() {
    console.log("[START] get_all_drinks()");

    // const api_endpoint_url = 'drinks.json'; // local file
    const api_endpoint_url = 'http://localhost/DrinksAPI/api/drink/read.php'; // local file
    let alertsEl = document.getElementById('alerts');

    axios.get(api_endpoint_url).
        then(response => {
            console.log("Axios call completed successfully!");

            let section_results = document.getElementById('results');

            // Build a string of Bootstrap cards
            let result_str = ``;
            let drinks_array = response.data.records; // Array of drink objects
            console.log(drinks_array); // Array of drink objects

            // Task 4 - Display Drinks
            //   Each drink is a Bootstrap card
            // Replace all the hard-coded strings with actual values as read from the JSON file
            for (let drink of drinks_array) {
                result_str += `
                <div class="col">
                    <div class="card h-100">
                        <img src="http://localhost/DrinksAPI/${drink.photo_url}" 
                             class="card-img-top"
                             alt="Drink Name">
                        <div class="card-body">
                            <h5 class="card-title">
                               ${drink.name}
                            </h5>
                            <p class="card-text small text-muted mb-0">
                                ${drink.category} • ${drink.alcoholic}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            }

            // Inject the cards into the #results section
            section_results.innerHTML = result_str;


        }).
        catch(error => {
            console.log(error.message);

            // Task 5 - Data can't be loaded, display alert
            //   "Failed to load drinks data."
            // YOUR CODE GOES HERE
            const displayStr = `<div class="alert alert-danger" role="alert">
                Failed to load drinks data.
            </div>`;
            alertsEl.innerHTML = displayStr;
        });

    console.log("[END] get_all_drinks()");
}


/* Task 7 - Category Dropdown Menu */
function populate_category_dropdown() {
    console.log("[START] populate_category_dropdown()");

    const api_endpoint_url = 'http://localhost/DrinksAPI/api/drink/category.php'; // API endpoint

    axios.get(api_endpoint_url).
        then(response => {

            console.log("Axios call completed successfully!");
            const dropDownEl = document.getElementById("category");

            // YOUR CODE GOES HERE
            let categories_array = response.data.records; // Array of categories
            for (let category of categories_array) {
                let dropDownOptionEl = document.createElement("option");
                let optionValue = document.createTextNode(category);
                dropDownOptionEl.appendChild(optionValue);

                dropDownEl.appendChild(dropDownOptionEl);
            }



        }).
        catch(error => {
            console.log(error.message);
        });

    console.log("[END] populate_category_dropdown()");
}


/* Task 8 - Category Dropdown Event Listener */
const catDropDownEl = document.getElementById("category");
catDropDownEl.addEventListener("change", function () {
    let api_endpoint_url = 'http://localhost/DrinksAPI/api/drink/search.php'; // API endpoint
    updateCards(api_endpoint_url + generateParams());
});


/* Task 9 - Alcoholic Dropdown Event Listener */
const alcoholicDropDownEl = document.getElementById("alcoholic");
alcoholicDropDownEl.addEventListener("change", function () {
    const api_endpoint_url = 'http://localhost/DrinksAPI/api/drink/search.php'; // API endpoint
    updateCards(api_endpoint_url + generateParams());
});


/* Task 10 - Name search input Event Listener */
const nameSearchElement = document.getElementById("name_search");
nameSearchElement.addEventListener("input", function () {
    const api_endpoint_url = 'http://localhost/DrinksAPI/api/drink/search.php'; // API endpoint
    updateCards(api_endpoint_url + generateParams());
});


function generateParams() {
    let parametersStr = '';

    if (catDropDownEl.value) {
        parametersStr += `?c=${catDropDownEl.value}`;
    }

    if (alcoholicDropDownEl.value) {
        if (parametersStr) {
            parametersStr += `&a=${alcoholicDropDownEl.value}`;
        }
        else {
            parametersStr += `?a=${alcoholicDropDownEl.value}`;
        }
    }

    if (nameSearchElement.value) {
        if (parametersStr) {
            parametersStr += `&n=${nameSearchElement.value.trim()}`;
        }
        else {
            parametersStr += `?n=${nameSearchElement.value.trim()}`;
        }
    }
    console.log(parametersStr);
    return parametersStr;
}


function updateCards(api_url) {
    axios.get(api_url).
        then(response => {
            console.log("Axios call completed successfully!");

            // YOUR CODE GOES HERE

            let section_results = document.getElementById('results');

            // Build a string of Bootstrap cards
            let result_str = ``;

            let drinks_array = response.data.records; // Array of drink objects
            console.log(drinks_array); // Array of drink objects

            // Task 4 - Display Drinks
            //   Each drink is a Bootstrap card
            // Replace all the hard-coded strings with actual values as read from the JSON file
            for (let drink of drinks_array) {
                result_str += `
                <div class="col">
                    <div class="card h-100">
                        <img src="http://localhost/DrinksAPI/${drink.photo_url}" 
                             class="card-img-top"
                             alt="Drink Name">
                        <div class="card-body">
                            <h5 class="card-title">
                               ${drink.name}
                            </h5>
                            <p class="card-text small text-muted mb-0">
                                ${drink.category} • ${drink.alcoholic}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            }

            // Inject the cards into the #results section
            section_results.innerHTML = result_str;

        }).
        catch(error => {
            console.log(error.message);
        });
}




// DO NOT MODIFY THE BELOW LINES
get_all_drinks();
populate_category_dropdown();