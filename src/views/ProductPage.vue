<template>
  <div class="product-page">
    <IdleLogout />
    <!-- Header -->
    <header class="product-header">
      <h2>Sản phẩm nổi bật tại cửa hàng</h2>
    </header>

    <div class="product-layout">
      <aside class="category-sidebar">
        <!-- Sidebar -->
        <div class="category-filter">
          <label for="category" class="category-label">Danh mục sản phẩm:</label>
          <select v-model="selectedCategory" @change="filterProducts" class="category-dropdown">
            <option value="">Tất cả sản phẩm</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="price-filter">
          <label for="price-sort" class="price-sort-label">Sắp xếp theo giá:</label>
          <select v-model="selectedSortOrder" @change="sortProducts" class="price-sort-dropdown">
            <option value="">Không sắp xếp</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>


      </aside>

      <!-- Product List -->
      <section class="product-list-section">
  <div v-if="filteredFurniture.length === 0" class="no-products">
    Không có sản phẩm nào trong cửa hàng!
  </div>
  <div v-else class="product-card" v-for="item in filteredFurniture" :key="item._id">
    <div class="card-content">
      <div class="image-container">
        <img :src="getImageUrl(item.image)" alt="Product Image" class="product-image" />
        <button @click="addToCart(item)" class="floating-cart-btn">
          🛒
        </button>
      </div>
      <h3 class="product-name">{{ item.name }}</h3>
      <p class="product-description">
        {{ getTruncatedDescription(item.description) }}
      </p>
      <p class="product-price">
        <strong>Giá: {{ formatCurrencyVND(item.salePrice) }}</strong>
      </p>
      <p class="product-material">
        Chất liệu: {{ getTruncatedMaterial(item.material) }}
      </p>
      <p v-if="item.totalStock === 0" class="text-danger">
        Hết hàng
      </p>
      <p v-else class="text-success">Còn hàng</p>
      <button class="detail-button" @click="goToDetail(item._id)">
        Chi Tiết
      </button>
    </div>
  </div>
</section>




    </div>
  </div>
</template>

<script>
import IdleLogout from "@/components/IdleLogout.vue";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      selectedCategory: "", // Danh mục được chọn
      selectedSortOrder: "", // Giá trị sắp xếp: "asc" (tăng dần), "desc" (giảm dần)
      categories: ["Ghế", "Bàn", "Giường Ngủ", "Salon Phòng Khách", "Bếp Ăn"],
    };
  },
  components: {
    IdleLogout,
  },
  computed: {
  ...mapState(["furniture"]),
  filteredFurniture() {
    if (!this.furniture || this.furniture.length === 0) {
      return []; // Trả về mảng rỗng nếu không có dữ liệu
    }

    // Lọc theo danh mục nếu được chọn
    let filtered = this.furniture.filter((item) => {
      const matchesCategory =
        !this.selectedCategory || item.category === this.selectedCategory;
      return matchesCategory && item.active; // Chỉ hiển thị sản phẩm đang hoạt động
    });

    // Sắp xếp theo giá nếu cần
    if (this.selectedSortOrder) {
      filtered.sort((a, b) =>
        this.selectedSortOrder === "asc"
          ? a.salePrice - b.salePrice
          : b.salePrice - a.salePrice
      );
    }

    return filtered;
  },
},
  methods: {
    getImageUrl(image) {
      return image ? `http://localhost:5000/uploads/${image}` : "/default-product-image.jpg"; // Đường dẫn ảnh mặc định
    },

    getTruncatedMaterial(material) {
      const maxWords = 3; // Số từ tối đa hiển thị
      const words = material.split(" ");
      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(" ") + " ..."; // Ghép các từ và thêm "..."
      }
      return material; // Hiển thị đầy đủ nếu không quá dài
    },
    getTruncatedDescription(description) {
      return description.length > 100
        ? description.slice(0, 100) + "..."
        : description;
    },
    formatCurrencyVND(amount) {
      if (!amount) return "Chưa có thông tin giá";
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    addToCart(product) {
      const cartItem = {
        ...product,
        quantity: 1,
      };
      this.$store.dispatch("addToCart", cartItem);
    },
    goToDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    ...mapActions(["fetchInventory", "fetchFurnitureByCategory"]),
    filterProducts() {
      // Lọc lại danh sách sản phẩm khi thay đổi danh mục
      this.filteredInventory;
    },
    sortProducts() {
      // Sắp xếp danh sách sản phẩm khi thay đổi giá trị sắp xếp
      this.filteredInventory;
    },
  },
  mounted() {
  if (!this.furniture || this.furniture.length === 0) {
    // Gọi fetchFurniture nếu dữ liệu chưa có
    this.$store.dispatch("fetchFurniture").then(() => {
      console.log("Fetched furniture:", this.furniture);
    });
  }
},



};
</script>

