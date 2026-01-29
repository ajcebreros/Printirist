// ===== MODAL CONTROL =====
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// ===== SIGN UP =====
function signupUser() {
  let role = signupRole.value;
  let username = signupUsername.value;
  let email = signupEmail.value;
  let password = signupPassword.value;

  if (!role || !username || !email || password.length < 6) {
    signupMsg.innerText = "❌ Fill all fields (password min 6 chars)";
    signupMsg.className = "error";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let exists = users.find(u => u.username === username && u.role === role);
  if (exists) {
    signupMsg.innerText = "❌ User already exists for this role";
    signupMsg.className = "error";
    return;
  }

  users.push({ role, username, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  signupMsg.innerText = "✅ Registration successful!";
  signupMsg.className = "success";
}

// ===== LOGIN =====
function loginUser() {
  let role = loginRole.value;
  let username = loginUsername.value;
  let password = loginPassword.value;

  if (!role || !username || !password) {
    loginMsg.innerText = "❌ Please fill all fields";
    loginMsg.className = "error";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(
    u => u.role === role && u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("sessionUser", JSON.stringify(user));
    window.location.href = "dashboard-" + role + ".html";
  } else {
    loginMsg.innerText = "❌ Invalid username, password, or role";
    loginMsg.className = "error";
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("sessionUser");
  window.location.href = "index.html";
}

// ===== FILE PREVIEW =====
function previewFile() {
  let file = fileInput.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = () => preview.src = reader.result;
  reader.readAsDataURL(file);
}

// ===== SHOW COD INFO =====
function showCOD() {
  let method = document.getElementById("paymentMethod").value;
  document.getElementById("codInfo").style.display = method === "COD" ? "block" : "none";
  if(method === "GCash" || method === "PayMaya"){
    document.getElementById("payInstructions").style.display = "block";
  } else {
    document.getElementById("payInstructions").style.display = "none";
  }
}

// ===== CALCULATE PRICE =====
function calculatePrice() {
  let colorOption = document.getElementById("colorOption").value;
  let quantity = parseInt(document.getElementById("quantity").value) || 0;
  let pricePerSheet = colorOption === "Color" ? 10 : 5;
  let total = pricePerSheet * quantity;
  document.getElementById("totalPrice").innerText = "₱ " + total;
  return total;
}

// ===== SUBMIT REQUEST =====
function submitRequest() {
  let user = JSON.parse(localStorage.getItem("sessionUser"));
  let requests = JSON.parse(localStorage.getItem("requests")) || [];

  let paymentMethodValue = document.getElementById("paymentMethod").value;
  let colorOption = document.getElementById("colorOption").value;
  let quantity = parseInt(document.getElementById("quantity").value) || 0;
  let totalPrice = calculatePrice();

  let address = codAddress ? codAddress.value : "";
  let contact = codContact ? codContact.value : "";

  let file = fileInput.files[0];
  if (!file || quantity <= 0) {
    alert("❌ Please select file and enter quantity");
    return;
  }

  let reader = new FileReader();
  reader.onload = function() {
    requests.push({
      user: user.username,
      service: service.value,
      file: reader.result,
      color: colorOption,
      quantity: quantity,
      paymentMethod: paymentMethodValue,
      address: address,
      contact: contact,
      price: totalPrice,
      paymentStatus: paymentMethodValue === "COD" ? "Pending" : "Unpaid",
      status: "Pending"
    });

    localStorage.setItem("requests", JSON.stringify(requests));
    alert("✅ Request submitted!");
    loadClientDashboard();
  };
  reader.readAsDataURL(file);
}

// ===== MARK PAYMENT DONE (for GCash/PayMaya) =====
function markPaid(index){
  let requests = JSON.parse(localStorage.getItem("requests")) || [];
  requests[index].paymentStatus = "Paid";
  localStorage.setItem("requests", JSON.stringify(requests));
  loadClientDashboard();
}

// ===== CLIENT DASHBOARD =====
function loadClientDashboard() {
  protectPage("client");

  let table = document.getElementById("clientTable");
  let user = JSON.parse(localStorage.getItem("sessionUser"));
  let requests = JSON.parse(localStorage.getItem("requests")) || [];

  table.innerHTML = "<tr><th>Service</th><th>Color</th><th>Qty</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr>";

  requests.filter(r => r.user === user.username)
    .forEach((r,i) => {
      let actionBtn = "";
      if(r.paymentMethod === "GCash" || r.paymentMethod === "PayMaya"){
        if(r.paymentStatus !== "Paid"){
          actionBtn = `<button onclick="markPaid(${i})">Mark Paid</button>`;
        }
      }
      table.innerHTML += `
        <tr>
          <td>${r.service}</td>
          <td>${r.color}</td>
          <td>${r.quantity}</td>
          <td>₱ ${r.price}</td>
          <td>${r.paymentMethod} (${r.paymentStatus || "N/A"})</td>
          <td>${r.status}</td>
          <td>${actionBtn}</td>
        </tr>`;
    });
}

// ===== STAFF DASHBOARD =====
function loadStaffDashboard() {
  protectPage("staff");

  let table = document.getElementById("staffTable");
  let requests = JSON.parse(localStorage.getItem("requests")) || [];

  table.innerHTML = `
    <tr>
      <th>User</th>
      <th>Service</th>
      <th>File</th>
      <th>Color</th>
      <th>Qty</th>
      <th>Payment</th>
      <th>Payment Status</th>
      <th>Status</th>
      <th>Action</th>
    </tr>`;

  requests.forEach((r, i) => {
    table.innerHTML += `
      <tr>
        <td>${r.user}</td>
        <td>${r.service}</td>
        <td><a href="${r.file}" target="_blank">View File</a></td>
        <td>${r.color}</td>
        <td>${r.quantity}</td>
        <td>${r.paymentMethod}</td>
        <td>${r.paymentStatus || "N/A"}</td>
        <td>${r.status}</td>
        <td><button onclick="updateStatus(${i})">Next</button></td>
      </tr>`;
  });
}

// ===== UPDATE STATUS =====
function updateStatus(i) {
  let requests = JSON.parse(localStorage.getItem("requests"));

  if (requests[i].status === "Pending") requests[i].status = "Approved";
  else if (requests[i].status === "Approved") requests[i].status = "Completed";

  localStorage.setItem("requests", JSON.stringify(requests));
  loadStaffDashboard();
}

// ===== OWNER DASHBOARD =====
function loadOwnerDashboard() {
  protectPage("owner");

  let requests = JSON.parse(localStorage.getItem("requests")) || [];

  let totalJobs = requests.length;
  let totalProfit = requests.filter(r => r.paymentStatus === "Paid").reduce((sum,r)=> sum+r.price, 0);

  document.getElementById("stats").innerText = "Total Jobs: " + totalJobs;
  document.getElementById("payments").innerText = "Total Profit: ₱" + totalProfit;

  let pending = requests.filter(r=>r.status=="Pending").length;
  let approved = requests.filter(r=>r.status=="Approved").length;
  let completed = requests.filter(r=>r.status=="Completed").length;

  let canvas = document.getElementById("chart");
  let ctx = canvas.getContext("2d");

  let data = [pending, approved, completed];
  let colors = ["cyan", "blue", "lime"];

  ctx.clearRect(0,0,300,200);
  let x=30;
  data.forEach((v,i)=>{
    ctx.fillStyle = colors[i];
    ctx.fillRect(x,200-v*20,40,v*20);
    x+=70;
  });
}

// ===== PAGE PROTECTION =====
function protectPage(role) {
  let user = JSON.parse(localStorage.getItem("sessionUser"));
  if (!user || user.role !== role) {
    alert("Unauthorized access!");
    window.location.href = "login.html";
  }
}

