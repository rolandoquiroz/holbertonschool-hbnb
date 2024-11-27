/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

  document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    populatePriceFilter();
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Your code to handle form submission
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;


            loginUser(email, password);

    
        });
    }

    if (window.location.pathname.includes("index.html")) {
      fetchPlaces(getCookie("token"));
    }

});



async function loginUser(email, password) {
  const response = await fetch('http://127.0.0.1:5000/api/v1/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
  });
  
  // Handle the response
  if (response.ok) {
    const data = await response.json();
    // Adjust SameSite and Secure attributes for local testing
    // document.cookie = `token=${data.access_token}; path=/; SameSite=Lax`;
    document.cookie = `token=${data.access_token}; path=/; SameSite=None; Secure`;
    window.location.href = 'index.html';
  } else {
    alert('Login failed: ' + response.statusText);
  }
}

function getCookie(name) {
  // Function to get a cookie value by its name
  // Your code here
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts.pop().split(";").shift();
  return null;
}


function displayPlaces(places) {
  
  const placesList = document.getElementById("places-list");
  // Clear the current content of the places list
  placesList.innerHTML = "";
  
  // Iterate over the places data
    places.forEach((place) => {
    // For each place, create a div element and set its content
    const placeDiv = document.createElement("div");
    placeDiv.className = "place-card";
    placeDiv.setAttribute('data-price', place.price);
    placeDiv.innerHTML = `
            <img src="images/place1.jpg" alt="Place Image" class="place-image">
            <h2>${place.title}</h2>
            <p>Price per night: $${place.price}</p>
            <button class="details-button" data-id="${place.id}">View Details</button>
        `;
    // Append the created element to the places list
    placesList.appendChild(placeDiv);
  });


}

async function populatePriceFilter() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/places");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const places = await response.json();

    const priceFilter = document.getElementById("price-filter");
    if (priceFilter) {
      const allOption = document.createElement("option");
      allOption.value = "All";
      allOption.textContent = "All";

      priceFilter.appendChild(allOption);

      places.forEach((place) => {
        const option = document.createElement("option");
        option.value = place.price;
        option.textContent = place.price;
        priceFilter.appendChild(option);
      });

      priceFilter.addEventListener("change", (event) => {
        const selectedPrice = event.target.value;
        filterPlacesByPrice(selectedPrice);
      });
    }
  } catch (error) {
    console.error("Error fetching places:", error);
  }
}

function filterPlacesByPrice(selectedPrice) {
  const places = document.querySelectorAll('.place-card');

  places.forEach(place => {
      const price = place.getAttribute('data-price');
      if (selectedPrice === 'All' || price === selectedPrice) {
          place.style.display = 'block';
      } else {
          place.style.display = 'none';
      }
  });
}

async function fetchPlaces(token) {
  // Make a GET request to fetch places data
  // Include the token in the Authorization header
  // Handle the response and pass the data to displayPlaces function
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/places", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const places = await response.json();
    displayPlaces(places);
  } catch (error) {
    console.error("Fetch error: ", error);
  }
}

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (!token && loginLink) {
      loginLink.style.display = 'block';
  } else {
    if (loginLink) {
      loginLink.style.display = "none";
    }
    // Fetch places data if the user is authenticated
    fetchPlaces(token);
  }
}
