<template>
    <div class="admin-dashboard">
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
                    <router-link to="/manage-hidden-furniture" class="nav-link active">
                        <i class="fas fa-eye-slash"></i>
                        Sản phẩm ẩn
                    </router-link>
                </li>
                <li v-if="isAdminOrEmployee">
                    <router-link to="/manage-banned-words" class="nav-link">
                        <i class="fas fa-ban"></i>
                        Quản lý từ khóa
                    </router-link>
                </li>
            </ul>
        </aside>

        <!-- Nội dung chính -->
        <div class="main-content">
            <header class="admin-header">
                <h1>Sản phẩm đã ẩn</h1>
            </header>

            <div class="table-responsive">
                <table class="furniture-table">
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Danh mục</th>
                            <th>Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in hiddenFurniture" :key="product._id">
                            <td>
                                <img :src="`http://localhost:5000/uploads/${product.image}`" alt="Product Image"
                                    class="product-image" />
                            </td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.description }}</td>
                            <td>{{ formatCurrencyVND(product.price) }}</td>
                            <td>{{ product.category }}</td>
                            <td>
                                <button @click="unhideProduct(product._id)" class="btn btn-success">Bỏ ẩn</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';
export default {
    data() {
        return {
            hiddenFurniture: [],
        };
    },
    computed: {
        ...mapState(['user']), // Lấy thông tin user từ Vuex store

        isAdmin() {
            return this.user && this.user.role === 'admin';
        },
        isAdminOrEmployee() {
            return this.user && (this.user.role === 'admin' || this.user.role === 'employee');
        }
    },
    async created() {
        this.fetchHiddenFurniture();
    },
    methods: {
        async fetchHiddenFurniture() {
            try {
                const response = await axios.get("http://localhost:5000/api/furniture/hidden", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                this.hiddenFurniture = response.data;
            } catch (error) {
                console.error("Error fetching hidden furniture:", error);
            }
        },
        async unhideProduct(productId) {
            try {
                await axios.put(
                    `http://localhost:5000/api/furniture/${productId}/unhide`,
                    { active: true },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                this.fetchHiddenFurniture(); // Cập nhật lại danh sách sau khi bỏ ẩn
            } catch (error) {
                console.error("Error unhiding product:", error);
            }
        },
        formatCurrencyVND(amount) {
            return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
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

/* Main content */
.main-content {
    margin-top: 60px;
    margin-left: 240px;
    padding: 20px;
}

.admin-header h1 {
    font-size: 28px;
    margin-bottom: 20px;
}

/* Table styles */
.table-responsive {
    overflow-x: auto;
}

.furniture-table {
    width: 80%;
    /* Giới hạn chiều rộng của bảng */
    margin: 0 auto;
    /* Căn giữa bảng */
    border-collapse: collapse;
    text-align: center;
    /* Căn giữa nội dung */
}

.furniture-table th,
.furniture-table td {
    padding: 8px 12px;
    /* Giảm padding */
    border: 1px solid #ddd;
}

.furniture-table th {
    background-color: #f8f9fa;
    font-weight: bold;
}

.furniture-table td {
    background-color: #fff;
}

.product-image {
    max-width: 80px;
    border-radius: 5px;
}

/* Button styles */
.btn-success {
    background-color: #28a745;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    font-size: 14px;
}

.btn-success:hover {
    background-color: #218838;
}

/* Responsive adjustments */
@media (max-width: 768px) {

    .furniture-table th,
    .furniture-table td {
        padding: 6px 10px;
        font-size: 14px;
    }

    .btn-success {
        padding: 6px 10px;
        font-size: 14px;
    }
}
</style>
