<template>
  <div class="cart-page container">
    <h1>Giỏ hàng của bạn <span>({{ cartItemCount }})</span></h1>

    <!-- Nút lấy voucher khuyến mãi -->
    <button @click="openVoucherModal" class="btn btn-secondary mb-3">Lấy Voucher Khuyến Mãi</button>

    <!-- Hiển thị modal voucher -->
    <div v-if="showVoucherModal" class="voucher-modal">
      <h3 class="modal-title">Chọn voucher</h3>
      <ul class="voucher-list">
        <li v-for="voucher in vouchers" :key="voucher.code" class="voucher-item">
          <button @click="applyVoucher(voucher)" class="btn btn-primary voucher-btn">
            {{ voucher.description }}
          </button>
        </li>
      </ul>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button @click="closeVoucherModal" class="btn btn-secondary close-btn">Đóng</button>
    </div>

    <!-- Hiển thị modal thanh toán khi nhấn nút Checkout -->
    <PaymentOptions :show="showPaymentModal" :totalAmount="cartTotal" @close="showPaymentModal = false"
      @orderConfirmed="handleOrderConfirmed" />

    <!-- Kiểm tra nếu giỏ hàng trống -->
    <div v-if="cartItems && cartItems.length > 0" class="cart-container row">
      <!-- Danh sách các sản phẩm -->
      <div class="col-md-8">
        <div v-for="item in cartItems" :key="item._id"
          class="cart-item row align-items-center mb-4 p-3 bg-light rounded shadow-sm">
          <div class="col-md-3">
            <img :src="`http://localhost:5000/uploads/${item.image}`" alt="Product Image"
              class="cart-item-image img-fluid rounded" />
          </div>

          <div class="col-md-5">
            <h5><strong>{{ item.name }}</strong></h5>
            <p>Chất liệu: {{ item.material }}</p>

            <div class="quantity-container d-flex align-items-center">
              <button @click="decreaseQuantity(item)" class="btn btn-outline-secondary">-</button>
              <span class="mx-2">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="btn btn-outline-secondary">+</button>
            </div>
          </div>

          <div class="col-md-2 text-right">
            <p class="price font-weight-bold">
              {{ formatCurrencyVND(item.price) }}
            </p>
          </div>

          <div class="col-md-2 text-right">
            <button @click="removeFromCart(item._id)" class="btn btn-danger">Xóa sản phẩm</button>
          </div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

      </div>

      <!-- Tóm tắt và thanh toán -->
      <div class="col-md-4 text-right">
        <div class="cart-summary bg-light p-4 rounded shadow-sm">
          <p>Giá sản phẩm: {{ formatCurrencyVND(cartSubtotal) }}</p>
          <p>Phí vận chuyển: {{ freeShipping ? 'Miễn phí' : formatCurrencyVND(shippingFee) }}</p>
          <p>Giảm giá: {{ discountAmount > 0 ? formatCurrencyVND(discountAmount) : '0 đ' }}</p>
          <p class="total font-weight-bold">Tổng tiền: {{ formatCurrencyVND(cartTotal) }}</p>
          <button class="btn btn-primary btn-block" @click="onCheckoutClick">Thanh toán</button>
        </div>
      </div>
    </div>

    <!-- Hiển thị thông báo nếu giỏ hàng rỗng -->
    <div v-else>
      <p>Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng.</p>
    </div>
    <LoginPrompt :show="showLoginPrompt" @close="showLoginPrompt = false" />
  </div>
</template>

<script>
import PaymentOptions from '@/views/PaymentOptions.vue';
import { mapActions, mapGetters } from 'vuex';
import LoginPrompt from '@/views/LoginPrompt.vue';

