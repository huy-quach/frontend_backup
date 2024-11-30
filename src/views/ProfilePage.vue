<template>
    <div class="profile-container">
        <h2>Cập nhật thông tin cá nhân</h2>
        <form @submit.prevent="updateProfile">
            <!-- Personal Info -->
            <div class="form-group">
                <label for="name">Tên:</label>
                <input type="text" id="name" v-model="user.name" class="form-control" />
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="user.email" class="form-control" disabled />
            </div>

            <!-- Change Password Section -->
            <h3>Thay đổi mật khẩu</h3>
            <!-- Hiển thị input nhập mật khẩu cũ nếu người dùng đã có mật khẩu -->
            <div class="form-group" v-if="userHasPassword">
                <label for="currentPassword">Mật khẩu hiện tại:</label>
                <input type="password" id="currentPassword" v-model="passwordData.currentPassword"
                    class="form-control" />
                <p v-if="errors.currentPassword" class="text-danger">{{ errors.currentPassword }}</p>
            </div>

            <div class="form-group">
                <label for="newPassword">Mật khẩu mới:</label>
                <input type="password" id="newPassword" v-model="passwordData.newPassword" class="form-control" />
                <p v-if="errors.newPassword" class="text-danger">{{ errors.newPassword }}</p>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Xác nhận mật khẩu mới:</label>
                <input type="password" id="confirmPassword" v-model="passwordData.confirmPassword"
                    class="form-control" />
                <p v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</p>
            </div>

            <button type="submit" class="btn-primary">Thay đổi</button>
        </form>

        <!-- Success Notification Modal -->
        <div v-if="showSuccessMessage" class="modal-overlay">
            <div class="modal-content">
                <h3>Thông báo thành công!</h3>
                <p>Thông tin của bạn đã được thay đổi.</p>
                <button @click="closeModal" class="custom-close-btn">Đóng</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: '',
                email: '',
                password: null // Mặc định không có mật khẩu
            },
            passwordData: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            errors: {
                currentPassword: null,
                newPassword: null,
                confirmPassword: null,
            },
            showSuccessMessage: false
        };
    },
    computed: {
        userData() {
            return this.$store.state.user;
        },
        userHasPassword() {
            return this.user.password !== null; // Kiểm tra người dùng có mật khẩu không
        }
    },
    mounted() {
        if (this.userData) {
            this.user.name = this.userData.name;
            this.user.email = this.userData.email;
            this.user.password = this.userData.password; // Lấy mật khẩu từ user
        } else {
            console.error("User data not found in store");
        }
    },
    methods: {
        async updateProfile() {
            this.clearErrors();

            // Kiểm tra điều kiện chỉ nếu người dùng có mật khẩu cũ
            if (this.userHasPassword && !this.passwordData.currentPassword) {
                this.errors.currentPassword = "Please enter your current password.";
            }
            if (!this.passwordData.newPassword) {
                this.errors.newPassword = "Please enter a new password.";
            }
            if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
                this.errors.confirmPassword = "Passwords do not match.";
            }

            if (!this.errors.currentPassword && !this.errors.newPassword && !this.errors.confirmPassword) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error("Token not found");

                    const response = await fetch('http://localhost:5000/api/users/profile', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: this.user.name,
                            currentPassword: this.passwordData.currentPassword,
                            newPassword: this.passwordData.newPassword,
                        }),
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message);

                    this.showSuccessMessage = true;
                } catch (error) {
                    this.errors.currentPassword = "Incorrect current password.";
                }
            }
        },
        clearErrors() {
            this.errors.currentPassword = null;
            this.errors.newPassword = null;
            this.errors.confirmPassword = null;
        },
        closeModal() {
            this.showSuccessMessage = false;
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.profile-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-container h2 {
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
}

.profile-container h3 {
    font-size: 1.5rem;
    color: #555;
    margin-bottom: 15px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    font-weight: 500;
    color: #333;
    font-size: 1rem;
}

.form-control {
    border-radius: 8px;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
}

.btn-primary {
    width: 100%;
    padding: 12px;
    font-size: 1.2rem;
    font-weight: 500;
    background-color: #007bff;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    margin: 0 auto;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.modal-content p {
    font-size: 1rem;
    margin-bottom: 20px;
}

.custom-close-btn {
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 0 auto;
}

.custom-close-btn:hover {
    background-color: #c82333;
}
</style>