let totalPrice = 0;

function calculatePrice() {
  const color = document.getElementById("colorOption").value;
  const qty = parseInt(document.getElementById("quantity").value);

  let pricePerPage = color === "Color" ? 10 : 5;
  totalPrice = pricePerPage * qty;

  document.getElementById("totalPrice").textContent = "₱ " + totalPrice;
}

function previewFile() {
  const file = document.getElementById("fileInput").files[0];
  const preview = document.getElementById("preview");

  if (!file) return;

  if (file.type.startsWith("image")) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
}

function showPayment() {
  const method = document.getElementById("paymentMethod").value;

  document.getElementById("codInfo").style.display =
    method === "COD" ? "block" : "none";

  document.getElementById("payInstructions").style.display =
    method && method !== "COD" ? "block" : "none";
}

function submitRequest() {
  const service = document.getElementById("service").value;
  const file = document.getElementById("fileInput").files[0];
  const color = document.getElementById("colorOption").value;
  const qty = document.getElementById("quantity").value;
  const payment = document.getElementById("paymentMethod").value;

  if (!file || !payment) {
    alert("Please upload a file and select payment method.");
    return;
  }

  const row = `
    <tr>
      <td>${service}</td>
      <td>${file.name}</td>
      <td>${color}</td>
      <td>${qty}</td>
      <td>${payment}</td>
      <td>₱ ${totalPrice}</td>
    </tr>
  `;

  document.getElementById("clientTable").innerHTML += row;

  alert("Request submitted successfully!");
}

function logout() {
  alert("Logged out!");
  window.location.href = "login.html";
}

window.onload = calculatePrice;
