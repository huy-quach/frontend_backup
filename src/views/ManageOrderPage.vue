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
                    <router-link to="/manage-orders" class="nav-link active">
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

        <div class="main-content">
            <header class="admin-header">
                <h1 v-if="!isPreview">Quản lý đơn hàng</h1>
                <h2 v-else>Latest Orders</h2>
            </header>

            <section class="orders-overview">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên người dùng</th>
                            <th>ID Đơn hàng</th>
                            <th>Sản phẩm</th>
                            <th>Tổng số tiền</th>
                            <th>Thời gian đặt hàng</th>
                            <th>Trạng thái đơn hàng</th>
                            <th>Trạng thái thanh toán</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(order, index) in displayedOrders" :key="order._id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ order.user ? order.user.name : 'Unknown User' }}</td>
                            <td>{{ order._id }}</td>
                            <td>
                                <div v-for="item in order.products" :key="item.product ? item.product._id : item._id">
                                    <span v-if="item.product">{{ item.product.name }} (x{{ item.quantity }})</span>
                                    <span v-else>Sản phẩm không tồn tại</span>
                                </div>
                            </td>
                            <td>{{ formatCurrency(order.totalAmount) }}</td>
                            <td>{{ formatDate(order.createdAt) }}</td>
                            <td>
  <span>{{ order.orderStatus }}</span>
</td>

                            <td>
                                <!-- Display payment status -->
                                <span :class="paymentStatusClass(order)">
                                    {{ getPaymentStatus(order) }}
                                </span>
                            </td>
                            <td>
                                <div v-if="isAdminOrEmployee">
                                    <select v-model="orderStatuses[order._id]" @change="updateOrderStatus(order)"
                                        :disabled="order.orderStatus === 'Hủy bỏ' || order.orderStatus === 'Hoàn thành'">
                                        <option value="Đang gửi" :disabled="order.orderStatus !== 'Đang gửi'">Đang gửi
                                        </option>
                                        <option value="Đang vận chuyển" :disabled="order.orderStatus !== 'Đang gửi'">
                                            Đang vận chuyển</option>
                                        <option value="Hoàn thành" :disabled="order.orderStatus !== 'Đang vận chuyển'">
                                            Hoàn thành</option>
                                        <option value="Hủy bỏ" :disabled="order.orderStatus !== 'Đang gửi'">Hủy bỏ
                                        </option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
    props: {
        isPreview: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            orders: [],
            orderStatuses: {}, // Stores the current status of each order
        };
    },
    computed: {
        ...mapState(["user"]),
        isAdmin() {
            return this.user && this.user.role === "admin";
        },
        isAdminOrEmployee() {
            return this.user && (this.user.role === "admin" || this.user.role === "employee");
        },
        displayedOrders() {
            return this.isPreview ? this.orders.slice(0, 5) : this.orders;
        },
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await axios.get("http://localhost:5000/api/orders", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.orders = response.data;
                this.orders.forEach((order) => {
                    this.orderStatuses[order._id] = order.orderStatus;
                });
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        },
        getPaymentStatus(order) {
            if (order.paymentMethod === "zalopay" || order.paymentMethod === "momo") {
                return "Đã thanh toán";
            }
            else if (order.paymentMethod === "cash_on_delivery") {
                return order.orderStatus === "Hoàn thành" ? "Đã thanh toán" : "Chưa thanh toán";
            }
            return "Không xác định";
        },
        paymentStatusClass(order) {
            return this.getPaymentStatus(order) === "Đã thanh toán" ? "badge badge-success" : "badge badge-warning";
        },
        async updateOrderStatus(order) {
            const newStatus = this.orderStatuses[order._id];
            const url = `http://localhost:5000/api/orders/${order._id}/admin-update`;

            try {
                const response = await axios.patch(
                    url,
                    { orderStatus: newStatus },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                order.orderStatus = response.data.order.orderStatus;
                this.$set(this.orderStatuses, order._id, response.data.order.orderStatus);
            } catch (error) {
                console.error("Error updating order status:", error);
            }
        },
        orderStatusClass(status) {
            if (status === "Hoàn thành") return "badge badge-success";
            if (status === "Đang vận chuyển") return "badge badge-warning";
            if (status === "Đang gửi") return "badge badge-danger";
            if (status === "Hủy bỏ") return "badge badge-danger";
            return "badge badge-secondary";
        },
        formatCurrency(value) {
            return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
        },
        formatDate(date) {
            if (!date) return "No Date";
            const parsedDate = new Date(date);
            const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
            return parsedDate.toLocaleDateString("vi-VN", options) + " " + parsedDate.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
};
</script>

<style scoped>
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
    overflow-y: auto;
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
}

.nav-link i {
    margin-right: 10px;
}

.nav-link.active {
    background-color: #1a202c;
    font-weight: bold;
}

.nav-link:hover {
    background-color: #1a202c;
    padding-left: 15px;
}

/* Nội dung chính */
.main-content {
    margin-top: 60px;
    margin-left: 240px;
    padding: 20px;
    flex: 1;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: #333;
}

.table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table th,
.table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 14px;
}

.table thead {
    background-color: #007bff;
    color: white;
}

.table tr:hover {
    background-color: #f1f1f1;
}

.badge {
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 0.9rem;
    text-transform: capitalize;
}

.badge-success {
    background-color: #28a745;
    color: #fff;
}

.badge-warning {
    background-color: #ffc107;
    color: #fff;
}

.badge-danger {
    background-color: #dc3545;
    color: #fff;
}

/* Dropdown trạng thái */
select {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    font-size: 14px;
    cursor: pointer;
}
</style>
