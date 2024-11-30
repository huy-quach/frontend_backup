<template>
  <div>
    <div class="payment-options-overlay" v-if="show">
      <div class="payment-options-modal">
        <h2 class="payment-title">Phương thức thanh toán</h2>

        <!-- Nút chọn phương thức thanh toán -->
        <div class="payment-buttons">
          <button class="btn payment-btn" :class="{ 'selected-method': paymentMethod === 'cash_on_delivery' }"
            @click="setPaymentMethod('cash_on_delivery')">
            <i class="fas fa-truck"></i> Thanh toán khi nhận hàng
          </button>
          <button class="btn payment-btn" :class="{ 'selected-method': paymentMethod === 'e_wallet' }"
            @click="setPaymentMethod('e_wallet')">
            <i class="fas fa-wallet"></i> Thanh toán qua ví điện tử
          </button>
        </div>

        <!-- Form nhập thông tin người nhận hàng -->
        <div v-if="showShippingForm" class="shipping-form">
          <div class="input-container">
            <input v-model="shippingAddress.fullName" class="input-field" placeholder="Nhập họ và tên của bạn" />
            <span v-if="errors.fullName" class="error-message">Vui lòng điền họ và tên.</span>

            <input v-model="shippingAddress.street" class="input-field" placeholder="Nhập địa chỉ giao hàng" />
            <span v-if="errors.street" class="error-message">Vui lòng điền địa chỉ.</span>

            <div class="phone-input-container">
              <span class="country-code">
                <img src="../assets/logo/vietnam_flag.jpg" alt="Vietnam Flag" class="flag-icon" />
                (+84)
              </span>
              <input v-model="shippingAddress.phoneNumber" class="input-field phone-input"
                placeholder="Nhập số điện thoại" />
            </div>

            <span v-if="errors.phoneNumber" class="error-message">Vui lòng điền số điện thoại hợp lệ.</span>

            <textarea v-model="shippingAddress.note" class="input-field"
              placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"></textarea>
          </div>

          <!-- Hiển thị icon các ví điện tử -->
          <div v-if="paymentMethod === 'e_wallet'" class="wallet-icons">
            <div class="wallet-item momo" @click="selectWallet('momo')">
              <img src="../assets/momo_logo.png" alt="MoMo" />
              <span>MoMo</span>
            </div>
            <div class="wallet-item zalopay" @click="selectWallet('zalopay')">
              <img src="../assets/zalopay_icon.png" alt="ZaloPay" />
              <span>ZaloPay</span>
            </div>
          </div>


          <!-- Nút xác nhận và hủy -->
          <div class="action-buttons">
            <button @click="confirmOrder" class="btn confirm-btn">Xác nhận đặt hàng</button>
            <button @click="closeModal" class="btn cancel-btn">Hủy bỏ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hộp thông báo đặt hàng thành công -->
    <div class="success-box-overlay" v-if="orderPlaced">
      <div class="success-box">
        <h2>Đã thanh toán thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng tại LuxiFur</p>
        <button @click="closeSuccessBox" class="btn btn-primary">Đóng</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  props: {
    show: Boolean,
    totalAmount: Number,
  },
  data() {
    return {
      paymentMethod: "",
      shippingAddress: {
        fullName: "",
        street: "",
        phoneNumber: "",
        note: "",
      },
      showShippingForm: false,
      orderPlaced: false,
      errors: {
        fullName: false,
        street: false,
        phoneNumber: false,
      },
    };
  },
  computed: {
    cartItems() {
      return this.$store.state.cart;
    },
  },
  mounted() {
    this.$store.dispatch("fetchCart");
  },
  methods: {
    setPaymentMethod(method) {
      this.paymentMethod = method;
      this.showShippingForm = true;
      this.$store.commit("SET_SELECTED_PAYMENT_METHOD", method);
    },
    async selectWallet(wallet) {
      try {
        const userId = this.$store.state.user?._id || "default_user";

        const products = this.cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item._id,
        }));

        // Kiểm tra loại ví được chọn
        if (wallet === "zalopay") {
          const response = await axios.post(
            "http://localhost:5000/api/zalopay/create-payment",
            {
              amount: this.totalAmount,
              userId,
              items: products,
              shippingAddress: this.shippingAddress,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );

          const paymentUrl = response.data.payUrl || response.data.order_url;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            alert("Không thể chuyển hướng đến trang thanh toán.");
          }
        } else if (wallet === "momo") {
          const response = await axios.post(
            "http://localhost:5000/api/momo/create-payment",
            {
              amount: this.totalAmount,
              userId,
              items: products,
              shippingAddress: this.shippingAddress,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );

          const paymentUrl = response.data.payUrl || response.data.order_url;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            alert("Không thể chuyển hướng đến trang thanh toán.");
          }
        }
      } catch (error) {
        console.error("Failed to initiate payment:", error.response?.data || error.message);
        alert("Không thể thực hiện thanh toán. Vui lòng thử lại.");
      }
    },
    validateInputs() {
      this.errors = {
        fullName: !this.shippingAddress.fullName,
        street: !this.shippingAddress.street,
        phoneNumber: !/^\d{10,11}$/.test(this.shippingAddress.phoneNumber),
      };
      return Object.values(this.errors).every((error) => error === false);
    },
    async confirmOrder() {
      if (!this.validateInputs()) return;

      try {
        await this.$store.dispatch("createOrder", {
          totalAmount: this.totalAmount,
          shippingAddress: this.shippingAddress,
          paymentMethod: this.paymentMethod,
        });
        await this.$store.dispatch("clearCartBackend");

        // Khi hoàn tất đặt hàng, hiển thị hộp thông báo thành công
        this.orderPlaced = true;
        this.$emit("close");
      } catch (error) {
        console.error("Failed to place order:", error);
        alert("Failed to place order");
      }
    },
    closeSuccessBox() {
      this.orderPlaced = false;
      this.$store.commit("CLEAR_CART");
      this.$emit("close");
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.success-box-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.error-message {
    color: red;
    font-size: 0.85rem;
}
.success-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.success-box h2 {
  margin-bottom: 1rem;
}

.success-box button {
  margin-top: 1rem;
}

.phone-input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc; /* Luôn có viền */
  border-radius: 8px;
  padding: 0.5rem;
  background-color: #fff;
  transition: border-color 0.3s ease; /* Hiệu ứng khi focus */
}

