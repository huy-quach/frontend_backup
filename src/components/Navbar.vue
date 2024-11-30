<template>
  <header v-if="!is404Page" class="navbar-custom">
    <div class="navbar-container">
      <!-- Logo thương hiệu -->
      <div class="brand-logo">
        <a href="/" class="logo-link">
          <img src="@/assets/logo.png" alt="LuxiFur Logo" class="logo-image" />
          <span class="brand-text">LuxiFur</span>
        </a>
      </div>

      <!-- Điều hướng chính -->
      <nav class="nav-links">
        <a href="/" class="nav-item">Trang chủ</a>
        <a href="/product" class="nav-item">Sản phẩm</a>
        <a href="/about" class="nav-item">Giới thiệu</a>
        <a href="/blog" class="nav-item">Tin tức</a>
        <a href="/contact" class="nav-item">Liên lạc</a>
      </nav>

      <!-- Thanh tìm kiếm và Giỏ hàng -->
      <div class="search-and-cart">
        <!-- Thanh tìm kiếm -->
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="Tìm kiếm sản phẩm..." class="search-input"
            @input="searchProduct" />
          <!-- Nút micro -->
          <button class="voice-search-btn" @click="startVoiceRecognition">
            <i class="fas fa-microphone"></i>
          </button>
          <!-- Danh sách kết quả tìm kiếm -->
          <div v-if="products.length" class="search-results" :class="{ hidden: products.length === 0 }">
            <ul>
              <li v-for="product in products" :key="product._id" class="search-result-item"
                @click="goToProductDetail(product._id)">
                <img :src="`http://localhost:5000/uploads/${product.image}`" alt="Furniture Image"
                  class="furniture-image" />
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">{{ formatCurrencyVND(product.price) }}</div>
                </div>
              </li>
            </ul>
            <div class="view-more" @click="goToProductPage">Xem thêm...</div>
          </div>
        </div>
        &nbsp;

        <!-- Icon giỏ hàng -->
        <a href="/cart" class="cart-icon">
          <i class="fas fa-shopping-cart"></i>
          <span v-if="cartItemCount >= 0" class="cart-count">{{ cartItemCount }}</span>
        </a>
      </div>

      <!-- Dropdown menu cho Welcome và Logout -->
      <div v-if="isAuthenticated" class="auth-dropdown">
        <button class="dropdown-button">Xin chào, {{ user.name }}!</button>
        <div class="dropdown-content">
          <a href="/profile"><i class="fas fa-user icon"></i> Thông tin cá nhân</a>
          <a v-if="user && user.role === 'user'" href="/orders"><i class="fas fa-shopping-cart icon"></i> Đơn hàng</a>
          <!-- Mục Quản lý cho admin và employee -->
          <a v-if="user && (user.role === 'admin' || user.role === 'employee')" href="/admin-board"><i
              class="fas fa-cog icon"></i> Quản lý</a>

          <!-- Mục Quản lý giao hàng cho shipper -->
          <a v-if="user && user.role === 'shipper'" href="/manage-delivery"><i class="fas fa-truck icon"></i> Quản lý
            giao hàng</a>

          <a @click="logout" class="logout"><i class="fas fa-sign-out-alt icon"></i> Đăng xuất</a>
        </div>
      </div>

      <!-- Nút đăng ký và đăng nhập khi chưa đăng nhập -->
      <div v-else class="auth-buttons">
        <a href="/register" class="register-button">Đăng ký</a>
        <a href="/login" class="login-button">Đăng nhập</a>
      </div>

      <!-- Nút mở menu di động -->
      <button class="menu-toggle" @click="toggleMobileMenu">
        <span class="menu-icon">&#9776;</span>
      </button>
    </div>
  </header>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex";

