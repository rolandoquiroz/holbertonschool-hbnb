/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

  document.addEventListener('DOMContentLoaded', () => {
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