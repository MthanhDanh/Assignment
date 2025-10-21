let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBody = document.getElementById("cart-body");
const cartTotal = document.getElementById("cart-total").querySelector("span");
const cartEmpty = document.getElementById("cart-empty");

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}

function renderCart() {
  if (!cartBody || !cartTotal) return;

  if (cart.length === 0) {
    cartBody.innerHTML = "";
    cartEmpty.style.display = "block";
    cartTotal.textContent = "0 đ";
    updateCartCount();
    return;
  }

  cartEmpty.style.display = "none";
  let total = 0;

  cartBody.innerHTML = cart.map((item, index) => {
    total += item.price * item.quantity;
    return `
      <tr>
        <td><img src="${item.image}" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>${item.price.toLocaleString()} đ</td>
        <td>
          <div class="qty-control">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </td>
        <td><button class="btn-delete" onclick="removeItem(${index})">Xóa</button></td>
      </tr>
    `;
  }).join("");

  cartTotal.textContent = total.toLocaleString() + " đ";
  updateCartCount();
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

document.querySelector(".btn-checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }
  alert("Thanh toán thành công!");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});

renderCart();x