export default {
  name: "NavbarComponent",
  data() {
    return {
      mobileMenuOpen: false,
      searchQuery: "",
      products: [],
    };
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["cartItemCount", "isAuthenticated"]),
    is404Page() {
      return this.$route.name === "Error404"; // Adjust this depending on your route setup
    },
  },
  methods: {
    formatCurrencyVND(amount) {
      return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },
    async startVoiceRecognition() {
      // Kiểm tra nếu trình duyệt hỗ trợ Web Speech API
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN"; // Thiết lập ngôn ngữ tiếng Việt
      recognition.interimResults = false; // Chỉ trả về kết quả cuối cùng

      recognition.start(); // Bắt đầu nhận diện

      recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript; // Kết quả giọng nói

        // Loại bỏ dấu chấm hoặc ký tự thừa
        transcript = transcript.trim().replace(/[.,!?]$/g, "");

        this.searchQuery = transcript; // Gán nội dung tìm kiếm
        this.searchProduct(); // Thực hiện tìm kiếm
      };

      recognition.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
        alert("Không thể nhận diện giọng nói. Vui lòng thử lại.");
      };

      recognition.onspeechend = () => {
        recognition.stop(); // Dừng nhận diện khi không có giọng nói
      };
    },
    searchProduct() {
      if (this.searchQuery.trim() !== "") {
        axios
          .get("http://localhost:5000/api/furniture/search", {
            params: {
              query: this.searchQuery,
            },
          })
          .then((response) => {
            // Giới hạn danh sách hiển thị 4 sản phẩm
            this.products = response.data.slice(0, 4);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      } else {
        this.products = [];
      }
    },
    goToProductPage() {
      this.products = []; // Xóa danh sách tìm kiếm
      this.$router.push(`/product?search=${this.searchQuery}`);
    },
    goToProductDetail(productId) {
      this.products = []; // Xóa danh sách tìm kiếm
      this.$router.push(`/product/${productId}`);
    },
    fetchFilteredProducts(query) {
      axios
        .get("http://localhost:5000/api/furniture/search", {
          params: { query },
        })
        .then((response) => {
          this.products = response.data;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    logout() {
      this.$store.dispatch("logout");
    },
    checkLoginFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const name = urlParams.get("name");
      const email = urlParams.get("email");

      if (token && name && email) {
        const user = { name, email };

        this.$store.commit("SET_USER", user);
        this.$store.commit("SET_TOKEN", token);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        window.history.replaceState({}, document.title, "/");
      }
    },
  },
  mounted() {
    this.checkLoginFromUrl();
    const searchQuery = this.$route.query.search;
    if (searchQuery) {
      this.searchQuery = searchQuery;
      this.fetchFilteredProducts(searchQuery);
    }
  },
  watch: {
    $route() {
      this.products = []; // Reset danh sách tìm kiếm khi route thay đổi
    },
  },

};
</script>


<style scoped>
.voice-search-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: -40px;
  /* Đặt nút chồng lên bên phải của input */
  color: #333;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.voice-search-btn:hover {
  color: #ff6600;
}

.view-more {
  text-align: center;
  margin-top: 10px;
  font-size: 1rem;
  color: #ff6600;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.3s ease;
}

.view-more:hover {
  color: #ff8533;
  text-decoration: underline;
}

.navbar-custom {
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
  padding: 1rem 2rem;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Container chính của Navbar */
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto;
}

/* Logo thương hiệu */
.brand-logo {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-image {
  height: 40px;
  margin-right: 8px;
}

.brand-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

/* Điều hướng chính */
.nav-links {
  display: flex;
  align-items: center;
}

.nav-item {
  margin-right: 1.5rem;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.nav-item:hover {
  color: #ff6600;
  transition: color 0.3s ease;
}

.search-and-cart {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
  /* Thu nhỏ kích thước của icon */
  color: #333;
  text-decoration: none;
}

.cart-icon i {
  font-size: 1.2rem;
  /* Điều chỉnh kích thước riêng của icon */
}

.cart-icon:hover {
  color: #ff6600;
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff6600;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  /* Điều chỉnh kích thước số lượng */
  font-weight: bold;
}

/* Thanh tìm kiếm */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 2px solid #eaeaea;
  border-radius: 30px;
  width: 270px;
  /* Tăng width thêm một chút */
  transition: border-color 0.3s ease;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #ff6600;
}

/* Danh sách kết quả tìm kiếm */
.search-results {
  position: absolute;
  top: 50px;
  background-color: white;
  width: 100%;
  max-width: 290px;
  /* Tăng max-width để phù hợp với input */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 8px;
  padding: 10px 0;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.search-results.hidden {
  opacity: 0;
  pointer-events: none;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: #f9f9f9;
}

.search-result-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.product-price {
  color: #ff6600;
  font-weight: bold;
}

/* Dropdown cho Welcome và Logout */
.auth-dropdown {
  position: relative;
  display: inline-block;
}

.auth-dropdown .dropdown-button {
  background-color: #fff;
  border: 2px solid #f58220;
  border-radius: 25px;
  color: #f58220;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.auth-dropdown .dropdown-button:hover {
  background-color: #f58220;
  color: white;
}

.auth-dropdown .dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
  width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1050;
  /* Đảm bảo dropdown luôn nằm trên các thành phần khác */
  padding: 10px 0;
}

.auth-dropdown:hover .dropdown-content {
  display: block;
}

.auth-dropdown .dropdown-content a {
  color: #f58220;
  padding: 12px 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.auth-dropdown .dropdown-content a:hover {
  background-color: #ff8533;
  color: #fff;
}

.auth-dropdown .dropdown-content a .icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.auth-dropdown .dropdown-content a.logout {
  font-weight: bold;
  color: #f00;
}

.auth-dropdown .dropdown-content a.logout:hover {
  background-color: #ff6666;
  color: white;
}

/* Menu di động */
.menu-toggle {
  display: none;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-icon {
  color: #333;
}

/* Nút Đăng ký và Đăng nhập */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-buttons .register-button,
.auth-buttons .login-button {
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 30px;
}

.auth-buttons .register-button {
  background-color: #ff6600;
  color: white;
  border: none;
}

.auth-buttons .register-button:hover {
  background-color: #ff8533;
}

.auth-buttons .login-button {
  background-color: transparent;
  color: #ff6600;
  border: 2px solid #ff6600;
}

.auth-buttons .login-button:hover {
  background-color: #ff8533;
  color: white;
  border-color: #ff8533;
}

@media (max-width: 768px) {

  .nav-links,
  .auth-buttons {
    display: none;
  }

  .menu-toggle {
    display: block;
  }
}
</style>