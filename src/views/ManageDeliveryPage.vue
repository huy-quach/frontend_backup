<template>
  <div class="manage-delivery">
    <h1 class="page-title">Quản lý giao hàng</h1>

    <!-- Thanh tìm kiếm theo số điện thoại và tên khách hàng -->
    <div class="search-bar-container">
      <div class="search-bar">
        <input v-model="searchPhone" type="text" placeholder="Tìm kiếm theo số điện thoại..." @input="searchOrders"
          class="search-input" />
      </div>
      <div class="search-bar">
        <input v-model="searchName" type="text" placeholder="Tìm kiếm theo tên khách hàng..." @input="searchOrders"
          class="search-input" />
      </div>
    </div>

    <div class="order-list">
      <div v-for="order in filteredOrders" :key="order._id" class="order-card">
        <div class="order-summary" @click="toggleOrderDetails(order._id)">
          <div class="order-info">
            <p><strong>Khách hàng:</strong> {{ order.shippingAddress.fullName }}</p>
            <p><strong>Điện thoại:</strong> {{ order.shippingAddress.phoneNumber }}</p>
            <p><strong>Tổng tiền:</strong> <span class="amount">{{ formatCurrency(order.totalAmount) }}</span></p>
            <p><strong>Trạng thái thanh toán:</strong> <span class="payment-status">{{ getPaymentStatus(order) }}</span>
            </p>
          </div>
          <span :class="['status', getStatusClass(order.orderStatus)]">{{ order.orderStatus }}</span>
        </div>

        <div v-if="openedOrderIds.includes(order._id)" class="order-details">
          <div class="order-info">
            <p><strong>Địa chỉ:</strong> {{ order.shippingAddress.street }}</p>
            <p><strong>Ghi chú:</strong> {{ order.shippingAddress.note || "Không có" }}</p>

            <div class="status-update" v-if="order.orderStatus === 'Đang vận chuyển'">
              <label for="status-select">Cập nhật trạng thái:</label>
              <select v-model="orderStatuses[order._id]" id="status-select" class="status-select">
                <option disabled value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Hủy bỏ">Hủy bỏ</option>
              </select>
              <button @click="updateOrderStatus(order)" class="update-button">
                Cập nhật
              </button>
            </div>



            <p v-if="statusMessages[order._id]" class="status-message">{{ statusMessages[order._id] }}</p>

            <h3 class="products-title">Sản phẩm trong đơn hàng</h3>
            <ul class="product-list">
              <li v-for="item in order.products" :key="item.product._id" class="product-item">
                <img :src="`http://localhost:5000/uploads/${item.product.image}`" alt="Product Image"
                  class="product-image" />
                <div class="product-info">
                  <p class="product-name">{{ item.product.name }}</p>
                  <p>Số lượng: <strong>{{ item.quantity }}</strong> - Giá: <span class="amount">{{
                    formatCurrency(item.product.price) }}</span></p>
                </div>
              </li>
            </ul>
          </div>
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
      orders: [],
      searchPhone: "",
      searchName: "",
      filteredOrders: [],
      openedOrderIds: [],
      orderStatuses: {},
      statusMessages: {},
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.orders = response.data;
        this.filteredOrders = this.orders;

        this.orders.forEach(order => {
          this.$set(this.orderStatuses, order._id, order.orderStatus);
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },

    async searchOrders() {
      if (this.searchPhone.trim() === "" && this.searchName.trim() === "") {
        this.filteredOrders = this.orders;
        return;
      }

      try {
        let response;
        if (this.searchPhone.trim() !== "") {
          response = await axios.get("http://localhost:5000/api/orders/search", {
            params: { phoneNumber: this.searchPhone },
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
        } else if (this.searchName.trim() !== "") {
          response = await axios.get("http://localhost:5000/api/orders/search-by-name", {
            params: { fullName: this.searchName },
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
        }

        this.filteredOrders = response.data;
      } catch (error) {
        console.error("Error searching orders:", error);
      }
    },

    toggleOrderDetails(orderId) {
      const index = this.openedOrderIds.indexOf(orderId);
      if (index === -1) {
        this.openedOrderIds.push(orderId);
      } else {
        this.openedOrderIds.splice(index, 1);
      }
    },

    async updateOrderStatus(order) {
      const newStatus = this.orderStatuses[order._id];

      if (newStatus === "Hủy bỏ") {
        // API hủy bỏ đơn hàng
        const url = `http://localhost:5000/api/orders/${order._id}/cancel`;

        await axios.patch(
          url,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        // Cập nhật trạng thái đơn hàng
        order.orderStatus = "Hủy bỏ";
        this.orderStatuses[order._id] = "Hủy bỏ"; // Không cần this.$set
      } else if (newStatus === "Hoàn thành") {
        // API cập nhật trạng thái
        const url = `http://localhost:5000/api/orders/${order._id}/shipper-status`;

        try {
          const response = await axios.patch(
            url,
            { orderStatus: newStatus },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );

          // Cập nhật trạng thái đơn hàng
          order.orderStatus = response.data.order.orderStatus;
          this.orderStatuses[order._id] = response.data.order.orderStatus; // Không cần this.$set
          this.statusMessages[order._id] = "Trạng thái đã được cập nhật.";
        } catch (error) {
          console.error("Error updating order status:", error);
          this.statusMessages[order._id] = "Không thể cập nhật trạng thái. Vui lòng thử lại.";
        }
      }
    },



    getPaymentStatus(order) {
      // Xác định trạng thái thanh toán dựa trên phương thức thanh toán và trạng thái đơn hàng
      if (order.paymentMethod === "zalopay" || order.paymentMethod === "momo") {
        return "Đã thanh toán";
      }
      else if (order.paymentMethod === 'cash_on_delivery') {
        return order.orderStatus === "Hoàn thành" ? "Đã thanh toán" : "Chưa thanh toán";
      }
      return "Không xác định";
    },

    getStatusClass(status) {
      switch (status) {
        case "Đang gửi":
          return "dang-gui";
        case "Hoàn thành":
          return "hoan-thanh";
        case "Hủy bỏ":
          return "huy-bo";
        case "Đang vận chuyển":
          return "dang-van-chuyen";
        default:
          return "";
      }
    },

    formatCurrency(value) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  },
  created() {
    this.fetchOrders();
  },
};
</script>






<style scoped>
.status-select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.update-button {
  background-color: #2ecc71;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

.update-button:hover {
  background-color: #27ae60;
}

.manage-delivery {
  max-width: 1000px;
  margin: 0 auto;
  color: #333;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 25px;
}

.search-bar-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fdfdfd;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.order-info p {
  margin: 8px 0;
  color: #2c3e50;
}

.amount {
  font-weight: bold;
  color: #e74c3c;
}

.payment-status {
  color: #27ae60;
  font-weight: bold;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
}

.status.dang-gui {
  background-color: #f39c12;
}

.status.hoan-thanh {
  background-color: #2ecc71;
}

.status.huy-bo {
  background-color: #e74c3c;
}

.status.dang-van-chuyen {
  color: #007bff;
  font-weight: bold;
  border: 2px solid #007bff;
  padding: 5px;
  border-radius: 5px;
  background-color: #e6f0ff;
}

.order-details {
  margin-top: 10px;
  padding: 15px;
  border-top: 1px solid #ddd;
  background-color: #ffffff;
}

.products-title {
  font-size: 18px;
  color: #34495e;
  margin-top: 20px;
}

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
  border: 1px solid #ddd;
}

.product-info {
  flex-grow: 1;
}

.product-name {
  font-weight: bold;
  color: #555;
}

.status-update {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.status-select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.update-button {
  background-color: #2ecc71;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.update-button:hover {
  background-color: #27ae60;
}
</style>