<style scoped>
.product-material {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  /* Không xuống dòng */
  overflow: hidden;
  /* Ẩn phần dư thừa */
  text-overflow: ellipsis;
  /* Hiển thị "..." nếu vượt quá chiều rộng */
}

.price-range-filter {
  margin-bottom: 1.5rem;
}

.filter-label {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-inputs input {
  width: 45%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.price-inputs input:focus {
  border-color: #4caf50;
  /* Thay đổi viền khi focus */
  outline: none;
}

.price-inputs span {
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .price-range-filter {
    margin-bottom: 2rem;
  }

  .price-inputs {
    flex-direction: column;
    /* Chuyển thành dọc trên thiết bị nhỏ */
    align-items: stretch;
  }

  .price-inputs input {
    width: 100%;
    /* Chiếm hết chiều rộng */
  }

  .price-inputs span {
    margin-top: 0.5rem;
    /* Khoảng cách giữa các thành phần */
  }
}

.filter-controls {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
  /* Canh giữa */
}

.category-filter,
.price-filter {
  flex: 1;
  max-width: 300px;
  /* Giới hạn chiều rộng */
}

.category-label,
.price-sort-label {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: block;
  text-align: left;
  /* Canh trái */
}

.category-dropdown,
.price-sort-dropdown {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  appearance: none;
  /* Ẩn kiểu mặc định của trình duyệt */
  cursor: pointer;
}

.category-dropdown:hover,
.price-sort-dropdown:hover {
  border-color: #4caf50;
  /* Đổi viền khi hover */
}

.filter-controls select:focus {
  outline: none;
  border: 1px solid #4caf50;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    /* Hiển thị dọc trên thiết bị nhỏ */
    align-items: center;
  }

  .category-filter,
  .price-filter {
    max-width: 100%;
    /* Đảm bảo chiếm hết chiều rộng */
  }
}


.product-page {
  padding: 2rem 5%;
  background-color: #f9f9f9;
}

.product-header {
  text-align: center;
  margin-bottom: 2rem;
  background-color: #4caf50;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-header h2 {
  font-size: 2.2rem;
  font-weight: bold;
}

.product-layout {
  display: flex;
  gap: 2rem;
}

.category-sidebar {
  width: 20%;
}

.category-label {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.category-dropdown {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}

.product-list-section {
  width: 80%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px) scale(1.03);
  /* Phóng to nhẹ */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  /* Tăng bóng khi hover */
}


.card-content {
  padding: 1.5rem;
  text-align: center;
}

.image-container {
  position: relative;
}

.product-image {
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid transparent;
  /* Viền mặc định */
  transition: all 0.3s ease;
}

.product-card:hover .product-image {
  border-color: #ff6600;
  /* Đổi màu viền khi hover */
  transform: scale(1.05);
  /* Phóng to hình ảnh */
}

.floating-cart-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff6600;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.floating-cart-btn:hover {
  background-color: #ff8533;
}

.product-name {
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 1rem;
}

.product-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.high-value {
  border: 2px solid #ff6600;
  /* Viền nổi bật */
  box-shadow: 0 4px 10px rgba(255, 101, 0, 0.2);
  /* Thêm bóng */
}

.high-value .product-price {
  color: #ff0000;
  /* Đổi màu giá */
}

.product-price {
  font-size: 1.5rem;
  /* Tăng kích thước chữ */
  color: #ff6600;
  /* Màu cam nổi bật */
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  /* Thêm hiệu ứng bóng cho chữ */
}


.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.detail-button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: #ff6600;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border: none;
  /* Loại bỏ viền */
  cursor: pointer;
  box-shadow: none;
  /* Loại bỏ bóng đổ nếu có */
}

.detail-button:hover {
  background-color: #ff8533;
  transform: scale(1.1);
  /* Phóng to khi hover */
  box-shadow: 0px 4px 8px rgba(255, 101, 0, 0.3);
  /* Thêm bóng */
}

.no-products {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
