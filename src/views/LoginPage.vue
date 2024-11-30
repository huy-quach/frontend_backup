<template>
  <div class="login-wrapper">
    <div class="login-box">
      <!-- Tiêu đề -->
      <h2 class="login-title">Đăng nhập</h2>

      <!-- Form nhập Email -->
      <div class="input-group">
        <label for="email">Email:</label>
        <div class="input-wrapper">
          <input
            type="email"
            v-model="email"
            placeholder="Nhập địa chỉ email..."
            @keyup.enter="login"
          />
        </div>
        <p v-if="!email && showError" class="error-message">Cần nhập email</p>
        <p v-if="email && !isEmailValid && showError" class="error-message">
          Email không đúng định dạng
        </p>
      </div>

      <!-- Form nhập Password -->
      <div class="input-group">
        <label for="password">Mật khẩu:</label>
        <div class="input-wrapper">
          <input
            type="password"
            v-model="password"
            placeholder="Nhập mật khẩu..."
            @keyup.enter="login"
          />
        </div>
        <p v-if="!password && showError" class="error-message">Cần nhập mật khẩu</p>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
      </div>

      <button class="login-button" @click="login">Đăng nhập</button>

      <div class="social-login">
        <span>Hoặc đăng nhập bằng</span>
        <button class="facebook-button" @click="loginWithFacebook">
          Đăng nhập bằng Facebook
        </button>
      </div>

      <div class="footer-links">
        <span @click="goToSignUp">Đăng ký</span>
        <span @click="toggleForgotPasswordModal">Quên mật khẩu?</span>
      </div>
    </div>

    <!-- Modal Quên Mật Khẩu -->
    <div v-if="isForgotPasswordModalVisible" class="modal-wrapper">
      <div class="login-box">
        <h2 class="login-title">Quên mật khẩu</h2>
        <div class="input-group">
          <label for="forgot-email">Email:</label>
          <div class="input-wrapper">
            <input
              type="email"
              v-model="forgotPasswordEmail"
              placeholder="Nhập địa chỉ email..."
            />
          </div>
        </div>
        <button class="login-button" @click="submitForgotPassword">
          Đồng ý
        </button>
        <button class="cancel-button" @click="toggleForgotPasswordModal">
          Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Import axios
export default {
  data() {
    return {
      email: "",
      password: "",
      loginError: "",
      showError: false,
      isForgotPasswordModalVisible: false,
      forgotPasswordEmail: "",
    };
  },
  computed: {
    isEmailValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.email);
    },
  },
  methods: {
    async login() {
      if (!this.email || !this.password || !this.isEmailValid) {
        this.showError = true;
        return;
      }
      this.showError = false;

      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");
      } catch (error) {
        console.error(
          "Login failed:",
          error.response ? error.response.data : error
        );
        this.loginError =
          error.response && error.response.data.message
            ? error.response.data.message
            : "Tài khoản hoặc mật khẩu không chính xác";
      }
    },
    loginWithFacebook() {
      window.location.href = "http://localhost:5000/auth/facebook";
    },
    goToSignUp() {
      this.$router.push("/register");
    },
    toggleForgotPasswordModal() {
      this.isForgotPasswordModalVisible = !this.isForgotPasswordModalVisible;
      if (!this.isForgotPasswordModalVisible) {
        this.forgotPasswordEmail = "";
      }
    },
    async submitForgotPassword() {
      if (!this.forgotPasswordEmail) {
        alert("Vui lòng nhập email.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.forgotPasswordEmail)) {
        alert("Email không đúng định dạng!");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/forgot-password",
          {
            email: this.forgotPasswordEmail,
          }
        );
        alert(response.data.message || "Email đặt lại mật khẩu đã được gửi!");
        this.toggleForgotPasswordModal();
      } catch (error) {
        console.error("Error in forgot password:", error);
        alert(
          error.response && error.response.data.message
            ? error.response.data.message
            : "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    },
  },
};
</script>

<style scoped>
/* Container tổng */
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cancel-button {
  background-color: #f4f4f9;
  color: #555;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  font-weight: bold;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.cancel-button:hover {
  background-color: #ddd;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #81ecec, #6c5ce7);
}

.login-box {
  background-color: white;
  padding: 2.5rem 3rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.input-group {
  width: 100%;
  margin-bottom: 1.2rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 0.7rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
}

input {
  flex-grow: 1;
  border: none;
  outline: none;
  background: none;
  padding-left: 0.7rem;
  font-size: 1rem;
}

.login-button {
  background-color: #4e73df;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  font-weight: bold;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #395bb5;
}

.social-login {
  text-align: center;
  margin-top: 0.5rem;
}

.facebook-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3b5998;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
}

.facebook-button:hover {
  background-color: #314d86;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.875rem;
  color: #555;
  margin-top: 1.5rem;
  cursor: pointer;
}

.footer-links span:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