.phone-input-container:focus-within {
  border-color: #007bff; /* Đổi màu viền khi focus */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Hiệu ứng ánh sáng */
}
.country-code {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.flag-icon {
  width: 24px;
  height: 16px;
  margin-right: 0.5rem;
  border-radius: 2px;
  object-fit: cover;
}

.phone-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: #333;
}

.phone-input::placeholder {
  color: #aaa;
}

.phone-input:focus {
  outline: none;
}

.payment-options-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.payment-options-modal {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.payment-options-modal {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 550px;
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
}

.payment-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.payment-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-weight: bold;
  background: #f9f9f9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.payment-btn i {
  margin-right: 0.5rem;
}

.payment-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.selected-method {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.wallet-icons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.wallet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.wallet-item:hover {
  transform: scale(1.1);
}

.wallet-icon {
  width: 80px;
  height: auto;
}

.input-container {
  margin-bottom: 1.5rem;
}

.input-field {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
}

textarea {
  resize: none;
  height: 80px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-btn,
.cancel-btn {
  flex: 0 1 45%;
  /* Cùng kích thước, chia đều */
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

.confirm-btn {
  background-color: #28a745;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background-color: #c82333;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.wallet-icons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.wallet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.wallet-item img {
  width: 50px;
  height: 50px;
  margin-bottom: 0.5rem;
}

.wallet-item span {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

/* MoMo specific styles */
.wallet-item.momo {
  background-color: #f8e9f9;
}

.wallet-item.momo:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(255, 0, 128, 0.5);
}

/* ZaloPay specific styles */
.wallet-item.zalopay {
  background-color: #e7f5ff;
}

.wallet-item.zalopay:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.5);
}
</style>
