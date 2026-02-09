function register() {
    if(!regName.value || !regEmail.value || !regPass.value){
      alert("Please fill in all fields.");
      return;
    }
  
    if(regPass.value.length < 6){
      alert("Password must be at least 6 characters.");
      return;
    }
  
    let user = {
      name: regName.value,
      email: regEmail.value,
      pass: regPass.value
    };
  
    localStorage.setItem(user.email, JSON.stringify(user));
    alert("Registration successful!");
    window.location = "login.html";
  }
  
  
  function login() {
    if(!logEmail.value || !logPass.value){
      alert("Enter email and password.");
      return;
    }
  
    let user = JSON.parse(localStorage.getItem(logEmail.value));
  
    if(user && user.pass === logPass.value){
      localStorage.setItem("currentUser", user.email);
      window.location="index.html";
    } else {
      alert("Incorrect email or password.");
    }
  }
  
  
  function placeOrder() {
    let total = calculateTotal();
    let order = {
      id: Date.now(),
      user: localStorage.getItem("currentUser"),
      file: fileInput.files[0].name,
      copies: copies.value,
      total: total,
      status: "Pending"
    };
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    alert("Order Placed!");
  }
  
  function calculateTotal(){
    let price = color.value === "bw" ? 0.05 : 0.20;
    let total = price * copies.value;
    if(lamination.checked) total += 1;
    if(binding.checked) total += 2;
    document.getElementById("total").innerText = total.toFixed(2);
    return total;
  }
  
  setInterval(calculateTotal, 500);
  
  if(document.getElementById("ordersTable")){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let user = localStorage.getItem("currentUser");
    orders.filter(o=>o.user===user).forEach(o=>{
      ordersTable.innerHTML += `<tr>
        <td>${o.id}</td>
        <td>${o.file}</td>
        <td>${o.copies}</td>
        <td>$${o.total}</td>
        <td>${o.status}</td>
      </tr>`;
    });
  }
  
  if(document.getElementById("adminOrders")){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.forEach(o=>{
      adminOrders.innerHTML += `<tr>
        <td>${o.id}</td>
        <td>${o.user}</td>
        <td>$${o.total}</td>
        <td>${o.status}</td>
      </tr>`;
    });
  }
  
  /* ===== SHOW / HIDE PASSWORD ===== */
function toggleLoginPass() {
    let pass = document.getElementById("logPass");
    pass.type = pass.type === "password" ? "text" : "password";
  }
  
  function toggleRegPass() {
    let pass = document.getElementById("regPass");
    pass.type = pass.type === "password" ? "text" : "password";
  }
  
  let slideIndex = 0;

function showSlide(index) {
  let slides = document.querySelectorAll(".slide");
  let dots = document.querySelectorAll(".dot");

  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function changeSlide(n) {
  let slides = document.querySelectorAll(".slide");
  slideIndex = (slideIndex + n + slides.length) % slides.length;
  showSlide(slideIndex);
}

function currentSlide(n) {
  slideIndex = n;
  showSlide(slideIndex);
}

setInterval(() => changeSlide(1), 4000);
