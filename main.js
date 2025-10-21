class Product {
  constructor(id, name, price, image, category, hot, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.category = category;
    this.hot = hot;
    this.description = description;
  }

  render() {
    return `
      <div class="product">
        <a href="detail.html?id=${this.id}">
          <img src="${this.image}" alt="${this.name}">
        </a>
        <div class="meta">
          <a href="detail.html?id=${this.id}">
            <h4>${this.name}</h4>
          </a>
          <h4>${this.price.toLocaleString()} đ</h4>
          <button onclick="window.location.href='detail.html?id=${this.id}'">Xem chi tiết</button>
        </div>
      </div>
    `;
  }

  renderDetail() {
    return `
      <div class="product-detail">
        <img src="${this.image}" alt="${this.name}">
        <div class="info">
          <h2>${this.name}</h2>
          <p><strong>Giá:</strong> ${this.price.toLocaleString()} đ</p>
          <p>${this.description}</p>
          <button id="addCartBtn" data-id="${this.id}">Thêm vào giỏ hàng</button>
        </div>
      </div>
    `;
  }
}

const productAll = document.getElementById('content');
const searchInput = document.getElementById('search-input');
const sortPrice = document.getElementById('sort-price');
let allProductsData = [];

if (productAll) {
  fetch('https://my-json-server.typicode.com/MthanhDanh/shop/products')
    .then(response => response.json())
    .then(data => {
      allProductsData = data;
      renderProduct(allProductsData, productAll);
    })
    .catch(err => {
      productAll.innerHTML = "<p>Lỗi tải danh sách sản phẩm!</p>";
      console.error(err);
    });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filteredProducts = allProductsData.filter(
        p => p.name.toLowerCase().includes(keyword)
      );
      renderProduct(filteredProducts, productAll);
    });
  }

  if (sortPrice) {
    sortPrice.addEventListener('change', (e) => {
      let sorted = [...allProductsData];
      if (e.target.value === "asc") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (e.target.value === "desc") {
        sorted.sort((a, b) => b.price - a.price);
      }
      renderProduct(sorted, productAll);
    });
  }
}

const renderProduct = (array, theDiv) => {
  if (!array.length) {
    theDiv.innerHTML = "<p>Không có sản phẩm nào!</p>";
    return;
  }
  let html = "";
  array.forEach((item) => {
    const product = new Product(
      item.id,
      item.name,
      item.price,
      item.image,
      item.category,
      item.hot,
      item.description
    );
    html += product.render();
  });
  theDiv.innerHTML = html;
};

const proDetailDiv = document.getElementById('detail-product');
if (proDetailDiv) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    fetch(`https://my-json-server.typicode.com/MthanhDanh/shop/products${id}`)
      .then(response => {
        if (!response.ok) throw new Error("Sản phẩm không tồn tại");
        return response.json();
      })
      .then(data => {
        const product = new Product(
          data.id,
          data.name,
          data.price,
          data.image,
          data.category,
          data.hot,
          data.description
        );

        proDetailDiv.innerHTML = product.renderDetail();

        const addCartBtn = document.getElementById("addCartBtn");
        if (addCartBtn) {
          addCartBtn.addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existing = cart.find(p => p.id === product.id);
            if (existing) {
              existing.quantity += 1;
            } else {
              cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
          });
        }
      })
      .catch(err => {
        proDetailDiv.innerHTML = "<p>Lỗi tải sản phẩm!</p>";
        console.error(err);
        let allProductsData = JSON.parse(localStorage.getItem("adminProducts")) || [];
      });
  }
}