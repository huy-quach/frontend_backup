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
                    <router-link to="/manage-inventory" class="nav-link active">
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
                <h1>Quản lý kho hàng</h1>
                <button @click="showModal = true" class="add-product-button">Nhập hàng</button>
            </header>
            <!-- Bảng hiển thị sản phẩm đã nhập -->
            <div class="table-responsive">
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Mô tả</th>
                            <th>Giá gốc</th>
                            <th>Giá bán</th>
                            <th>Danh mục</th>
                            <th>Số lượng</th>
                            <th>Nhà cung cấp</th>
                            <th>Chất liệu</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in inventory" :key="product._id">
                            <td>
                                <img :src="product?.product?.image ? `http://localhost:5000/uploads/${product.product.image}` : 'default-image.jpg'"
                                    alt="Product Image" class="product-image" />
                            </td>
                            <td>{{ product?.product?.name || 'N/A' }}</td>
                            <td class="product-description">{{ product?.product?.description || 'N/A' }}</td>
                            <td>{{ product?.costPrice ? formatCurrency(product.costPrice) : 'N/A' }}</td>
                            <td>{{ product?.salePrice ? formatCurrency(product.salePrice) : 'N/A' }}</td>



                            <td>{{ product?.product?.category || 'N/A' }}</td>
                            <td>{{ product?.quantity || 'N/A' }}</td>
                            <td>{{ product?.supplier || 'N/A' }}</td>
                            <td class="product-material">{{ product?.product?.material || 'N/A' }}</td>

                        </tr>


                    </tbody>
                </table>

            </div>

            <!-- Modal nhập hàng -->
            <div v-if="showModal" class="modal-backdrop">
                <div class="custom-modal">
                    <div class="modal-content">
                        <h2>Nhập hàng mới</h2>
                        <form @submit.prevent="submitImport">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="productName">Tên sản phẩm:</label>
                                    <input v-model="formData.productName" type="text" required />
                                </div>
                                <div class="form-group">
                                    <label for="description">Mô tả:</label>
                                    <textarea v-model="formData.description" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="originalPrice">Giá gốc:</label>
                                    <input v-model="formData.originalPriceFormatted" @input="formatOriginalPrice"
                                        type="text" required />
                                </div>
                                <div class="form-group">
                                    <label for="price">Giá bán:</label>
                                    <input v-model="formData.priceFormatted" @input="formatPrice" type="text"
                                        required />
                                </div>
                                <div class="form-group">
                                    <label for="category">Danh mục:</label>
                                    <select v-model="formData.category" required>
                                        <option value="">Chọn phân loại:</option>
                                        <option value="Ghế">Ghế</option>
                                        <option value="Bàn">Bàn</option>
                                        <option value="Giường Ngủ">Giường Ngủ</option>
                                        <option value="Salon Phòng Khách">Salon Phòng Khách</option>
                                        <option value="Bếp Ăn">Bếp Ăn</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="quantity">Số lượng:</label>
                                    <input v-model="formData.quantity" type="number" required />
                                </div>
                                <div class="form-group">
                                    <label for="supplier">Nhà cung cấp:</label>
                                    <input v-model="formData.supplier" type="text" required />
                                </div>
                                <div class="form-group">
                                    <label for="material">Chất liệu:</label>
                                    <input v-model="formData.material" type="text" required />
                                </div>
                                <div class="form-group">
                                    <label for="image">Hình ảnh:</label>
                                    <input type="file" @change="handleFileUpload" class="input-field" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="submit-button" :disabled="loading">
                                    {{ loading ? "Đang xử lý..." : "Nhập hàng" }}
                                </button>
                                <button @click="closeModal" class="cancel-button">Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
