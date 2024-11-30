<template>
    <div class="admin-dashboard">
        <!-- Thanh điều hướng trên cùng -->
        <nav class="top-nav">
            <div class="top-nav-content">
                <div class="logo-placeholder">
                    <span class="logo">LuxFur</span>
                </div>
                <div class="back-button">
                    <router-link to="/" class="back-link">
                        <i class="fas fa-arrow-left"></i> Quay về
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- Sidebar -->
        <aside class="sidebar">
            <ul class="nav-list">
                <li>
                    <router-link to="/admin-board" class="nav-link">
                        <i class="fas fa-home"></i>
                        Trang chủ
                    </router-link>
                </li>
                <li v-if="isAdminOrEmployee">
                    <router-link to="/manage-inventory" class="nav-link">
                        <i class="fas fa-warehouse"></i>
                        Quản lý kho hàng
                    </router-link>
                </li>
                <li v-if="isAdminOrEmployee">
                    <router-link to="/manage-orders" class="nav-link">
                        <i class="fas fa-shopping-cart"></i>
                        Quản lý đơn hàng
                    </router-link>
                </li>
                <li v-if="isAdminOrEmployee">
                    <router-link to="/manage-furniture" class="nav-link">
                        <i class="fas fa-couch"></i>
                        Quản lý sản phẩm
                    </router-link>
                </li>
                <li v-if="isAdminOrEmployee"> 
                    <router-link to="/import-history" class="nav-link"> 
                        <i class="fas fa-history"></i> Lịch sử nhập hàng 
                    </router-link> 
                </li>
                <li v-if="isAdmin">
                    <router-link to="/manage-employee" class="nav-link">
                        <i class="fas fa-user-tie"></i>
                        Quản lý nhân viên
                    </router-link>
                </li>
                <li v-if="isAdmin">
                    <router-link to="/manage-testimonials" class="nav-link">
                        <i class="fas fa-comments"></i>
                        Quản lý phản hồi
                    </router-link>
                </li>
                <li v-if="isAdmin">
                    <router-link to="/manage-blog" class="nav-link">
                        <i class="fas fa-blog"></i>
                        Quản lý tin tức
                    </router-link>
                </li>
                <li v-if="isAdmin">
                    <router-link to="/manage-carousel" class="nav-link">
                        <i class="fas fa-images"></i>
                        Quản lý Carousel
                    </router-link>
                </li>
                <li v-if="isAdmin">
                    <router-link to="/manage-hidden-furniture" class="nav-link">
                        <i class="fas fa-eye-slash"></i>
                        Sản phẩm ẩn
                    </router-link>
                </li>
                <li v-if="isAdminOrEmployee">
                    <router-link to="/manage-banned-words" class="nav-link  active">
                        <i class="fas fa-ban"></i>
                        Quản lý từ khóa
                    </router-link>
                </li>
            </ul>
        </aside>

        <!-- Nội dung chính -->
        <div class="main-content">
            <header class="admin-header">
                <h1>Quản lý từ khóa</h1>
            </header>
            <section>
                <div class="form-section">
                    <h3>Thêm từ khóa cấm</h3>
                    <div class="input-group">
                        <input
                            v-model="newWord"
                            type="text"
                            placeholder="Nhập từ khóa cấm"
                            @keyup.enter="addBannedWord"
                        />
                        <button @click="addBannedWord" class="btn btn-primary">Thêm</button>
                    </div>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                </div>
                <div class="banned-words-list">
                    <h3>Danh sách từ khóa cấm</h3>
                    <ul>
                        <li v-for="word in bannedWords" :key="word._id">
                            {{ word.word }}
                            <button
                                @click="deleteBannedWord(word._id)"
                                class="btn btn-danger"
                            >
                                Xóa
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';
export default {
    data() {
        return {
            newWord: "", // Từ khóa mới cần thêm
            bannedWords: [], // Danh sách từ khóa cấm
            errorMessage: "", // Thông báo lỗi
        };
    },
    computed: {
        ...mapState(['user']),
        isAdmin() {
            return this.user && this.user.role === 'admin';
        },
        isAdminOrEmployee() {
            return this.user && (this.user.role === 'admin' || this.user.role === 'employee');
        },
    },
    mounted() {
        this.fetchBannedWords();
    },
    methods: {
        async fetchBannedWords() {
            try {
                const response = await axios.get("http://localhost:5000/api/banned-words", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                this.bannedWords = response.data;
            } catch (error) {
                console.error("Error fetching banned words:", error);
            }
        },
        async addBannedWord() {
            if (!this.newWord) {
                this.errorMessage = "Vui lòng nhập từ khóa.";
                return;
            }
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/banned-words",
                    { word: this.newWord },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.bannedWords.push(response.data.bannedWord);
                this.newWord = "";
                this.errorMessage = "";
            } catch (error) {
                console.error("Error adding banned word:", error);
                this.errorMessage =
                    error.response?.data?.message || "Lỗi khi thêm từ khóa.";
            }
        },
        async deleteBannedWord(wordId) {
            try {
                await axios.delete(`http://localhost:5000/api/banned-words/${wordId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                this.bannedWords = this.bannedWords.filter((word) => word._id !== wordId);
            } catch (error) {
                console.error("Error deleting banned word:", error);
                this.errorMessage = "Lỗi khi xóa từ khóa.";
            }
        },
    },
};
</script>

<style scoped>
/* Top nav and sidebar */
.top-nav {
  background-color: #1a202c;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.top-nav-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.logo-placeholder .logo {
  font-size: 24px;
  font-weight: bold;
  color: #48bb78;
}

.back-button .back-link {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.back-button .back-link i {
  margin-right: 8px;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background-color: #2d3748;
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
}

.nav-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Styles for the description cell */
.product-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link {
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  font-size: 16px;
  background-color: #2d3748;
  border-radius: 5px;
  transition: background-color 0.3s ease, padding-left 0.3s ease;
  white-space: nowrap;
  /* Thêm thuộc tính này để ngăn xuống dòng */
}

.nav-link i {
  margin-right: 10px;
}

.nav-link.active {
  background-color: #1a202c;
}

.nav-link:hover {
  background-color: #1a202c;
  padding-left: 10px;
  /* Điều chỉnh padding khi hover để giữ đúng khoảng cách */
  white-space: nowrap;
  /* Đảm bảo không xuống dòng khi hover */
}
/* Cải thiện style cho main-content */
.main-content {
  margin-top: 60px;
  margin-left: 240px;
  padding: 20px;
  background-color: #f4f5f7; /* Màu nền nhẹ nhàng */
  border-radius: 8px; /* Bo góc nhẹ */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng */
}

/* Header cải thiện */
.admin-header {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

/* Form section */
.form-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-section h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #555;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group input {
  flex-grow: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}

.input-group input:focus {
  border-color: #48bb78;
  box-shadow: 0 0 3px rgba(72, 187, 120, 0.5);
}

.input-group .btn {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.input-group .btn-primary {
  background-color: #48bb78;
  color: white;
  border: none;
}

.input-group .btn-primary:hover {
  background-color: #3ca566;
}

/* Banned words list */
.banned-words-list {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banned-words-list h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #555;
}

.banned-words-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.banned-words-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

.banned-words-list li:last-child {
  border-bottom: none;
}

.banned-words-list li .btn-danger {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
}

.banned-words-list li .btn-danger:hover {
  background-color: #c0392b;
}

/* Error message */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .sidebar {
    position: relative;
    width: 100%;
  }
}

</style>
