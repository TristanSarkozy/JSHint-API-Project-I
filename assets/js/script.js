// Add constants 
const API_KEY = "mqos6elVmrFUKxY-t7pJkk01Hmk";
const API_URL = "https://ci-jshint.herokuapp.com/api";
// Add a constant as a reference to the Bootstrap modal
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Add a standard event listener to wire up the button
document.getElementById("status").addEventListener("click", e => getStatus(e));
// Add an event listener so the button can call the function postForm
document.getElementById("submit").addEventListener("click", e => postForm(e));

// Add a function to take the form data as a parameter to send the options in a comma separated list
function processOptions(form) {
    // Iterate through the options
    // Push each value into a temporary array
    // Convert the array back to a string
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    // Add delete options to delete the existing options and add new ones
    form.delete("options");

    form.append("options", optArray.join());

    return form;
    
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // Add a constant to to make the POST request to the API,
    // authorize it with the API key,
    // attach the form as the body of the request
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
            // Add call to displayException with data as a parameter
    } else {displayException(data);
        throw new Error(data.error);
    }
}

// Add a getStatus function to make FIRST a GET request to the API_URL with the API_KEY
// ..SECOND to pass the data to a display function
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);
    
    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
            // Add call to displayException with data as a parameter
    } else {displayException(data);
        throw new Error(data.error);
    }
}

// Add "a take in data as a parameter" function to format the response
function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else{
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`
        }
    }

    // Set the heading in the modal
    document.getElementById("resultsModalTitle").innerText = heading;
    // Set the content in the modal
    document.getElementById("results-content").innerHTML = results;
    // Display the modal
    resultsModal.show();
}

// Add function to display results in modal
function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

// Add function and take data as a parameter
function displayException(data) {
    // Add code to display the heading
    let heading = `An Exception Occured`;
    
    // Add code to display the modal body(Status code, error number and exception text)
    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    // Add code to set the content on the DOM 
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    // Add code to display the modal using Bootstrap method
    resultsModal.show();
}
