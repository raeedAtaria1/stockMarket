const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.elements.email.value;
  let password = form.elements.password.value;
  const errorMessage = document.getElementById("error-message");

  // Clear previous error messages
  errorMessage.classList.add('d-none');
  errorMessage.textContent = '';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorMessage.textContent = 'Please enter a valid email address.';
    errorMessage.classList.remove('d-none');
    return;
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password)) {
    errorMessage.innerHTML = `
      Password must contain:<br>
      Minimum 8 characters<br>
      Must include an uppercase character<br>
      Must include a lowercase character<br>
      Must include a number<br>
      Must include a special character (!, @, #, etc.).<br>
      Supported special characters are: ! @ # $ % ^ & * ( ) - _ = + \\ | [ ] { } ; : / ? . > <
    `;
    errorMessage.classList.remove('d-none');
    return;
  }

  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return hex(hash);
  }

  function hex(buffer) {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map(byte => {
      const hexCode = byte.toString(16);
      return hexCode.padStart(2, '0');
    });
    return hexCodes.join('');
  }

  password = await hashPassword(password);
  console.log(password)

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      localStorage.setItem('email', email);
      window.location.href = '/marketData.html';
    } else {
      const errorText = await response.text();
      errorMessage.textContent = errorText;
      errorMessage.classList.remove('d-none');
    }
  } catch (error) {
    console.error(error);
    errorMessage.textContent = 'Something went wrong';
    errorMessage.classList.remove('d-none');
  }
});
