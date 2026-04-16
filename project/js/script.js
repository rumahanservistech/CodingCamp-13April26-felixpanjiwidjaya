const form = document.getElementById("form");
const list = document.getElementById("list");
const totalEl = document.getElementById("total");

let data = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!name || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  const transaction = {
    name,
    amount: Number(amount),
    category
  };

  data.push(transaction);
  update();
  form.reset();
});

function update() {
  localStorage.setItem("transactions", JSON.stringify(data));
  renderList();
  updateTotal();
  updateChart();
}

function renderList() {
  list.innerHTML = "";

  data.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${item.name} - Rp ${item.amount} (${item.category})
      <span class="delete" onclick="deleteItem(${index})">x</span>
    `;

    list.appendChild(li);
  });
}

function deleteItem(index) {
  data.splice(index, 1);
  update();
}

function updateTotal() {
  const total = data.reduce((acc, item) => acc + item.amount, 0);
  totalEl.innerText = total;
}

// CHART
let chart;

function updateChart() {
  const categories = {
    Food: 0,
    Transport: 0,
    Fun: 0
  };

  data.forEach(item => {
    categories[item.category] += item.amount;
  });

  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Food", "Transport", "Fun"],
      datasets: [{
        data: [
          categories.Food,
          categories.Transport,
          categories.Fun
        ]
      }]
    }
  });
}

// INIT
update();
