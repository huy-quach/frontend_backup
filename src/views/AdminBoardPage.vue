<template>
    <div class="admin-dashboard">
        <!-- Thanh điều hướng trên cùng -->
        <nav class="top-nav">
            <div class="top-nav-content">
                <div class="logo-placeholder">
                    <span class="logo">LuxFur</span> <!-- Logo hoặc biểu tượng ở góc trái -->
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
                    <router-link to="/admin-board" class="nav-link active">
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
                <h1>Báo cáo chung</h1>
            </header>
            <!-- Báo cáo chung -->
            <section class="grid-overview">
                <div class="grid-item">
                    <h3>Đơn hàng</h3>
                    <p v-if="orderCount > 0">{{ orderCount }}</p>
                    <p v-else style="font-size: 1.2rem;">Không có</p>
                </div>
                <div class="grid-item">
                    <h3>Sản phẩm</h3>
                    <p v-if="furnitureCount > 0">{{ furnitureCount }}</p>
                    <p v-else style="font-size: 1.2rem;">Không có</p>
                </div>
                <div class="grid-item">
                    <h3>Nhân viên</h3>
                    <p v-if="employeeCount > 0">{{ employeeCount }}</p>
                    <p v-else style="font-size: 1.2rem;">Không có</p>
                </div>
                <div class="grid-item">
                    <h3>Nhân viên giao hàng</h3>
                    <p v-if="shipperCount > 0">{{ shipperCount }}</p>
                    <p v-else style="font-size: 1.2rem;">Không có</p>
                </div>
            </section>
            <br>
            <!-- Mục thống kê -->
            <header class="admin-header">
                <h1>Thống kê tại LuxFur</h1>
            </header>
            <section class="statistics-section">
                <div class="grid-overview">
                    <div class="grid-item">
                        <h3>Doanh thu</h3>
                        <p>{{ currencyFormat(revenue) }}</p>
                    </div>
                    <div class="grid-item">
                        <h3>Chi phí vốn hàng</h3>
                        <p>{{ currencyFormat(cogs) }}</p>
                    </div>
                    <div class="grid-item">
                        <h3>Lợi nhuận gộp</h3>
                        <p :class="{ 'negative-profit': grossProfit < 0 }">{{ currencyFormat(grossProfit) }}</p>
                    </div>
                    <!-- Thêm một ô trống để cân đối lưới -->
                    <div class="grid-item placeholder"></div>
                </div>
            </section>
            <br>
            <section class="filter-section">
                <label for="start-date">Ngày bắt đầu:</label>
                <input type="date" v-model="startDate" id="start-date" />
                <label for="end-date">Ngày kết thúc:</label>
                <input type="date" v-model="endDate" id="end-date" />
                <button @click="fetchFilteredChartData">Thống kê</button>
            </section>
            <section class="chart-section">
                <h2>Biểu đồ thống kê doanh thu</h2>
                <canvas id="ordersChart"></canvas>
            </section>


            <section class="latest-customers">
                <h2>Các đơn hàng gần đây</h2>
                <ul class="customer-list">
                    <li v-for="(order) in orderedRecentOrders" :key="order._id" class="order-item">
                        <div class="order-info">
                            <p>
                                <strong>{{ formatDate(order.createdAt) }} | </strong> Người dùng: {{ order.user ?
                                    order.user.name :
                                'Unknown User' }}
                                - Sản phẩm: {{ order.products[0]?.product?.name || 'Sản phẩm không tồn tại' }} (x{{
                                    order.products[0]?.quantity }})
                                - Thanh toán: {{ currencyFormat(order.totalAmount) }}
                            </p>
                            <button :class="['status-btn', orderStatusClass(order.orderStatus)]">
                                {{ order.orderStatus }}
                            </button>
                        </div>
                    </li>
                </ul>
            </section>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default {
    name: 'AdminBoardPage',
    data() {
        const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (yyyy-mm-dd)
        return {
            furnitureCount: 0,
            employeeCount: 0,
            shipperCount: 0,
            orderCount: 0,
            revenue: 0,
            cogs: 0,
            grossProfit: 0,
            recentOrders: [],
            startDate: today, // Mặc định ngày bắt đầu là hôm nay
            endDate: today,   // Mặc định ngày kết thúc là hôm nay
            chartData: [],
            chartLabels: [], // Ngày kết thúc // Chứa thông tin các đơn hàng gần đây

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
        orderedRecentOrders() {
            // Sắp xếp recentOrders trực tiếp theo thứ tự mới nhất ở đầu
            return this.recentOrders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },
    mounted() {
        this.fetchFilteredChartData(); // Gọi dữ liệu biểu đồ ngay khi trang tải
        this.getFurnitureCount();
        this.getEmployeeCount();
        this.getOrderCount();
        this.getRevenueAndProfit();
        this.fetchRecentOrders();
        this.getShipperCount();
    },
    methods: {
        async fetchFilteredChartData() {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/finance/revenue-profit-by-date?startDate=${this.startDate}&endDate=${this.endDate}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );

                const data = response.data.dailyStats;

                this.chartLabels = Object.keys(data); // Ngày
                this.chartData = this.chartLabels.map(
                    (date) => (data[date]?.revenue || 0) // Doanh thu mỗi ngày
                );

                this.createChart(); // Tạo biểu đồ với dữ liệu mới
            } catch (error) {
                console.error("Error fetching filtered chart data:", error);
            }
        },
        createChart() {
            const chartContainer = document.getElementById("ordersChart");

            // Hủy biểu đồ cũ nếu đã tồn tại
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            this.chartInstance = new Chart(chartContainer, {
                type: "line", // Biểu đồ đường
                data: {
                    labels: this.chartLabels, // Ngày
                    datasets: [
                        {
                            label: "Doanh thu (VND)",
                            data: this.chartData, // Doanh thu
                            borderColor: "rgba(72, 187, 120, 1)", // Màu đường
                            backgroundColor: "rgba(72, 187, 120, 0.1)", // Màu nền dưới đường
                            borderWidth: 2, // Độ dày đường
                            pointRadius: 4, // Kích thước điểm
                            tension: 0.4, // Làm mềm các góc nối
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                        tooltip: { enabled: true },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Ngày" },
                        },
                        y: {
                            title: { display: true, text: "Doanh thu (VND)" },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 3000000, // Điều chỉnh bước nhảy giữa các giá trị trục Y
                                callback: function (value) {
                                    return new Intl.NumberFormat("vi-VN").format(value); // Định dạng số theo kiểu tiền tệ
                                }
                            },
                        },
                    },
                },
            });
        },
        async fetchRecentOrders() {
            try {
                const response = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                // In dữ liệu ra console để kiểm tra định dạng createdAt
                console.log("Original data from API:", response.data);

                // Tạo một mảng mới đã sắp xếp và lấy 5 đơn hàng mới nhất
                const sortedOrders = [...response.data]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp từ mới nhất đến cũ nhất
                    .slice(0, 5);

                // Gán lại recentOrders với mảng đã sắp xếp
                this.recentOrders = sortedOrders;

                // Kiểm tra thứ tự mảng sau khi sắp xếp
                console.log("Sorted recent orders:", this.recentOrders);
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            }
        },
        async getFurnitureCount() {
            try {
                const response = await axios.get('http://localhost:5000/api/furniture/count');
                this.furnitureCount = response.data.count;
            } catch (error) {
                console.error('Error fetching furniture count:', error);
            }
        },
        async getEmployeeCount() {
            try {
                const response = await axios.get('http://localhost:5000/api/users/count-employees');
                this.employeeCount = response.data.count;
            } catch (error) {
                console.error('Error fetching employee count:', error);
            }
        },
        async getShipperCount() {
            try {
                const response = await axios.get('http://localhost:5000/api/users/count-shippers');
                this.shipperCount = response.data.count;
            } catch (error) {
                console.error('Error fetching shipper count:', error);
            }
        },
        async getOrderCount() {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/count');
                this.orderCount = response.data.count;
            } catch (error) {
                console.error('Error fetching order count:', error);
            }
        },
        async getRevenueAndProfit() {
            try {
                const response = await axios.get('http://localhost:5000/api/finance/revenue-profit');
                this.revenue = response.data.revenue;
                this.cogs = response.data.cogs;
                this.grossProfit = response.data.grossProfit;
            } catch (error) {
                console.error('Error fetching revenue and profit:', error);
            }
        },
        currencyFormat(value) {
            if (!value) return '0 VND';
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        formatDate(date) {
            if (!date) return 'No Date';
            const parsedDate = new Date(date);
            if (isNaN(parsedDate)) return 'Invalid Date';
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return parsedDate.toLocaleDateString('vi-VN', options) + ' ' + parsedDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        },
        orderStatusClass(status) {
            if (status === 'Delivered') return 'badge badge-success';
            if (status === 'Shipped') return 'badge badge-warning';
            return 'badge badge-danger';
        },
    }
};
</script>


