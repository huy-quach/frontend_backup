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
          <router-link to="/manage-furniture" class="nav-link active">
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
        <h1>Quản lý sản phẩm</h1>
        <div class="search-section">
          <input v-model="searchQuery" type="text" placeholder="Tìm kiếm sản phẩm..." class="search-input" />
        </div>
      </header>

      <!-- Bảng danh sách sản phẩm -->
      <div class="table-responsive">
        <table class="product-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Phân loại</th>
              <th>Chất liệu</th>
              <th>Tình trạng</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            <!-- Sử dụng filteredFurniture thay vì activeFurniture -->
            <tr v-for="product in filteredFurniture" :key="product._id">
              <td>
                <img :src="product.image ? `http://localhost:5000/uploads/${product.image}` : 'default-image-path.jpg'"
                  alt="Product Image" class="product-image" />
              </td>
              <td>{{ product.name }}</td>
              <td class="product-description">{{ product.description }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.material }}</td>
              <td>
                <span :class="product.inStock ? 'in-stock' : 'out-of-stock'">
                  {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(product)" class="edit-button">Sửa</button>
                  <button @click="confirmHide(product._id)" class="delete-button">Ẩn</button>
                  <button @click="confirmDelete(product._id)" class="delete-button">Xóa</button>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="custom-modal">
        <div class="modal-content">
          <h2>Xóa sản phẩm này?</h2>
          <div class="modal-footer">
            <button @click="handleDeleteProduct" class="confirm-button">Có</button>
            <button @click="closeDeleteModal" class="cancel-button">Không</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal để chỉnh sửa sản phẩm -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="custom-modal">
        <div class="modal-content">
          <h2>Sửa sản phẩm</h2>
          <form @submit.prevent="updateProduct">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Tên sản phẩm:</label>
                <input v-model="formData.name" type="text" required class="input-field" />
              </div>
              <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea v-model="formData.description" required class="textarea-field"></textarea>
              </div>
              <div class="form-group">
                <label for="category">Phân loại:</label>
                <input v-model="formData.category" type="text" required class="input-field" />
              </div>
              <div class="form-group">
                <label for="material">Chất liệu:</label>
                <input v-model="formData.material" type="text" required class="input-field" />
              </div>
              <div class="form-group">
                <label for="image">Hình ảnh:</label>
                <input type="file" @change="handleFileUpload" class="input-field" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="submit-button">Cập nhật</button>
              <button @click="closeModal" class="cancel-button">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Xác nhận ẩn sản phẩm -->
    <div v-if="showHideModal" class="modal-backdrop">
      <div class="custom-modal">
        <div class="modal-content">
          <h2>Ẩn sản phẩm này?</h2>
          <div class="modal-footer">
            <button @click="hideProduct" class="confirm-button">Có</button>
            <button @click="closeHideModal" class="cancel-button">Không</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Thông báo thành công -->
    <div v-if="showSuccessMessage" class="success-message">
      Product hidden successfully!
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      showModal: false,
      showHideModal: false,
      showSuccessMessage: false,
      isEditing: false,
      formData: {
        name: '',
        description: '',
        category: '',
        material: '',
        image: '',
      },
      editingProductId: null,
      hidingProductId: null,
      showDeleteModal: false,
      deletingProductId: null,
      searchQuery: "", // Biến để giữ giá trị tìm kiếm

    };
  },
  computed: {
    ...mapState(['furniture', 'user']),
    activeFurniture() {
      return this.furniture.filter(product => product.active);
    },
    filteredFurniture() {
      return this.furniture.filter((product) => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.material.toLowerCase().includes(searchLower)
        );
      });
    },
    isAdmin() {
      return this.user && this.user.role === 'admin';
    },
    isAdminOrEmployee() {
      return this.user && (this.user.role === 'admin' || this.user.role === 'employee');
    }
  },
  async mounted() {
    if (!this.user) {
      await this.$store.dispatch('loadUserFromToken');
    }
    this.$store.dispatch('fetchFurniture');
  },
  methods: {
    ...mapActions(['updateProduct', 'hideProduct', 'deleteProduct', 'fetchFurniture']),

    openEditModal(product) {
      this.isEditing = true;
      this.editingProductId = product._id;
      this.formData = { ...product };
      this.showModal = true;
    },
    confirmDelete(productId) {
      this.deletingProductId = productId;
      this.showDeleteModal = true;
    },
    async handleDeleteProduct() {
      try {
        // Gọi Vuex action để xóa sản phẩm
        await this.deleteProduct(this.deletingProductId);
        this.showDeleteModal = false;
        this.deletingProductId = null;
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    async updateProduct() {
      try {
        const formData = new FormData();
        formData.append("name", this.formData.name);
        formData.append("description", this.formData.description);
        formData.append("category", this.formData.category);
        formData.append("material", this.formData.material);

        if (this.formData.image instanceof File) {
          formData.append("image", this.formData.image); // Chỉ thêm hình ảnh nếu có
        }

        // Gọi Vuex action để cập nhật sản phẩm
        const updatedProduct = await this.$store.dispatch("updateProduct", {
          id: this.editingProductId,
          formData,
        });

        // Cập nhật ngay danh sách sản phẩm trên frontend
        const productIndex = this.furniture.findIndex(
          (product) => product._id === this.editingProductId
        );
        if (productIndex !== -1) {
          this.furniture.splice(productIndex, 1, updatedProduct);
        }

        this.closeModal();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },



    confirmHide(productId) {
      this.hidingProductId = productId;
      this.showHideModal = true;
    },

    async hideProduct() {
      await this.$store.dispatch('hideProduct', this.hidingProductId);
      this.showHideModal = false;
      this.showSuccessMessage = true;
      setTimeout(() => (this.showSuccessMessage = false), 3000);
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    closeHideModal() {
      this.showHideModal = false;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.formData.image = file;
    },

    resetForm() {
      this.formData = {
        name: '',
        description: '',
        category: '',
        material: '',
        image: '',
      };
    }
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

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-product-button {
  background-color: #28a745;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.add-product-button:hover {
  background-color: #218838;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  /* Giúp gộp viền của các ô */
  table-layout: fixed;
  /* Đảm bảo kích thước cột ổn định */
}

.product-table th,
.product-table td {
  padding: 1rem;
  text-align: center;
  border: 1px solid #ddd;
  /* Thêm viền cho mỗi ô */
}

.product-table th {
  font-weight: bold;
  background-color: #f8f9fa;
  /* Màu nền cho tiêu đề cột */
}

.product-table td {
  background-color: white;
}

/* Thêm khoảng cách giữa các hàng */
.product-table tr {
  height: 50px;
}

.product-image {
  max-width: 100px;
  border-radius: 5px;
}

.in-stock {
  color: #28a745;
}

.out-of-stock {
  color: #dc3545;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-body {
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 10px;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

/* Button styles for Edit and Delete - giống với ManageTestimonials.vue */
.edit-button,
.hide-button,
.delete-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s ease;
  text-align: center;
  font-weight: bold;
  width: 100%;
}

/* Nút "Sửa" */
.edit-button {
  background-color: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
}
.edit-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.6);
}

/* Nút "Ẩn" */
.hide-button {
  background-color: #ffc107;
  color: black;
  box-shadow: 0 2px 4px rgba(255, 193, 7, 0.4);
}
.hide-button:hover {
  background-color: #e0a800;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.6);
}

/* Nút "Xóa" */
.delete-button {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.4);
}
.delete-button:hover {
  background-color: #c82333;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.6);
}

/* Điều chỉnh hiển thị các nút */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.submit-button {
  background-color: #28a745;
  /* Màu xanh lá */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #218838;
  /* Màu xanh lá đậm hơn khi hover */
}

.cancel-button {
  background-color: #6c757d;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  color: white;
}

.success-message {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #28a745;
  padding: 1rem;
  border-radius: 10px;
}

/* Styles for the confirm button in the delete modal (Yes button) */
.confirm-button {
  background-color: #28a745;
  /* Màu xanh lá */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #218838;
  /* Màu xanh lá đậm hơn khi hover */
}

/* Styles for the cancel button in the delete modal (No button) */
.cancel-button {
  background-color: #6c757d;
  /* Màu xám */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #5a6268;
  /* Màu xám đậm hơn khi hover */
}

/* Căn giữa các nút trong modal */
.modal-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.search-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
