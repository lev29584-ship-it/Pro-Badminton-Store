
// Desktop hover for dropdown is handled via CSS.

// Đợi cho tất cả nội dung HTML được tải xong
document.addEventListener("DOMContentLoaded", () => {

    // --- Khai báo các biến ---
    const USERS_KEY = 'proBadmintonUsers';
    const CURRENT_USER_KEY = 'proBadmintonCurrentUser';

    // Lấy các phần tử modal
    const authModal = document.getElementById("auth-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const loginRegisterBtn = document.getElementById("login-register-btn");

    // Lấy các form
    const loginFormContainer = document.getElementById("login-form-container");
    const registerFormContainer = document.getElementById("register-form-container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // Lấy các link chuyển đổi form
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    // Lấy các thông báo lỗi
    const loginError = document.getElementById("login-error");
    const registerError = document.getElementById("register-error");

    // Lấy các phần tử liên quan đến trạng thái đăng nhập
    const userContainer = document.getElementById("user-container");
    const userInfo = document.getElementById("user-info");
    const welcomeMsg = document.getElementById("welcome-msg");
    const logoutBtn = document.getElementById("logout-btn");

    // Lấy link giỏ hàng
    const cartLink = document.getElementById("cart-link");

    // Mobile menu elements
    const menuToggleBtn = document.getElementById("menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navOverlay = document.getElementById("nav-overlay");

    // Mobile search elements
    const mobileSearchBtn = document.getElementById("mobile-search-btn");
    const mobileSearchPanel = document.getElementById("mobile-search-panel");
    const mobileSearchClose = document.getElementById("mobile-search-close");
    const mobileSearchInput = document.getElementById("mobile-search-input");

    // Menu user elements in drawer
    const menuUserName = document.getElementById("menu-user-name");
    const menuUserToggle = document.getElementById("menu-user-toggle");
    const menuUserDropdown = document.getElementById("menu-user-dropdown");
    const menuUserLogin = document.getElementById("menu-user-login");
    const menuUserLogout = document.getElementById("menu-user-logout");

    // Nav 'Vợt' dropdown toggle on mobile (smooth slide)
    const navCategoryToggle = document.querySelector('.main-nav .dropdown > a');

    // Toast element
    const toastEl = document.getElementById('toast');

    function showToast(message, type = 'info', duration = 2500) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = `toast ${type} show`;
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, duration);
    }

    // --- Hàm trợ giúp ---

    // Hàm lấy danh sách người dùng từ localStorage
    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Hàm lấy người dùng hiện tại
    function getCurrentUser() {
        const curUser = localStorage.getItem(CURRENT_USER_KEY);
        return curUser ? JSON.parse(curUser) : [];
    }

    // Hàm hiển thị thông báo lỗi
    function showError(element, message) {
        element.textContent = message;
        element.classList.remove("hidden");
    }

    // Hàm ẩn thông báo lỗi
    function hideError(element) {
        element.textContent = "";
        element.classList.add("hidden");
    }

    // Hàm ẩn/hiện modal
    function showModal() {
        authModal.classList.remove("hidden");
    }
    function hideModal() {
        authModal.classList.add("hidden");
        // Reset form khi đóng
        hideError(loginError);
        hideError(registerError);
        loginForm.reset();
        registerForm.reset();
        showLoginView(); // Luôn quay về form đăng nhập
    }

    // Hàm chuyển đổi giữa 2 form
    function showRegisterView() {
        loginFormContainer.classList.add("hidden");
        registerFormContainer.classList.remove("hidden");
    }
    function showLoginView() {
        registerFormContainer.classList.add("hidden");
        loginFormContainer.classList.remove("hidden");
    }

    // --- Hàm cập nhật UI dựa trên trạng thái đăng nhập ---
    function checkLoginStatus() {
        const currentUser = getCurrentUser();
        if (currentUser.account) {
            // Đã đăng nhập
            console.log("Da dang nhap");
            loginRegisterBtn.classList.add("hidden");
            userInfo.classList.remove("hidden");
            const username = currentUser.account;
            welcomeMsg.textContent = `Chào, ${username}`;

            // Cập nhật khối user trong menu trái (mobile)
            if (menuUserName) menuUserName.textContent = username;
            if (menuUserLogin) menuUserLogin.classList.add("hidden");
            if (menuUserLogout) menuUserLogout.classList.remove("hidden");
        } else {
            // Chưa đăng nhập
            console.log("chua dang nhap");
            loginRegisterBtn.classList.remove("hidden");
            userInfo.classList.add("hidden");
            welcomeMsg.textContent = "";

            // Trạng thái khách trong menu trái
            if (menuUserName) menuUserName.textContent = "Guest";
            if (menuUserLogin) menuUserLogin.classList.remove("hidden");
            if (menuUserLogout) menuUserLogout.classList.add("hidden");
        }
    }

    // --- Hàm xử lý Logic ---

    // Xử lý Đăng ký
    function handleRegister(event) {
        event.preventDefault();
        const account = document.getElementById("register-account").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;

        if (password !== confirmPassword) {
            showError(registerError, "Mật khẩu không khớp!");
            return;
        }

        const users = getUsers();
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            showError(registerError, "Email này đã được sử dụng!");
            return;
        }

        // Mã hóa mật khẩu (đơn giản, không an toàn cho sản phẩm thật)
        const hashedPassword = "hashed_" + password; 
        
        users.push({ account: account, email: email, password: hashedPassword });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        showToast("Đăng ký thành công! Vui lòng đăng nhập.", 'success');
        registerForm.reset();
        showLoginView();
    }

    // Xử lý Đăng nhập
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const hashedPassword = "hashed_" + password; // giải mã hóa

        const users = getUsers();
        const user = users.find(user => user.account && user.email === email && user.password === hashedPassword);

        if (user) {
            // Đăng nhập thành công
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            hideModal();
            checkLoginStatus();
            showToast("Đăng nhập thành công.", 'success');
        } else {
            // Sai thông tin
            showError(loginError, "Email hoặc Mật khẩu không đúng.");
        }
    }

    // Xử lý Đăng xuất
    function handleLogout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        checkLoginStatus();
    }

    // Xử lý khi nhấn vào Giỏ hàng
    function handleCartClick(event) {
        const currentUser = getCurrentUser();
        if (!currentUser.account) {
            event.preventDefault(); // Chặn chuyển trang
            showToast("Vui lòng đăng nhập để xem giỏ hàng!", 'info');
            showModal(); // Hiển thị modal đăng nhập
        }
        // Nếu đã đăng nhập, trình duyệt sẽ tự động đi tiếp
    }

    // Mở/Đóng Modal
    loginRegisterBtn.addEventListener("click", showModal);
    closeModalBtn.addEventListener("click", hideModal);
    
    // Đóng modal khi nhấn ra ngoài
    authModal.addEventListener("click", (event) => {
        if (event.target === authModal) {
            hideModal();
        }
    });

    // Chuyển đổi form
    showRegisterLink.addEventListener("click", (e) => { e.preventDefault(); showRegisterView(); });
    showLoginLink.addEventListener("click", (e) => { e.preventDefault(); showLoginView(); });

    // Submit form
    registerForm.addEventListener("submit", handleRegister);
    loginForm.addEventListener("submit", handleLogin);

    // Đăng xuất
    logoutBtn.addEventListener("click", handleLogout);

    // Giỏ hàng
    cartLink.addEventListener("click", handleCartClick);

    // --- Mobile menu toggle ---
    function closeMobileMenu() {
        if (mainNav) mainNav.classList.remove("open");
        if (navOverlay) navOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    function toggleMobileMenu() {
        if (!mainNav) return;
        const willOpen = !mainNav.classList.contains("open");
        mainNav.classList.toggle("open", willOpen);
        if (navOverlay) navOverlay.classList.toggle("show", willOpen);
        document.body.style.overflow = willOpen ? "hidden" : "";
    }

    if (menuToggleBtn) menuToggleBtn.addEventListener("click", toggleMobileMenu);
    if (navOverlay) navOverlay.addEventListener("click", closeMobileMenu);

    // --- Mobile search toggle ---
    function openMobileSearch() {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.add("show");
        mobileSearchPanel.setAttribute("aria-hidden", "false");
        setTimeout(() => mobileSearchInput && mobileSearchInput.focus(), 0);
    }
    function closeMobileSearch() {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.remove("show");
        mobileSearchPanel.setAttribute("aria-hidden", "true");
    }
    if (mobileSearchBtn) mobileSearchBtn.addEventListener("click", () => {
        closeMobileMenu();
        openMobileSearch();
    });
    if (mobileSearchClose) mobileSearchClose.addEventListener("click", closeMobileSearch);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileSearch();
            closeMobileMenu();
        }
    });

    // --- Drawer user block interactions ---
    if (menuUserToggle) menuUserToggle.addEventListener("click", () => {
        const willOpen = !menuUserDropdown.classList.contains("show");
        menuUserDropdown.classList.toggle("show", willOpen);
        menuUserToggle.setAttribute("aria-expanded", String(willOpen));
    });
    if (menuUserLogin) menuUserLogin.addEventListener("click", () => {
        closeMobileMenu();
        showModal();
    });
    if (menuUserLogout) menuUserLogout.addEventListener("click", () => {
        handleLogout();
        closeMobileMenu();
    });

    checkLoginStatus();

    // Toggle the 'Vợt' submenu when clicked (primarily for mobile)
    if (navCategoryToggle) {
        navCategoryToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = navCategoryToggle.closest('.dropdown');
            if (!parentLi) return;
            parentLi.classList.toggle('open');
        });
    }

    // Desktop user dropdown (logged-in): click to toggle small dropdown box
    const desktopUserInfo = document.getElementById('user-info');
    const desktopUserDropdown = document.getElementById('dropdown-user');
    if (desktopUserInfo && desktopUserDropdown) {
        desktopUserInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = desktopUserDropdown.style.display === 'block';
            desktopUserDropdown.style.display = isShown ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
            desktopUserDropdown.style.display = 'none';
        });
    }
   // === GIỎ HÀNG ===
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Hiển thị / ẩn giỏ hàng
cartLink.addEventListener("click", (e) => {
  e.preventDefault();
  if (localStorage.getItem("proBadmintonCurrentUser")) {
    cartModal.classList.remove("hidden");
    renderCart();
  } else {
    alert("Vui lòng đăng nhập để sử dụng giỏ hàng!");
  }
});
closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

