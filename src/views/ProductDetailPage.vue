<template>
  <div class="product-detail-page">
    <IdleLogout />
    <div v-if="product" class="product-container">
      <!-- Slider hình ảnh sản phẩm -->
      <div class="image-slider">
        <div v-for="(image, index) in product.images || [product.image]" :key="index" class="image-slide">
          <img :src="`http://localhost:5000/uploads/${image}`" alt="Product Image" class="product-image" />
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">Giá: <span>{{ formatCurrencyVND(product.salePrice) }}</span></p>
        <p class="product-material">Chất liệu: {{ product.material }}</p>
        <p :class="product.totalStock > 0 ? 'in-stock' : 'out-of-stock'">
          {{ product.totalStock > 0 ? `Còn hàng (${product.totalStock})` : 'Hết hàng' }}
        </p>

        <!-- Chọn số lượng -->
        <div class="quantity-container">
          <label>Số lượng:</label>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="selectedQuantity <= 1" class="quantity-btn">-</button>
            <span>{{ selectedQuantity }}</span>
            <button @click="increaseQuantity" :disabled="selectedQuantity >= product.totalStock"
              class="quantity-btn">+</button>
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="action-buttons">
          <button class="add-to-cart" @click="addToCart">🛒 Thêm vào giỏ hàng</button>
          <button class="buy-now" @click="buyNow">⚡ Mua ngay</button>
        </div>
      </div>
    </div>

    <!-- Phần đánh giá sản phẩm -->
    <div class="reviews-section">
      <h2 class="reviews-title">Người dùng đánh giá về sản phẩm</h2>
      <div v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review._id" class="review-card">
          <div class="review-content">
            <div v-if="review.images && review.images.length > 0">
              <a @click.prevent="openImageModal(review.images)" href="#">
                <img :src="review.images[0]" alt="Review Image" class="review-image-preview" />
              </a>
            </div>
            <div class="review-details">
              <h4 class="review-author">{{ review.userId ? review.userId.name : 'Khách hàng' }}</h4>
              <div class="star-rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">★</span>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="no-reviews">Chưa có lượt đánh giá nào</p>
      </div>
    </div>

    <!-- Modal hiển thị ảnh -->
    <div v-if="showImageModal" class="image-modal">
      <div class="modal-overlay" @click="closeImageModal"></div>
      <div class="modal-content">
        <button class="close-modal" @click="closeImageModal">✖</button>
        <button class="prev-button" @click="prevImage" :disabled="currentImageIndex === 0">
          <i class="fas fa-chevron-left"></i>
        </button>
        <img :src="currentImages[currentImageIndex]" alt="Modal Image" class="modal-image" />
        <button class="next-button" @click="nextImage" :disabled="currentImageIndex === currentImages.length - 1">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import IdleLogout from "@/components/IdleLogout.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      selectedQuantity: 1,
      reviews: [], // Dữ liệu đánh giá sản phẩm
      showImageModal: false, // Điều khiển hiển thị modal ảnh
      currentImages: [], // Ảnh đang hiển thị trong modal
      currentImageIndex: 0, // Chỉ mục ảnh hiện tại trong modal
    };
  },
  components: {
    IdleLogout,
  },
  computed: {
    ...mapState(["furniture"]), // Lấy dữ liệu từ Vuex
    product() {
      const productId = this.$route.params.id;
      // Tìm sản phẩm dựa trên ID
      return this.furniture.find((item) => item._id === productId) || null;
    },
  },
  methods: {
    // Định dạng giá tiền theo VND
    formatCurrencyVND(amount) {
      if (!amount) return "Chưa có thông tin giá";
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart() {
      if (!this.selectedQuantity || this.selectedQuantity <= 0) {
        alert("Số lượng không hợp lệ");
        return;
      }
      const cartItem = { ...this.product, quantity: this.selectedQuantity };
      this.$store.dispatch("addToCart", cartItem);
    },

    // Thực hiện mua ngay
    async buyNow() {
      if (!this.selectedQuantity || this.selectedQuantity <= 0) {
        alert("Số lượng không hợp lệ");
        return;
      }
      const cartItem = { ...this.product, quantity: this.selectedQuantity };
      await this.$store.dispatch("addToCart", cartItem);
      this.$router.push("/cart");
    },

    // Giảm số lượng sản phẩm
    decreaseQuantity() {
      if (this.selectedQuantity > 1) this.selectedQuantity--;
    },

    // Tăng số lượng sản phẩm
    increaseQuantity() {
      if (this.selectedQuantity < this.product.totalStock) this.selectedQuantity++;
    },

    // Lấy danh sách đánh giá sản phẩm
    async getReviews(productId) {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/product/${productId}`);
        if (res.ok) {
          const reviews = await res.json();
          this.reviews = reviews.map((review) => ({
            ...review,
            images: review.images?.map((image) => `http://localhost:5000/uploads/${image}`) || [],
          }));
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error(error);
      }
    },

    // Mở modal hiển thị ảnh
    openImageModal(images) {
      this.currentImages = images;
      this.currentImageIndex = 0;
      this.showImageModal = true;
    },

    // Đóng modal ảnh
    closeImageModal() {
      this.showImageModal = false;
      this.currentImages = [];
      this.currentImageIndex = 0;
    },

    // Hiển thị ảnh tiếp theo trong modal
    nextImage() {
      if (this.currentImageIndex < this.currentImages.length - 1) {
        this.currentImageIndex++;
      }
    },

    // Hiển thị ảnh trước đó trong modal
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
  },
  mounted() {
    // Kiểm tra xem sản phẩm đã có trong Vuex chưa
    if (!this.product) {
      this.$store.dispatch("fetchFurniture"); // Fetch nếu chưa có
    }

    // Fetch đánh giá sản phẩm
    this.getReviews(this.$route.params.id);
  },
};
</script>


