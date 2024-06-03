// Add constants 
const API_KEY = "mqos6elVmrFUKxY-t7pJkk01Hmk";
const API_URL = "https://ci-jshint.herokuapp.com/api";
// Add a constant as a reference to the Bootstrap modal
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Add a standard event listener to wire up the button
document.getElementById("status").addEventListener("click", e => getStatus(e));
// Add an event listener so the button can call the function postForm
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    // Add a constant to to make the POST request to the API,
    // authorize it with the API key,
    // attach the form as the body of the request
    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                        "Authorization": API_KEY,
        },
                                body: form,
    })
}

// Add a getStatus function to make FIRST a GET request to the API_URL with the API_KEY
// ..SECOND to pass the data to a display function
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);
    
    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
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
