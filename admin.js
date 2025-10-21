const tableBody = document.querySelector("#productTable tbody");
const form = document.querySelector("#productForm");
const previewImage = document.querySelector("#previewImage");
const resetBtn = document.querySelector("#resetBtn");

let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

// ✅ Nếu chưa có dữ liệu thì tải từ API
if (products.length === 0) {
  fetch(`https://my-json-server.typicode.com/MthanhDanh/shop/products`)
    .then(res => res.json())
    .then(data => {
      products = data;
      saveData();
      renderTable();
    })
    .catch(err => console.error("❌ Lỗi tải API:", err));
} else {
  renderTable();
}

// 🔹 Hiển thị danh sách sản phẩm
function renderTable() {
  tableBody.innerHTML = "";
  products.forEach((p, i) => {
    const row = `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.image}" alt="${p.name}"></td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()} đ</td>
        <td>${p.category}</td>
        <td>${p.hot ? "🔥" : "❌"}</td>
        <td>
          <button class="btn-edit" onclick="editProduct(${i})">Sửa</button>
          <button class="btn-delete" onclick="deleteProduct(${i})">Xóa</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// 🔹 Lưu dữ liệu vào localStorage
function saveData() {
  localStorage.setItem("adminProducts", JSON.stringify(products));
}

// 🔹 Xóa sản phẩm
function deleteProduct(index) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    products.splice(index, 1);
    saveData();
    renderTable();
  }
}

// 🔹 Sửa sản phẩm
function editProduct(index) {
  const p = products[index];
  document.getElementById("formTitle").innerText = "✏️ Chỉnh sửa sản phẩm";
  document.getElementById("productId").value = p.id;
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productCategory").value = p.category;
  document.getElementById("productHot").value = p.hot;
  document.getElementById("productDesc").value = p.description;
  previewImage.src = p.image;
}

// 🔹 Làm mới form
resetBtn.addEventListener("click", () => {
  form.reset();
  document.getElementById("formTitle").innerText = "➕ Thêm Sản Phẩm";
  previewImage.src = "";
});

// 🔹 Hiển thị ảnh xem trước
document.getElementById("productImage").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      previewImage.src = evt.target.result;
      previewImage.dataset.imageData = evt.target.result; // lưu base64
    };
    reader.readAsDataURL(file);
  }
});

// 🔹 Lưu (Thêm / Cập nhật)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("productId").value;
  const productData = {
    id: id || Date.now(),
    name: document.getElementById("productName").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    image: previewImage.dataset.imageData || previewImage.src || "img/default.png",
    category: document.getElementById("productCategory").value.trim(),
    hot: document.getElementById("productHot").value === "true",
    description: document.getElementById("productDesc").value.trim()
  };

  if (id) {
    // cập nhật
    const index = products.findIndex(p => p.id == id);
    products[index] = productData;
  } else {
    // thêm mới
    products.push(productData);
  }

  saveData();
  renderTable();
  form.reset();
  previewImage.src = "";
  document.getElementById("formTitle").innerText = "➕ Thêm Sản Phẩm";
});
