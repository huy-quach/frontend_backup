<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đã đổi tên hoặc tạm thời không khả dụng.
      </p>
      <router-link to="/" class="home-button">Trang chủ</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "404Error",
  mounted() {
    // Ẩn Navbar và Footer khi vào trang 404
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');

    if (navbar) {
      navbar.style.display = 'none';
    }

    if (footer) {
      footer.style.display = 'none';
    }
  },
  beforeUnmount() {
    // Hiện lại Navbar và Footer khi rời khỏi trang 404
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');

    if (navbar) {
      navbar.style.display = 'block';
    }

    if (footer) {
      footer.style.display = 'block';
    }
  }
};
</script>

<style scoped>
.error-page {
  height: 100vh;
  background-color: #1c1c1c;
  /* Màu nền tối */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-content {
  color: white;
  font-family: 'Arial', sans-serif;
}

.error-code {
  font-size: 10rem;
  font-weight: bold;
  color: #ff9900;
  /* Màu cam nổi bật */
}

.error-message {
  font-size: 1.2rem;
  margin: 1.5rem 0;
  color: #bbb;
}

.home-button {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  background-color: #ff9900;
  /* Màu cam cho nút */
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #e68a00;
}
</style>