<style scoped>
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  cursor: pointer;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
}

.modal-image {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 10px;
  object-fit: contain;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  z-index: 1001;
}

.prev-button,
.next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: background 0.3s ease;
}

.prev-button {
  left: 20px;
}

.next-button {
  right: 20px;
}

.prev-button:hover,
.next-button:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #000;
}

.prev-button:disabled,
.next-button:disabled {
  background: rgba(128, 128, 128, 0.5);
  cursor: not-allowed;
}


.product-detail-page {
  padding: 2rem 5%;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-container {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
}

.image-slider {
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.in-stock {
  color: #28a745;
  /* Màu xanh lá */
  font-weight: bold;
  font-size: 1.2rem;
}

.out-of-stock {
  color: #dc3545;
  /* Màu đỏ */
  font-weight: bold;
  font-size: 1.2rem;
}

.product-title {
  font-size: 2.5rem;
  /* Tăng kích thước chữ */
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: left;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  /* Bóng nhẹ */
}

.product-price,
.product-price span {
  color: #ff6600;
  /* Màu cam nổi bật */
  font-size: 2rem;
  /* Tăng kích thước chữ */
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  /* Thêm bóng nhẹ */
}



.quantity-container {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.quantity-btn:hover {
  background-color: #ff6600;
  color: #fff;
  transform: scale(1.1);
  /* Tăng nhẹ kích thước khi hover */
}


.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.add-to-cart {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  /* Màu xanh nổi bật */
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-to-cart:hover {
  background: #218838;
  /* Màu xanh đậm hơn khi hover */
  transform: scale(1.1);
}

.buy-now {
  padding: 0.75rem 1.5rem;
  background: #ff6600;
  /* Màu cam nổi bật */
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.buy-now:hover {
  background: #e65c00;
  /* Màu cam đậm hơn khi hover */
  transform: scale(1.1);
}


/* Phần đánh giá */
.reviews-section {
  margin-top: 3rem;
  width: 100%;
  /* Chiều rộng bằng container sản phẩm */
  max-width: 1200px;
  /* Căn chỉnh theo chiều rộng sản phẩm */
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-image a:hover {
  opacity: 0.8;
  /* Làm mờ nhẹ khi hover */
  transition: opacity 0.3s ease;
}

.review-image-preview:hover {
  transform: scale(1.05);
  /* Phóng to nhẹ hình ảnh */
  transition: transform 0.3s ease;
}

.no-reviews {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.review-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  /* Khoảng cách giữa ảnh và nội dung đánh giá */
  margin-bottom: 20px;
  /* Khoảng cách giữa các đánh giá */
}

.reviews-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.review-image {
  flex-shrink: 0;
  /* Đảm bảo ảnh không bị co lại */
}

.review-image-preview {
  width: 150px;
  /* Kích thước của ảnh */
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-details {
  flex-grow: 1;
  /* Đảm bảo phần nội dung chiếm hết không gian còn lại */
}

.review-author {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.review-comment {
  font-size: 1.2rem;
  color: #555;
  margin-top: 10px;
  padding-left: 20px;
  border-left: 3px solid #28a745;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}

/* Star Rating CSS */
.star-rating {
  display: flex;
  gap: 5px;
  font-size: 1.5rem;
  color: #ccc;
}

.star-rating .star {
  cursor: default;
  transition: color 0.2s ease-in-out;
}

.star-rating .star.filled {
  color: gold;
}
</style>