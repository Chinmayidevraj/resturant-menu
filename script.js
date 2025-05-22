const menu = [
  { name: "Espresso", price: 100, category: "Hot" },
  { name: "Cappuccino", price: 120, category: "Hot" },
  { name: "Iced Latte", price: 130, category: "Cold" },
  { name: "Cold Brew", price: 140, category: "Cold" },
  { name: "Brownie", price: 80, category: "Snacks" },
  { name: "Croissant", price: 70, category: "Snacks" },
  { name: "Signature Mocha", price: 180, category: "Special" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let total = 0;

window.onload = () => {
  setTimeout(() => (document.getElementById("loader").style.display = "none"), 1000);
  showMenu();
  renderCart();
};

function showMenu() {
  const menuItems = document.getElementById("menuItems");
  menuItems.innerHTML = "";
  const filter = document.getElementById("searchInput").value.toLowerCase();

  menu.filter(item => 
    (currentCategory === "all" || item.category === currentCategory) &&
    item.name.toLowerCase().includes(filter)
  ).forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-card";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <input type="number" min="1" value="1" id="${item.name}-qty"/>
      <button onclick='addToCart("${item.name}", ${item.price})'>Add</button>
    `;
    menuItems.appendChild(div);
  });
}

function addToCart(name, price) {
  const qty = parseInt(document.getElementById(`${name}-qty`).value);
  cart.push({ name, price, qty });
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const totalDisplay = document.getElementById("totalPrice");
  cartList.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.qty} - ₹${itemTotal} 
      <button onclick="removeItem(${index})">🗑️</button>`;
    cartList.appendChild(li);
  });

  totalDisplay.textContent = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function openSummary() {
  document.getElementById("orderSummaryModal").style.display = "block";
  const summaryList = document.getElementById("summaryList");
  const summaryTotal = document.getElementById("summaryTotal");
  summaryList.innerHTML = "";
  let final = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    final += subtotal;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} = ₹${subtotal}`;
    summaryList.appendChild(li);
  });

  summaryTotal.textContent = final;
}

function closeSummary() {
  document.getElementById("orderSummaryModal").style.display = "none";
}

function makePayment() {
  alert("Payment successful! ☕ Thanks for ordering.");
  cart = [];
  localStorage.removeItem("cart");
  closeSummary();
  renderCart();
}

function filterCategory(category) {
  currentCategory = category;
  showMenu();
}

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};

document.getElementById("searchInput").addEventListener("input", showMenu);

document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Subscribed successfully!");
  e.target.reset();
});

const scrollTopBtn = document.getElementById("scrollTopBtn");
window.onscroll = () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
};
scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
