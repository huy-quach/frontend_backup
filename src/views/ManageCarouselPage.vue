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
                    <router-link to="/manage-carousel" class="nav-link active">
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
                <h1 class="page-title">Quản lý Carousel</h1>
                <button class="add-carousel-button" @click="openModal('add')">Thêm Carousel mới</button>
            </header>

            <!-- Khu vực hiển thị carousel và khoảng trống -->
            <div class="carousel-section">
                <div class="carousel-list-container">
                    <div class="carousel-list">
                        <div v-for="carousel in carousels" :key="carousel._id" class="carousel-item"
                            @click="selectCarousel(carousel)">
                            <img :src="'http://localhost:5000/uploads/' + carousel.image" class="carousel-thumbnail"
                                alt="Carousel Image">
                            <div class="carousel-info">
                                <h3>{{ carousel.title }}</h3>
                                <p>{{ carousel.content.slice(0, 50) }}...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Khoảng trắng để hiển thị chi tiết khi click vào -->
                <div class="carousel-preview" v-if="selectedCarousel">
                    <div class="preview-content">
                        <h2>{{ selectedCarousel.title }}</h2>
                        <img :src="'http://localhost:5000/uploads/' + selectedCarousel.image"
                            class="carousel-large-image" alt="Selected Carousel Image">
                        <p>{{ selectedCarousel.content }}</p>
                        <div class="carousel-actions">
                            <button class="edit-button" @click="openModal('edit', selectedCarousel)">Sửa</button>
                            <button class="delete-button" @click="deleteCarousel(selectedCarousel._id)">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Carousel Form Modal -->
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <h2>{{ isEditing ? 'Sửa Carousel' : 'Thêm Carousel mới' }}</h2>
                    <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                            <label for="title">Tiêu đề: </label>
                            <input type="text" v-model="formData.title" required>
                        </div>
                        <div class="form-group">
                            <label for="content">Nội dung: </label>
                            <textarea v-model="formData.content" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="image">Hình ảnh: </label>
                            <input type="file" @change="onFileChange">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
                            <button type="submit" class="btn btn-success">{{ isEditing ? 'Cập nhật Carousel' : 'Tạo Carousel mới' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            carousels: [],
            selectedCarousel: null,
            showModal: false,
            isEditing: false,
            formData: {
                title: '',
                content: '',
                image: null,
            },
            editCarouselId: null,
        };
    },
    computed: {
        ...mapState(['user']), // Lấy thông tin user từ Vuex store

        isAdmin() {
            return this.user && this.user.role === 'admin';
        },
        isAdminOrEmployee() {
            return this.user && (this.user.role === 'admin' || this.user.role === 'employee');
        }
    },
    created() {
        this.fetchCarousels();
    },
    methods: {
        async fetchCarousels() {
            try {
                const response = await axios.get('http://localhost:5000/api/carousels');
                this.carousels = response.data;
            } catch (error) {
                console.error('Error fetching carousels:', error);
            }
        },
        onFileChange(e) {
            this.formData.image = e.target.files[0];
        },
        async handleSubmit() {
            const formData = new FormData();
            formData.append('title', this.formData.title);
            formData.append('content', this.formData.content);
            if (this.formData.image) {
                formData.append('image', this.formData.image);
            }

            const token = localStorage.getItem('token');

            try {
                if (this.isEditing) {
                    const response = await axios.put(`http://localhost:5000/api/carousels/${this.editCarouselId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const updatedCarousel = response.data;
                    this.selectedCarousel = updatedCarousel;

                    // Cập nhật danh sách carousels
                    const index = this.carousels.findIndex(c => c._id === this.editCarouselId);
                    if (index !== -1) {
                        this.carousels[index] = updatedCarousel; // Cập nhật trực tiếp mà không dùng this.$set
                    }
                } else {
                    const response = await axios.post('http://localhost:5000/api/carousels', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.carousels.push(response.data);
                }

                // Đóng modal ngay sau khi xử lý thành công
                this.closeModal();

            } catch (error) {
                console.error('Error submitting carousel:', error);
            }
        },
        deleteCarousel(id) {
            const token = localStorage.getItem('token');
            axios
                .delete(`http://localhost:5000/api/carousels/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    this.carousels = this.carousels.filter(carousel => carousel._id !== id);
                    this.selectedCarousel = null; // Reset lại phần preview
                })
                .catch((error) => {
                    console.error('Error deleting carousel:', error);
                });
        },
        openModal(action, carousel = null) {
            this.showModal = true;
            if (action === 'edit' && carousel) {
                this.formData.title = carousel.title;
                this.formData.content = carousel.content;
                this.editCarouselId = carousel._id;
                this.isEditing = true;
            } else {
                this.resetForm();
                this.isEditing = false;
            }
        },
        closeModal() {
            this.showModal = false;
            this.isEditing = false;
            this.resetForm();
        },
        resetForm() {
            this.formData = {
                title: '',
                content: '',
                image: null,
            };
        },
        selectCarousel(carousel) {
            this.selectedCarousel = carousel;
        }
    }
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
}

/* Main content */
.main-content {
    margin-top: 60px;
    margin-left: 240px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-title {
    font-size: 24px;
    font-weight: bold;
}

.add-carousel-button {
    background-color: #48bb78;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

/* Carousel section */
.carousel-section {
    display: flex;
    justify-content: center;
    gap: 40px;
}

/* Carousel list */
.carousel-list-container {
    width: 40%;
}

.carousel-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.carousel-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.carousel-item:hover {
    background-color: #e2e8f0;
}

.carousel-thumbnail {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
}

.carousel-info {
    display: flex;
    flex-direction: column;
}

.carousel-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
}

.carousel-info p {
    margin: 5px 0 0;
    font-size: 14px;
    color: #718096;
}

/* Carousel preview */
.carousel-preview {
    flex-grow: 1;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.carousel-large-image {
    width: 100%;
    max-width: 500px;
    height: auto;
    margin-bottom: 20px;
    border-radius: 8px;
    object-fit: cover;
}

/* Carousel actions */
.carousel-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.edit-button,
.delete-button {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.edit-button {
    background-color: #007bff;
    color: white;
}

.delete-button {
    background-color: #dc3545;
    color: white;
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 600px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