<style scoped>
.filter-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.filter-section input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.filter-section button {
    padding: 5px 10px;
    background-color: #48bb78;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.filter-section button:hover {
    background-color: #3a9e63;
}

.chart-section {
    background: #f9f9f9;
    /* Màu nền nhẹ nhàng */
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* Hiệu ứng đổ bóng */
    margin: 20px 0;
}

#ordersChart {
    width: 100%;
    /* Chiều rộng tối đa */
    height: 400px;
    /* Chiều cao cố định */
    max-height: 400px;
    /* Giới hạn chiều cao tối đa */
    margin: 0 auto;
    /* Căn giữa */
}


.customer-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.order-item {
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.status-btn {
    padding: 5px 10px;
    border-radius: 4px;
    color: white;
    font-size: 0.9rem;
    text-transform: capitalize;
    border: none;
    cursor: pointer;
}

.badge-success {
    background-color: #28a745;
}

.badge-warning {
    background-color: #ffc107;
    color: #000;
}

.badge-danger {
    background-color: #dc3545;
}

.grid-overview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4 cột để đảm bảo sự đối xứng */
    gap: 20px;
    margin-top: 20px;
}

.grid-item {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.placeholder {
    visibility: hidden;
    /* Ẩn ô trống để cân đối lưới */
}

.date-filter {
    margin-bottom: 20px;
}

.negative-profit {
    color: red;
    /* Màu đỏ cho lợi nhuận gộp âm */
}

.date-filter {
    margin-bottom: 20px;
}

.stats-overview {
    display: flex;
    gap: 20px;
}

.negative-profit {
    color: red;
    /* Màu đỏ cho lợi nhuận gộp âm */
}

.top-nav {
    background-color: #1a202c;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    position: fixed;
    /* Cố định top-nav */
    top: 0;
    /* Đặt top-nav ở đầu trang */
    left: 0;
    right: 0;
    z-index: 1000;
    /* Đảm bảo thanh này luôn nằm trên cùng */
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
    /* Chiều cao đầy đủ cho sidebar */
    position: fixed;
    /* Đảm bảo sidebar luôn ở vị trí cố định */
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

/* Nội dung chính */
.main-content {
    margin-top: 60px;
    /* Tạo khoảng cách để không bị tràn lên top-nav */
    margin-left: 240px;
    /* Đẩy nội dung chính sang phải sau sidebar */
    padding: 20px;
    flex: 1;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.stats-overview {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.stat-box {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.kpis {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.kpi-box {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-section {
    margin-top: 40px;
}

.latest-customers {
    margin-top: 40px;
}

.customer-list {
    list-style-type: none;
    padding: 0;
}

.customer-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
}

.status-btn {
    background-color: #48bb78;
    border: none;
    padding: 5px 10px;
    color: white;
    border-radius: 4px;
}

.reports-overview {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: space-between;
    /* Căn đều khoảng cách */
}

.report-box {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    /* Căn giữa nội dung */
    flex: 1;
    /* Chiếm không gian đều nhau */
}

.report-box h3 {
    font-size: 1.2rem;
    color: #333;
}

.report-box p {
    font-size: 1.5rem;
    font-weight: bold;
    color: #48bb78;
    /* Màu xanh lá nổi bật */
}

.kpis {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: space-between;
    /* Căn đều khoảng cách */
}

.kpi-box {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex: 1;
}

.kpi-box h4 {
    font-size: 1rem;
    color: #333;
}

.kpi-box p {
    font-size: 1.2rem;
    font-weight: bold;
    color: #48bb78;
}
</style>