export default {
    data() {
        return {
            loading: false, // Trạng thái loading
            showModal: false, // Biến để điều khiển hiển thị modal
            formData: {
                image: '',
                productName: '',
                description: '',
                originalPrice: 0,
                price: 0,
                originalPriceFormatted: '',
                priceFormatted: '',
                category: '',
                quantity: 0,
                supplier: '',
                material: '',

            },
        };
    },
    computed: {
        ...mapState(['inventory']),
        ...mapState(['user']),
        isAdmin() {
            return this.user && this.user.role === 'admin';
        },
        isAdminOrEmployee() {
            return this.user && (this.user.role === 'admin' || this.user.role === 'employee');
        }
    },
    methods: {
        ...mapActions(['fetchInventory', 'importProducts']),
        async callImportProducts(formData) {
            try {
                const formDataObj = new FormData();
                formDataObj.append("productName", formData.productName);
                formDataObj.append("description", formData.description);
                formDataObj.append("originalPrice", formData.originalPrice);
                formDataObj.append("price", formData.price);
                formDataObj.append("category", formData.category);
                formDataObj.append("quantity", formData.quantity);
                formDataObj.append("material", formData.material);
                formDataObj.append("supplier", formData.supplier);

                if (formData.image) {
                    formDataObj.append("image", formData.image);
                }

                await axios.post("http://localhost:5000/api/inventory/import", formDataObj, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                await this.fetchInventory(); // Fetch lại danh sách kho
            } catch (error) {
                console.error("Lỗi nhập hàng:", error);
                throw error; // Ném lỗi để xử lý ở phương thức gọi
            }
        },
        async submitImport() {
            // Kiểm tra các trường bắt buộc
            if (
                !this.formData.productName ||
                !this.formData.description ||
                !this.formData.originalPriceFormatted ||
                !this.formData.priceFormatted ||
                !this.formData.category ||
                !this.formData.quantity ||
                !this.formData.supplier ||
                !this.formData.material
            ) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            // Chuyển đổi định dạng giá trị
            const originalPrice = parseFloat(this.formData.originalPriceFormatted.replace(/,/g, ''));
            const salePrice = parseFloat(this.formData.priceFormatted.replace(/,/g, ''));

            if (isNaN(originalPrice) || isNaN(salePrice)) {
                alert("Vui lòng nhập giá trị hợp lệ cho giá gốc và giá bán!");
                return;
            }

            // Gán giá trị chuyển đổi vào formData
            this.formData.originalPrice = originalPrice;
            this.formData.price = salePrice;

            try {
                // Gọi API nhập hàng
                await this.callImportProducts(this.formData);

                // Hiển thị thông báo thành công
                alert("Nhập hàng thành công!");
                this.resetForm();
                this.closeModal();
            } catch (error) {
                console.error("Lỗi khi nhập hàng:", error);
                alert("Lỗi khi nhập hàng, vui lòng thử lại!");
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.formData.image = file;
        },
        closeModal() {
            this.showModal = false;
        },
        formatCurrency(value) {
            if (value === undefined || value === null) {
                return "N/A"; // Giá trị mặc định nếu không có giá trị
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Định dạng số
        },
        resetForm() {
            this.formData = {
                image: '',
                productName: '',
                description: '',
                originalPrice: 0,
                price: 0,
                category: '',
                quantity: 0,
                supplier: '',
                material: '',
            };
        }
    },
    async mounted() {
        await this.fetchInventory(); // Gọi fetchInventory khi trang được load
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
    font-size: 25px;
}

.admin-header h1 {
    font-size: 30px;
    margin-bottom: 20px;
}

.add-product-button {
    padding: 12px 24px;
    /* Tăng kích thước nút */
    background-color: #48bb78;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    /* Tăng kích thước chữ trong nút */
    cursor: pointer;
    margin-left: auto;
    /* Đẩy nút sang phải */
}

.add-product-button:hover {
    background-color: #38a169;
}

.table-responsive {
    margin-top: 20px;
}

.inventory-table {
    width: 100%;
    border-collapse: collapse;
}

.inventory-table th,
.inventory-table td {
    padding: 1rem;
    text-align: center;
    border: 1px solid #ddd;
}

.product-image {
    max-width: 100px;
    border-radius: 5px;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.custom-modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    /* Đặt chiều cao tối đa cho modal */
    overflow-y: auto;
    /* Tạo thanh cuộn dọc khi nội dung quá dài */
}

.modal-content {
    width: 100%;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

/* Căn chỉnh các input, textarea và select */
.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    /* Bo tròn các góc của input */
    font-size: 16px;
    box-sizing: border-box;
}

/* Style cho nút */
.submit-button {
    background-color: #48bb78;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    /* Bo tròn nút */
    cursor: pointer;
    font-size: 16px;
}

.submit-button:hover {
    background-color: #38a169;
}

.cancel-button {
    background-color: #dc3545;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
}

.cancel-button:hover {
    background-color: #c53030;
}

/* Style cho input hình ảnh */
.input-field {
    padding: 6px;
}

.product-material {
    max-width: 200px;
    /* Điều chỉnh chiều rộng tối đa */
    white-space: nowrap;
    /* Không xuống dòng */
    overflow: hidden;
    /* Ẩn nội dung thừa */
    text-overflow: ellipsis;
    /* Hiển thị dấu "..." cho phần nội dung thừa */
}
</style>