export default {
  components: {
    LoginPrompt,
    PaymentOptions,
  },
  data() {
    return {
      showPaymentModal: false,
      showVoucherModal: false,
      discountAmount: 0,
      freeShipping: false,
      showSuccessMessage: false,
      errorMessage: '', // Biến lưu thông báo lỗi
      showLoginPrompt: false, // Thêm trạng thái để hiển thị modal đăng nhập
      vouchers: [
        {
          code: 'FREE_SHIPPING',
          description: 'Miễn phí vận chuyển cho đơn hàng trên 3.500.000 VNĐ',
          type: 'freeShipping',
          minimumOrderValue: 3500000,
        },
        {
          code: 'DISCOUNT_500K',
          description: 'Giảm 500.000 VNĐ cho đơn hàng trên 10.000.000 VNĐ',
          type: 'discount',
          minimumOrderValue: 10000000,
          discountAmount: 500000,
        },
        {
          code: 'DISCOUNT_10_PERCENT',
          description: 'Giảm 10% cho đơn hàng trên 3.000.000 VNĐ',
          type: 'discountPercentage',
          minimumOrderValue: 3000000,
          discountPercentage: 10,
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("fetchInventory");
  },
  computed: {
    ...mapGetters(['cartItemCount', 'cartItems', 'isAuthenticated']),
    cartSubtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity || 0);
      }, 0);
    },
    shippingFee() {
      return this.freeShipping ? 0 : 25000;
    },
    cartTotal() {
      return this.cartSubtotal + this.shippingFee - this.discountAmount;
    },
  },
  methods: {
    ...mapActions(['removeFromCart', 'updateCart', 'createOrder']),
    openVoucherModal() {
      if (this.cartItems.length === 0) {
        this.errorMessage = 'Không có sản phẩm nào để áp dụng';
        this.showVoucherModal = true;
      } else {
        this.errorMessage = '';
        this.showVoucherModal = true;
      }
    },
    closeVoucherModal() {
      this.showVoucherModal = false;
      this.errorMessage = ''; // Xóa thông báo lỗi khi đóng modal
    },
    applyVoucher(voucher) {
      if (this.cartSubtotal < voucher.minimumOrderValue) {
        this.errorMessage = 'Giá trị đơn hàng không đủ để áp dụng voucher này';
        return;
      }

      // Reset lỗi nếu áp dụng thành công
      this.errorMessage = '';

      if (voucher.type === 'freeShipping') {
        this.freeShipping = true;
        this.discountAmount = 0;
      } else if (voucher.type === 'discount') {
        this.discountAmount = voucher.discountAmount;
        this.freeShipping = false;
      } else if (voucher.type === 'discountPercentage') {
        this.discountAmount = (this.cartSubtotal * voucher.discountPercentage) / 100;
        this.freeShipping = false;
      }

      this.closeVoucherModal();
    },
    formatCurrencyVND(amount) {
      if (!amount) return "Chưa có thông tin giá";
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        try {
          item.quantity--;
          await this.$store.dispatch("updateCart", item);
          this.errorMessage = ""; // Xóa lỗi nếu thành công
        } catch (error) {
          this.errorMessage = error.message; // Hiển thị lỗi nếu xảy ra
        }
      } else {
        this.errorMessage = `Số lượng sản phẩm "${item.name}" không thể giảm dưới 1.`;
      }
    },

    async increaseQuantity(item) {
      try {
        item.quantity++;
        await this.$store.dispatch("updateCart", item);
        this.errorMessage = ""; // Xóa lỗi nếu thành công
      } catch (error) {
        this.errorMessage = error.message; // Hiển thị lỗi nếu xảy ra
      }
    },

    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId);
    },
    onCheckoutClick() {
      if (!this.isAuthenticated) {
        this.showLoginPrompt = true; // Hiển thị modal đăng nhập nếu chưa đăng nhập
      } else {
        this.showPaymentModal = true; // Tiếp tục đến thanh toán nếu đã đăng nhập
      }
    },
    submitOrder() {
      const orderData = {
        totalAmount: this.cartTotal, // Bao gồm phí vận chuyển và giảm giá
        products: this.cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: this.fullName,
          phoneNumber: this.phoneNumber,
          street: this.street,
        },
        paymentMethod: this.selectedPaymentMethod,
      };

      console.log('Order Data (CartPage.vue):', orderData); // Log dữ liệu để xác nhận

      this.$store
        .dispatch('createOrder', orderData)
        .then(() => {
          alert('Đặt hàng thành công!');
          this.showPaymentModal = false;
        })
        .catch((error) => {
          console.error('Không thể đặt hàng:', error);
        });
    },
    handleOrderConfirmed() {
      this.showSuccessMessage = true;
    },
    updateLocalStorageCart() {
      const cart = this.$store.state.cart;
      localStorage.setItem('cart', JSON.stringify(cart));
    },
  },
};
</script>



<style scoped>
.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

/* Style cho modal voucher */
.voucher-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 15px;
}

.voucher-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.voucher-item {
  margin-bottom: 10px;
}

.voucher-item:last-child {
  margin-bottom: 0;
}

.voucher-btn {
  width: 100%;
  padding: 10px;
  text-align: left;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.voucher-btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
}

.close-btn {
  margin-top: 20px;
  width: 100%;
  background-color: #6c757d;
  color: white;
}

.close-btn:hover {
  background-color: #5a6268;
}

.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

h1 span {
  font-size: 1rem;
  color: #666;
}

.cart-item {
  background-color: #f9f9f9;
}

.cart-item img {
  max-width: 100%;
  border-radius: 10px;
}

.quantity-container {
  margin-top: 1rem;
}

.price {
  font-size: 1.2rem;
  color: #333;
}

.cart-summary p {
  font-size: 1.2rem;
  color: #555;
}

.total {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
}

.checkout-button {
  margin-top: 1rem;
}

.btn-block {
  display: block;
  width: 100%;
}
</style>
