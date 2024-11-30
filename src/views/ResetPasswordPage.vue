<template>
    <div class="reset-password-wrapper">
        <div class="reset-password-box">
            <h2 class="reset-password-title">Đặt lại mật khẩu</h2>
            <div class="input-group">
                <label for="password">Mật khẩu mới:</label>
                <div class="input-wrapper">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                        type="password"
                        v-model="password"
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>
            </div>
            <div class="input-group">
                <label for="confirmPassword">Nhập lại mật khẩu:</label>
                <div class="input-wrapper">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                        type="password"
                        v-model="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </div>
            </div>
            <!-- Hiển thị thông báo lỗi hoặc thành công -->
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            <div class="button-group">
                <button class="reset-button" @click="resetPassword">Đồng ý</button>
                <button class="cancel-button" @click="goToLogin">Quay về</button>
            </div>
        </div>
    </div>
</template>



<script>
import axios from "axios";

export default {
    data() {
        return {
            password: "",
            confirmPassword: "",
            errorMessage: "",
            successMessage: "",
        };
    },
    methods: {
        async resetPassword() {
            // Kiểm tra mật khẩu không được bỏ trống
            if (!this.password || !this.confirmPassword) {
                this.errorMessage = "Vui lòng nhập đầy đủ cả hai trường mật khẩu.";
                return;
            }

            // Kiểm tra mật khẩu khớp nhau
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Mật khẩu không khớp. Vui lòng kiểm tra lại.";
                return;
            }

            try {
                // Lấy token từ URL
                const token = this.$route.params.token;

                // Gửi yêu cầu reset password
                const response = await axios.post(
                    `http://localhost:5000/api/users/reset-password/${token}`,
                    { password: this.password }
                );

                this.successMessage = response.data.message || "Mật khẩu đã được cập nhật.";
                this.errorMessage = "";
            } catch (error) {
                console.error("Reset password error:", error);
                this.errorMessage =
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : "Đã xảy ra lỗi. Vui lòng thử lại.";
                this.successMessage = "";
            }
        },
        goToLogin() {
            this.$router.push("/login");
        },
    },
};
</script>



<style scoped>


.reset-password-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9;
}

.reset-password-box {
    background-color: white;
    padding: 2.5rem 3rem;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reset-password-title {
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

ion-icon {
    margin-right: 0.5rem;
    color: #777;
    font-size: 1.2rem;
}

.reset-button {
    background-color: #4e73df;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.9rem;
    font-weight: bold;
    width: 100%;
    font-size: 1rem;
    cursor: pointer;
}

.reset-button:hover {
    background-color: #395bb5;
}

.error-message {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.success-message {
    color: green;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}
.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
}

.cancel-button {
    background-color: #f4f4f9;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0.9rem;
    font-weight: bold;
    width: 100%;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
}

.cancel-button:hover {
    background-color: #ddd;
}
</style>