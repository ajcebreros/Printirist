// ===== CHECK LOGIN STATUS =====
function checkLoginStatus() {
  const loginUser = localStorage.getItem("loggedInUser");
  return loginUser;
}

function setLoginUser(username) {
  localStorage.setItem("loggedInUser", username);
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

// ===== UPDATE HERO BUTTONS =====
function updateHeroButtons() {
  const printBtn = document.querySelector(".btn-print");
  const scanBtn = document.querySelector(".btn-scan");
  const loggedInUser = checkLoginStatus();

  if (loggedInUser) {
    // User is logged in - redirect to client-dashboard
    printBtn.textContent = "Print Now";
    scanBtn.textContent = "Scan";
    
    printBtn.onclick = () => {
      window.location.href = "client-dashboard.html";
    };
    scanBtn.onclick = () => {
      window.location.href = "client-dashboard.html";
    };
  } else {
    // User is not logged in - redirect to login
    printBtn.textContent = "Print Now";
    scanBtn.textContent = "Scan";
    
    printBtn.onclick = () => {
      window.location.href = "login.html";
    };
    scanBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", function() {
  updateHeroButtons();
  addLogoutButton();
});

// ===== ADD LOGOUT BUTTON IN NAVBAR =====
function addLogoutButton() {
  const loggedInUser = checkLoginStatus();
  const nav = document.querySelector("nav ul");
  let logoutItem = document.getElementById("logout-item");
  const loginItem = nav.querySelector("li:nth-child(2)"); // Login is the 2nd list item
  
  if (loggedInUser) {
    // Hide the Login link
    if (loginItem) {
      loginItem.style.display = "none";
    }
    
    // Add logout button if it doesn't exist
    if (!logoutItem) {
      logoutItem = document.createElement("li");
      logoutItem.id = "logout-item";
      logoutItem.innerHTML = `<button class="logout-btn" onclick="logoutUser()">Logout (${loggedInUser})</button>`;
      nav.appendChild(logoutItem);
    }
  } else {
    // Show the Login link if not logged in
    if (loginItem) {
      loginItem.style.display = "block";
    }
    
    // Remove logout button if it exists
    if (logoutItem) {
      logoutItem.remove();
    }
  }
}

const button = document.querySelector("button");

if (button) {
  button.addEventListener("click", () => {
    alert("Quote button clicked!");
  });
}

// Slideshow functionality
let slideIndex = 1;

function changeSlide(n) {
  showSlide(slideIndex += n);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));
  
  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].classList.add("active");
}

// Auto-advance slideshow every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

// Show first slide on page load
showSlide(slideIndex);
