// ===== REGISTERED USERS STORAGE =====
function getRegisteredUsers() {
  const users = localStorage.getItem("registeredUsers");
  return users ? JSON.parse(users) : {};
}

function saveUser(username, email, password) {
  const users = getRegisteredUsers();
  users[username] = { email, password };
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

function userExists(username) {
  const users = getRegisteredUsers();
  return users.hasOwnProperty(username);
}

function validateCredentials(username, password) {
  const users = getRegisteredUsers();
  if (!users.hasOwnProperty(username)) {
    return false;
  }
  return users[username].password === password;
}

// ===== FORM TOGGLE =====
function toggleForm() {
  const loginCard = document.getElementById("loginCard");
  const registerCard = document.getElementById("registerCard");
  
  loginCard.style.display = loginCard.style.display === "none" ? "block" : "none";
  registerCard.style.display = registerCard.style.display === "none" ? "block" : "none";
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  if (!username || !password) {
    msg.textContent = "Please fill all fields!";
    msg.style.color = "red";
    return;
  }

  if (!userExists(username)) {
    msg.textContent = "User not found! Please register first.";
    msg.style.color = "red";
    return;
  }

  if (!validateCredentials(username, password)) {
    msg.textContent = "Invalid password!";
    msg.style.color = "red";
    return;
  }

  msg.textContent = `Logged in as ${username}`;
  msg.style.color = "#00ffff";

  // Store the logged-in user
  localStorage.setItem("loggedInUser", username);
  
  loginForm.reset();
  
  // Redirect to index.html after 1 second
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});

// ===== REGISTER FORM =====
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("registerConfirmPassword").value;
  const msg = document.getElementById("registerMsg");

  if (!username || !email || !password || !confirmPassword) {
    msg.textContent = "Please fill all fields!";
    msg.style.color = "red";
    return;
  }

  if (userExists(username)) {
    msg.textContent = "Username already exists! Choose another.";
    msg.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match!";
    msg.style.color = "red";
    return;
  }

  saveUser(username, email, password);
  msg.textContent = `Account created for ${username}. You can now login!`;
  msg.style.color = "#00ffff";

  registerForm.reset();
  setTimeout(() => {
    toggleForm();
  }, 1500);
});

// ===== THEME TOGGLE =====
function toggleTheme() {
  const body = document.body;
  if (body.style.background === "white") {
    body.style.background = "#0a0a0a";
    body.style.color = "#00ffff";
  } else {
    body.style.background = "white";
    body.style.color = "#000";
  }
}
