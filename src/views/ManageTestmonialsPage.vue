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
                    <router-link to="/manage-testimonials" class="nav-link active">
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
                <h1>Quản lý phản hồi và đánh giá sản phẩm</h1>
            </header>

            <div class="content-sections">
                <!-- Danh sách đánh giá -->
                <section class="pending-reviews">
                    <h2>Danh sách đánh giá</h2>
                    <ul class="review-list">
                        <template v-if="reviews && reviews.length">
                            <li v-for="review in reviews" :key="review._id" class="review-item">
                                <div class="review-info">
                                    <h3>{{ review.productId.name }}</h3>
                                    <p><strong>Người đánh giá:</strong> {{ review.userId.name }}</p>
                                    <p><strong>Nội dung:</strong> {{ review.comment }}</p>
                                    <div class="stars">
                                        <span v-for="n in 5" :key="n" class="star"
                                            :class="{ filled: n <= review.rating }">&#9733;</span>
                                    </div>
                                    <div class="review-images">
                                        <img v-for="(image, index) in review.images" :key="index"
                                            :src="`http://localhost:5000/uploads/${image}`" alt="Đánh giá hình ảnh"
                                            class="review-image" />
                                    </div>
                                </div>
                                <div class="review-actions">
                                    <button v-if="!review.isTestimonial" @click="addTestimonial(review._id)"
                                        class="add-button">Chuyển thành phản hồi</button>
                                    <button @click="deleteReview(review._id)" class="delete-button">Xóa</button>
                                </div>
                            </li>
                        </template>
                        <template v-else>
                            <p>Không có đánh giá nào.</p>
                        </template>
                    </ul>
                </section>

                <!-- Danh sách phản hồi -->
                <section class="current-testimonials">
                    <h2>Phản hồi hiện tại</h2>
                    <ul class="testimonial-list">
                        <template v-if="testimonials && testimonials.length">
                            <li v-for="testimonial in testimonials" :key="testimonial._id" class="testimonial-item">
                                <div class="testimonial-info">
                                    <p><strong>Người dùng:</strong> {{ testimonial.userId.name }}</p>
                                    <p>Nội dung: {{ testimonial.comment }}</p>
                                    <div class="stars">
                                        <span v-for="n in 5" :key="n" class="star"
                                            :class="{ filled: n <= testimonial.rating }">&#9733;</span>
                                    </div>
                                    <div class="testimonial-images">
                                        <img v-for="(image, index) in testimonial.images" :key="index"
                                            :src="`http://localhost:5000/uploads/${image}`" alt="Hình ảnh phản hồi"
                                            class="testimonial-image" />
                                    </div>
                                </div>
                                <div class="review-actions">
                                    <button @click="revertTestimonial(testimonial._id)" class="revert-button">Thu
                                        hồi</button>
                                </div>
                            </li>
                        </template>
                        <template v-else>
                            <p>Không có phản hồi nào.</p>
                        </template>
                    </ul>
                </section>
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
            reviews: [], // Danh sách đánh giá chưa được duyệt
            testimonials: [], // Danh sách phản hồi
            form: {
                _id: null,
                name: '',
                message: '',
                rating: 0,
                image: null,
            },
            isEdit: false,
            isModalOpen: false,
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
    methods: {
        // Xóa đánh giá chỉ trên giao diện
        async deleteReview(reviewId) {
            try {
                await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                // Xóa đánh giá khỏi giao diện
                this.reviews = this.reviews.filter((review) => review._id !== reviewId);
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        },

        async revertTestimonial(testimonialId) {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/reviews/revert-testimonial",
                    { testimonialId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                console.log("Reverted testimonial:", response.data);

                // Xóa phản hồi khỏi danh sách testimonials ngay lập tức
                this.testimonials = this.testimonials.filter((t) => t._id !== testimonialId);

                // Thêm lại phản hồi vào danh sách đánh giá ngay lập tức
                if (response.data.review) {
                    this.reviews.push(response.data.review);
                }
            } catch (error) {
                console.error("Error reverting testimonial:", error);
            }
        },
        async fetchPendingReviews() {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews/pending-reviews', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.reviews = response.data; // Gán dữ liệu vào mảng reviews
            } catch (error) {
                console.error('Error fetching pending reviews:', error);
            }
        },
        async fetchTestimonials() {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews/testimonials', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.testimonials = response.data; // Gán dữ liệu vào mảng testimonials
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
            this.resetForm();
        },
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.form.image = file;
            }
        },
        async submitForm() {
            const formData = new FormData();
            formData.append('name', this.form.name);
            formData.append('message', this.form.message);
            formData.append('rating', this.form.rating);
            if (this.form.image) {
                formData.append('image', this.form.image);
            }

            try {
                const token = localStorage.getItem('token');
                if (this.isEdit) {
                    await axios.put(`http://localhost:5000/api/testimonials/${this.form._id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    await axios.post('http://localhost:5000/api/testimonials', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

                this.fetchTestimonials();
                this.closeModal();
            } catch (error) {
                console.error('Error submitting testimonial:', error);
            }
        },
        resetForm() {
            this.isEdit = false;
            this.form = {
                _id: null,
                name: '',
                message: '',
                rating: 0,
                image: null,
            };
        },
        async addTestimonial(reviewId) {
            try {
                // Kiểm tra số lượng phản hồi hiện tại
                if (this.testimonials.length >= 3) {
                    alert("Chỉ có thể hiển thị tối đa 3 phản hồi.");
                    return;
                }

                const response = await axios.post(
                    "http://localhost:5000/api/reviews/add-testimonial",
                    { reviewId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                console.log("Added testimonial:", response.data);

                // Cập nhật giao diện
                const reviewIndex = this.reviews.findIndex((r) => r._id === reviewId);
                if (reviewIndex !== -1) {
                    // Xóa đánh giá khỏi danh sách
                    this.reviews.splice(reviewIndex, 1);
                }

                // Thêm phản hồi vào danh sách
                this.testimonials.push(response.data.testimonial);
            } catch (error) {
                console.error("Error adding testimonial:", error);
            }
        }
    },
    created() {
        this.fetchPendingReviews();
        this.fetchTestimonials();
    },
};
</script>

<style scoped>
.delete-button {
    background-color: #dc3545;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.delete-button:hover {
    background-color: #c82333;
}

.revert-button {
    background-color: #ffc107;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.revert-button:hover {
    background-color: #e0a800;
}

.testimonial-images {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.testimonial-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.review-images {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.review-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.responded-label {
    color: #28a745;
    font-weight: bold;
}

.star-rating {
    display: flex;
    gap: 10px;
    font-size: 1.75rem;
    color: #ddd;
}

.star-rating .star {
    cursor: pointer;
    transition: color 0.2s;
}

.star-rating .star.filled {
    color: #ffc107;
    /* Màu vàng cho ngôi sao được chọn */
}

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

.add-testimonial-button {
    background-color: #28a745;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
}

/* Nút Edit */
.edit-button {
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s ease;
}

.edit-button:hover {
    background-color: #0056b3;
}

/* Nút Delete */
.delete-button {
    background-color: #dc3545;
    color: white;
    transition: background-color 0.3s ease;
}

.delete-button:hover {
    background-color: #c82333;
}


.review-list,
.testimonial-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.review-item,
.testimonial-item {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-info,
.testimonial-info {
    margin-bottom: 10px;
}

.review-actions {
    text-align: right;
}

.add-button {
    background-color: #28a745;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.add-button:hover {
    background-color: #218838;
}

.stars {
    display: flex;
    gap: 5px;
}

.stars .star {
    color: #ccc;
}

.stars .star.filled {
    color: #ffc107;
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 15px;
    max-width: 600px;
    width: 100%;
}

.input-field {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.modal-submit {
    background-color: #007bff;
    /* Blue background */
    color: white;
    /* White text */
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.modal-submit:hover {
    background-color: #0056b3;
    /* Darker blue on hover */
}

.modal-cancel {
    background-color: #6c757d;
    /* Gray background */
    color: white;
    /* White text */
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.modal-cancel:hover {
    background-color: #5a6268;
    /* Darker gray on hover */
}
</style>
