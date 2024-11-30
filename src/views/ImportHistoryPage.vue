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
                    <router-link to="/import-history" class="nav-link active">
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
                <h1>Lịch sử nhập hàng</h1>
                <br>
                <div class="filter-section">
                    <input v-model="filter.keyword" type="text" placeholder="Tìm kiếm sản phẩm..."
                        @input="applyFilters" />
                    <input v-model="filter.supplier" type="text" placeholder="Nhà cung cấp..." @input="applyFilters" />
                    <input type="date" v-model="filter.date" @change="applyFilters" />
                </div>
            </header>

            <section>
                <div class="table-responsive" v-if="!loading">
                    <table class="import-history-table">
                        <thead>
                            <tr>
                                <th>Ngày nhập</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá gốc</th>
                                <th>Giá bán</th>
                                <th>Nhà cung cấp</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="record in filteredHistory" :key="record._id">
                                <td>{{ formatDate(record.entryDate) }}</td>
                                <td>{{ record.product?.name || "N/A" }}</td>
                                <td>{{ record.quantity }}</td>
                                <td>{{ formatCurrency(record.costPrice) }}</td>
                                <td>{{ formatCurrency(record.salePrice) }}</td>
                                <td>{{ record.supplier }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            loading: true, // Trạng thái tải dữ liệu
            filter: {
                keyword: "",
                supplier: "",
                date: "",
            },
            filteredHistory: [],
        };
    },
    computed: {
        ...mapState(['user']),
        ...mapState("importHistory", ["importHistory"]), // Lấy dữ liệu từ module importHistory
        isAdmin() {
            return this.user && this.user.role === "admin";
        },
        isAdminOrEmployee() {
            return (
                this.user &&
                (this.user.role === "admin" || this.user.role === "employee")
            );
        },
    },
    methods: {
        ...mapActions("importHistory", ["fetchImportHistory"]), // Gọi action fetchImportHistory từ module
        formatCurrency(value) {
            return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
        },
        formatDate(date) {
            if (!date) return "N/A"; // Trả về "N/A" nếu ngày không tồn tại
            try {
                const parsedDate = new Date(date); // Parse chuỗi ngày
                if (isNaN(parsedDate)) throw new Error("Invalid Date"); // Nếu không parse được, ném lỗi
                return parsedDate.toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }); // Định dạng ngày theo chuẩn Việt Nam
            } catch (error) {
                console.error("Lỗi định dạng ngày:", error);
                return "Invalid Date"; // Trả về "Invalid Date" nếu có lỗi
            }
        },
        applyFilters() {
            // Áp dụng bộ lọc tìm kiếm
            const keyword = this.filter.keyword.toLowerCase();
            const supplier = this.filter.supplier.toLowerCase();
            const date = this.filter.date;

            this.filteredHistory = this.importHistory.filter((record) => {
                const matchesKeyword =
                    !keyword || (record.product?.name || "").toLowerCase().includes(keyword);
                const matchesSupplier =
                    !supplier || record.supplier.toLowerCase().includes(supplier);
                const matchesDate = !date || record.date.startsWith(date);

                return matchesKeyword && matchesSupplier && matchesDate;
            });
        },
    },
    async mounted() {
        this.loading = true;
        await this.fetchImportHistory(); // Gọi action để tải dữ liệu lịch sử nhập hàng
        this.filteredHistory = this.importHistory; // Khởi tạo dữ liệu hiển thị
        this.loading = false;
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
    white-space: nowrap;
}

/* Cải thiện style cho main-content */
.main-content {
    margin-top: 60px;
    margin-left: 240px;
    padding: 20px;
    background-color: #f4f5f7;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

/* Table and filters styling */
.filter-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.filter-section input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* Table styles */
.import-history-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    margin-top: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.import-history-table th,
.import-history-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
}

.import-history-table th {
    background-color: #f9fafb;
    font-weight: bold;
}

.import-history-table tr:hover {
    background-color: #f1f5f9;
}

@media (max-width: 768px) {
    .main-content {
        margin-left: 0;
    }

    .sidebar {
        width: 100%;
    }
}
</style>