// Thêm sản phẩm
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const card = btn.closest(".product-card");
    const name = card.querySelector("h3").innerText;
    const price = card.querySelector(".product-price").innerText;
    const img = card.querySelector("img").src;

    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, img, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast("Đã thêm vào giỏ hàng!");
  });
});

// Render giỏ hàng
function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const priceNum = parseInt(item.price.replace(/\D/g, ""));
    total += priceNum * item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="">
      <h4>${item.name}</h4>
      <p>${item.price}</p>
      <div>
        <button class="minus" data-i="${i}">-</button>
        <span>${item.qty}</span>
        <button class="plus" data-i="${i}">+</button>
        <button class="remove" data-i="${i}">X</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.innerText = total.toLocaleString("vi-VN") + "đ";
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Nút + - xóa
cartItemsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("plus")) {
    cart[e.target.dataset.i].qty++;
  } else if (e.target.classList.contains("minus")) {
    if (cart[e.target.dataset.i].qty > 1) cart[e.target.dataset.i].qty--;
  } else if (e.target.classList.contains("remove")) {
    cart.splice(e.target.dataset.i, 1);
  }
  renderCart();
  updateCartCount();
});

// Cập nhật số lượng trên icon
function updateCartCount() {
  document.querySelector(".cart-count").innerText = cart.reduce((s, i) => s + i.qty, 0);
}
updateCartCount();

// Hiện địa chỉ mới
document.querySelectorAll("input[name='address-option']").forEach(r => {
  r.addEventListener("change", () => {
    document.getElementById("new-address").classList.toggle("hidden", r.value !== "new");
  });
});

// Xem lại đơn hàng
checkoutBtn.addEventListener("click", () => {
  alert("Cảm ơn bạn! Đơn hàng đã được ghi nhận.\n(Tính năng thanh toán demo)");
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
  cartModal.classList.add("hidden");
});
 
});
