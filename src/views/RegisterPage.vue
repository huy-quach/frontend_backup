<template>
  <div class="register-wrapper">
    <div class="register-box">
      <!-- Tiêu đề -->
      <h2 class="register-title">Đăng ký tài khoản</h2>

      <!-- Thông báo đăng ký thành công -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Form đăng ký (ẩn khi hiển thị thông báo thành công) -->
      <div v-else>
        <!-- Form nhập Name -->
        <div class="input-group">
          <label for="name">Họ tên:</label>
          <div class="input-wrapper">
            <input type="text" v-model="name" placeholder="Nhập họ và tên" :class="{ 'input-error': errors.name }" />
          </div>
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>

        <!-- Form nhập Email -->
        <div class="input-group">
          <label for="email">Email:</label>
          <div class="input-wrapper">
            <input type="email" v-model="email" placeholder="Nhập địa chỉ email" :class="{ 'input-error': errors.email }" />
          </div>
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <!-- Form nhập Password -->
        <div class="input-group">
          <label for="password">Mật khẩu:</label>
          <div class="input-wrapper">
            <input type="password" v-model="password" placeholder="Nhập mật khẩu" :class="{ 'input-error': errors.password }" />
          </div>
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <!-- Nút đăng ký -->
        <button class="register-button" @click="handleSubmit">Đăng ký</button>

        <!-- Footer Links -->
        <div class="footer-links">
          <span @click="goToLogin">Đã có tài khoản? <strong>Đăng nhập ngay</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      successMessage: "",
      errors: {}, // Để lưu các thông báo lỗi
    };
  },
  methods: {
    validateForm() {
      this.errors = {}; // Đặt lại lỗi trước khi kiểm tra

      // Kiểm tra tên
      if (!this.name) {
        this.errors.name = "Vui lòng điền tên của bạn.";
      }

      // Kiểm tra email
      const emailPattern =
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!this.email) {
        this.errors.email = "Vui lòng nhập email.";
      } else if (!emailPattern.test(this.email)) {
        this.errors.email = "Định dạng email không hợp lệ.";
      }

      // Kiểm tra mật khẩu
      if (!this.password) {
        this.errors.password = "Vui lòng nhập mật khẩu.";
      } else if (this.password.length < 4 || this.password.length > 16) {
        this.errors.password = "Mật khẩu phải từ 4 đến 16 ký tự.";
      }

      // Trả về true nếu không có lỗi
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
  if (this.validateForm()) {
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name: this.name,
        email: this.email,
        password: this.password,
      });
      this.successMessage = "Đăng ký thành công! Đang chuyển hướng...";
      setTimeout(() => {
        this.$router.push("/login");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Nếu server trả lỗi email đã tồn tại
        this.errors.email = "Email đã tồn tại. Vui lòng sử dụng email khác.";
      } else {
        console.error(error);
        this.successMessage = "Đăng ký không thành công. Vui lòng thử lại.";
      }
    }
  }
},
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.register-button {
  background-color: #4e73df;
    color: white;
    border-radius: 8px;
    padding: 0.9rem;
    font-weight: bold;
}
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #81ecec, #6c5ce7);
}

.register-box {
  background-color: white;
  padding: 2.5rem 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 400px;
}

.register-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #000;
}

.success-message {
  color: #28a745;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column; /* Sắp xếp label và input theo chiều dọc */
  margin-bottom: 1.5rem;
}
.input-group label {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem; /* Khoảng cách giữa label và input */
  color: #000;;
}
.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 0.8rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}
.input-wrapper:focus-within {
  border-color: #6c5ce7; /* Đổi màu viền khi input được focus */
}

input {
  flex-grow: 1;
  border: none;
  outline: none;
  background: none;
  padding-left: 0.7rem;
  font-size: 1rem;
  color: #333; /* Màu chữ trong input */
}
input::placeholder {
  color: #aaa; /* Màu chữ placeholder */
}


.register-button {
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  font-weight: bold;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #5a49d6;
}

.footer-links {
  text-align: center;
  font-size: 0.9rem;
  color: #333;
  margin-top: 1.5rem;
}

.footer-links span {
  color: #333;
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

.input-error {
  border-color: red; /* Viền màu đỏ khi có lỗi */
}

</style>
