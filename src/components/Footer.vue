<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <!-- Logo và tên thương hiệu -->
        <div class="footer-brand">
          <img src="@/assets/logo.png" alt="LuxiFur Logo" class="footer-logo" />
          <span class="brand-name">LuxiFur</span>
        </div>

        <!-- Liên kết nhanh -->
        <div class="footer-links">
          <h4>Liên kết</h4>
          <ul class="quick-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/blog">Tin tức</a></li>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/contact">Liên lạc</a></li>
            <li><a href="/product">Sản phẩm</a></li>
          </ul>
        </div>

        <!-- Contact Us -->
        <div class="footer-contact">
          <h4>Địa chỉ</h4>
          <ul>
            <li><i class="fas fa-envelope"></i> huyquach@luxifur.com</li>
            <li><i class="fas fa-phone"></i> (+84) 335-854-405</li>
            <li><i class="fas fa-map-marker-alt"></i> Can Tho City</li>
          </ul>
        </div>
      </div>

      <!-- Phần dưới cùng -->
      <div class="footer-bottom">
        <div class="footer-left">
          <p>© 2024 LuxiFur. Mọi thứ được đăng ký bởi LuxiFur!</p>
        </div>
        <div class="footer-right">
          <ul class="social-links">
            <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
            <li><a href="#"><i class="fab fa-twitter"></i></a></li>
            <li><a href="#"><i class="fab fa-github"></i></a></li>
            <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent"
};
</script>

<style scoped>
/* Tổng thể Footer */
.footer {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem 0;
  width: 100%;
  border-top: 1px solid #eaeaea;
}

/* Container chính */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Phần trên của footer */
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

/* Logo và tên thương hiệu */
.footer-brand {
  display: flex;
  align-items: center;
}

.footer-logo {
  height: 50px;
  margin-right: 10px;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
}

/* Liên kết nhanh */
.footer-links {
  text-align: left;
}

.footer-links h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.quick-links {
  list-style: none;
  padding: 0;
}

.quick-links li {
  margin-bottom: 0.5rem;
}

.quick-links li a {
  color: #ffffff;
  text-decoration: none;
}

.quick-links li a:hover {
  color: #ff6600;
  text-decoration: underline;
}

/* Phần Contact Us */
.footer-contact h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.footer-contact ul {
  list-style: none;
  padding: 0;
}

.footer-contact li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.footer-contact li i {
  margin-right: 0.5rem;
}

/* Phần dưới của footer */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-top: 1px solid #333;
  padding-top: 1.5rem;
}

/* Thông tin bản quyền */
.footer-left p {
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
}

/* Liên kết mạng xã hội */
.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
}

.social-links li a {
  color: #ffffff;
  font-size: 1.2rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links li a:hover {
  color: #ff6600;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
  }

  .footer-links,
  .footer-contact {
    margin-top: 2rem;
    text-align: center;
  }

  .footer-right {
    margin-top: 1rem;
  }
}
</style>
