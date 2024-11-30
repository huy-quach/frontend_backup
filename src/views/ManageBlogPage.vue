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
                    <router-link to="/manage-blog" class="nav-link active">
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
                <h1>Quản lý tin tức</h1>
                <button class="add-blog-button" @click="openModal('add')">Thêm tin tức mới</button>
            </header>

            <section class="blog-overview">
                <div class="blog-card" v-for="blog in blogs" :key="blog._id">
                    <img v-if="blog.imageUrl" :src="'http://localhost:5000' + blog.imageUrl" class="blog-image"
                        alt="Blog Image">
                    <div class="blog-info">
                        <h3>{{ blog.title }}</h3>
                        <p><strong>Tác giả:</strong> {{ blog.author }}</p>
                        <p><strong>Phân loại:</strong> {{ blog.category }}</p>
                        <p><strong>Nội dung:</strong> {{ blog.content.slice(0, 100) }}{{ blog.content.length > 100
                            ? '...' : '' }}</p>
                    </div>
                    <div class="blog-actions">
                        <button class="edit-button" @click="openModal('edit', blog)">Sửa</button>
                        <button class="delete-button" @click="deleteBlog(blog._id)">Xóa</button>
                    </div>
                </div>
            </section>

            <!-- Blog Form Modal -->
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <h2>{{ isEditing ? 'Sửa tin tức' : 'Thêm tin tức mới' }}</h2>
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
                            <label for="author">Tác giả: </label>
                            <input type="text" v-model="formData.author" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Phân loại: </label>
                            <select v-model="formData.category" required>
                                <option value="">Chọn phân loại</option>
                                <option value="Business">Business</option>
                                <option value="Sport">Sport</option>
                                <option value="Game">Game</option>
                                <option value="Life">Life</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="image">Hình ảnh: </label>
                            <input type="file" @change="onFileChange">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
                            <button type="button" class="btn btn-success" @click="handleSubmit">{{ isEditing ? 'Thay đổi tin tức' : 'Tạo tin tức mới' }}</button>
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
            blogs: [],
            showModal: false,
            isEditing: false,
            formData: {
                title: '',
                content: '',
                author: '',
                category: '',
                image: null,
            },
            editBlogId: null,
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
        this.fetchBlogs();
    },
    methods: {
        async fetchBlogs() {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs');
                this.blogs = response.data;
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        },
        onFileChange(e) {
            this.formData.image = e.target.files[0];
        },
        async handleSubmit() {
            const formData = new FormData();
            formData.append('title', this.formData.title);
            formData.append('content', this.formData.content);
            formData.append('author', this.formData.author);
            formData.append('category', this.formData.category);
            if (this.formData.image) {
                formData.append('image', this.formData.image);
            }

            const token = localStorage.getItem('token');

            try {
                if (this.isEditing) {
                    await axios.put(`http://localhost:5000/api/blogs/${this.editBlogId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    await axios.post('http://localhost:5000/api/blogs', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
                this.fetchBlogs();
                this.closeModal();
            } catch (error) {
                console.error('Error submitting blog:', error);
            }
        },
        deleteBlog(id) {
            const token = localStorage.getItem('token');
            axios
                .delete(`http://localhost:5000/api/blogs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    this.fetchBlogs();
                })
                .catch((error) => {
                    console.error('Error deleting blog:', error);
                });
        },
        openModal(action, blog = null) {
            this.showModal = true;
            if (action === 'edit' && blog) {
                this.formData.title = blog.title;
                this.formData.content = blog.content;
                this.formData.author = blog.author;
                this.formData.category = blog.category;
                this.editBlogId = blog._id;
                this.isEditing = true;
            } else {
                this.resetForm();
                this.isEditing = false;
            }
        },
        closeModal() {
            this.showModal = false;
        },
        resetForm() {
            this.formData = {
                title: '',
                content: '',
                author: '',
                category: '',
                image: null,
            };
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

.add-blog-button {
    background-color: #48bb78;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
}

.blog-overview {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
}

.blog-card {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.blog-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.blog-actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}

.edit-button,
.delete-button {
    padding: 5px 10px;
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
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
