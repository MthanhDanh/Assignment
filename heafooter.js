document.addEventListener('DOMContentLoaded', () => {
    const headerHTML = `
        <header>
            <div class="logo">DanhShop😎</div>
            <nav>
                <ul>
                    <li><a href="index.html">Trang chủ</a></li>
                    <li><a href="product.html">Sản phẩm</a></li>
                    <li><a href="cart.html">Giỏ hàng <span class="cart-count">0</span></a></li>
                    <li><a href="contact.html">Liên hệ</a></li>
                    <li><a href="#">Đăng nhập</a></li>
                </ul>
            </nav>
        </header>
    `;

    const footerHTML = `
        <footer>
            <div class="footer-container">
                <div class="footer-column">
                    <h3>Giới thiệu</h3>
                    <p>MyShop chuyên cung cấp điện thoại, laptop chất lượng cao, giá hợp lý, dịch vụ tận tâm.</p>
                </div>
                <div class="footer-column">
                    <h3>Liên hệ</h3>
                    <ul>
                        <li>Email: danheptrai@gmail.com</li>
                        <li>Điện thoại: 0123 456 789</li>
                        <li>Địa chỉ: Quận 12, Tp.HCM</li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Hỗ trợ</h3>
                    <ul>
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                        <li><a href="#">Chính sách bảo hành</a></li>
                        <li><a href="#">Chính sách đổi trả</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 MyShop. All rights reserved.</p>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    updateCartCount();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}