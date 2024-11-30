<template>
    <div class="order-history container py-5">
        <h1 class="text-center mb-5">Đơn hàng của bạn</h1>
        <div v-if="orders.length === 0" class="text-center">
            <p class="no-orders">Hiện tại bạn không có đơn hàng nào.</p>
        </div>

        <div v-for="order in orders" :key="order._id" class="order-item">
            <div>
                <h2 class="order-id mb-3">Mã số: #{{ order._id }}</h2>
                <p class="payment-method text-muted">Phương thức thanh toán: {{
                    translatePaymentMethod(order.paymentMethod) }}</p>
                <p class="order-date text-muted">Ngày đặt hàng: {{ formatOrderDate(order.createdAt) }}</p>

                <!-- Tình trạng đơn hàng -->
                <div class="order-status-container">
                    <p>
                        Tình trạng đơn hàng:
                        <span :class="order.orderStatus">{{ order.orderStatus }}</span>
                    </p>
                    <p v-if="statusMessage[order._id]" class="text-danger">{{ statusMessage[order._id] }}</p>
                </div>
                <div class="action-buttons">
                    <!-- Nút xem chi tiết -->
                    <button @click="toggleOrderDetails(order._id)" class="toggle-details-btn">
                        {{ openedOrderIds.includes(order._id) ? 'Ẩn chi tiết' : 'Xem chi tiết' }}
                    </button>

                    <!-- Nút hủy đơn hàng -->
                    <button v-if="order.orderStatus === 'Đang gửi'" @click="cancelOrder(order._id)"
                        class="cancel-order-btn">
                        Hủy đơn hàng
                    </button>
                    <button v-else-if="order.orderStatus === 'Đang vận chuyển' || order.orderStatus === 'Hoàn thành'"
                        @click="showCannotCancelMessage(order._id)" class="cancel-order-btn">
                        Hủy đơn hàng
                    </button>
                </div>

                <!-- Thông tin chi tiết của đơn hàng -->
                <div v-if="openedOrderIds.includes(order._id)" class="order-details mt-3">
                    <!-- Thông tin của đơn hàng -->
                    <div class="shipping-info p-3 mb-3 rounded bg-light border">
                        <h5 class="mb-3">Thông tin của đơn hàng</h5>
                        <div class="address-inline">
                            <span><strong>Họ và tên:</strong> {{ order.shippingAddress.fullName }}</span><br />
                            <span><strong>Số điện thoại:</strong> {{ order.shippingAddress.phoneNumber }}</span><br />
                            <span><strong>Địa chỉ:</strong> {{ order.shippingAddress.street }}</span><br />
                            <span v-if="order.shippingAddress.note"><strong>Ghi chú:</strong> {{
                                order.shippingAddress.note }}</span>
                        </div>
                    </div>

                    <!-- Danh sách sản phẩm -->
                    <div v-if="order.products && order.products.length > 0" class="order-products">
                        <div v-for="item in order.products" :key="item.product._id" class="product-item">
                            <img :src="`http://localhost:5000/uploads/${item.product.image}`" alt="Product Image"
                                class="product-image mr-4" />
                            <div class="product-details ml-4">
                                <p class="product-name"><strong>{{ item.product.name }}</strong></p>
                                <p class="product-quantity">Số lượng: {{ item.quantity }}</p>
                                <p class="product-price">Đơn giá: {{ formatCurrencyVND(item.price)
                                        }}</p>
                                        <p class="product-price"><strong>Thành tiền: {{ formatCurrencyVND((item.price)*(item.quantity))
                                        }}</strong></p>
                                <div class="product-review">
                                    <!-- Hiển thị nút đánh giá sản phẩm nếu trạng thái đơn hàng là 'Hoàn thành' -->
                                    <button
                                        v-if="order.orderStatus === 'Hoàn thành' && !reviewedProducts.includes(item.product._id)"
                                        @click="openReviewModal(order, item.product)"
                                        class="btn btn-primary rate-review-btn">
                                        Đánh giá sản phẩm
                                    </button>
                                    <button v-else-if="reviewedProducts.includes(item.product._id)"
                                        class="btn btn-secondary" disabled>Đã đánh giá</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tổng số tiền -->
                    <p class="total-amount mt-3 text-right"><strong>Số tiền cần thanh toán: {{ formatCurrencyVND(order.totalAmount)
                            }}</strong></p>
                </div>
            </div>
        </div>
        <!-- Modal đánh giá sản phẩm -->
        <div v-if="showReviewModal" class="review-modal">
            <div class="modal-content">
                <h3 class="modal-title">Đánh giá sản phẩm</h3>
                <div class="modal-body">
                    <label for="rating">Yêu thích: </label>
                    <div class="star-rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rating }"
                            @click="setRating(star)">&#9733;</span>
                    </div>
                    <label for="comment">Nội dung:</label>
                    <textarea v-model="comment" class="modal-textarea"
                        placeholder="Viết đánh giá của bạn..."></textarea>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                    <label for="images">Hình ảnh:</label>
                    <input type="file" ref="fileInput" multiple @change="handleImageUpload" accept="image/*" />
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                    <button class="btn btn-secondary" @click="resetImages">Reset</button>
                    <div v-if="previewImages.length > 0" class="image-preview-container">
                        <div v-for="(image, index) in previewImages" :key="index" class="image-preview-item">
                            <img :src="image" alt="Preview" class="preview-image" />
                            <button class="remove-image-btn" @click="removeImage(index)">✖</button>
                        </div>
                    </div>



                </div>

                <div class="modal-footer">
                    <button @click="submitReview(currentOrder.productId)" class="btn btn-primary">Đánh giá</button>
                    <button @click="closeReviewModal" class="btn btn-secondary">Đóng</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            orderStatuses: {},
            statusMessage: {}, // Lưu thông báo lỗi khi không thể hủy đơn hàng
            showReviewModal: false,
            rating: null,
            comment: '',
            currentOrder: null,
            previewImages: [], // Đảm bảo mảng được khởi tạo rỗng
            selectedImages: [],
            reviewedProducts: [],
            openedOrderIds: [],
            bannedWords: [], // Danh sách từ khóa cấm
            errorMessage: '', // Thông báo lỗi khi có từ nhạy cảm// Lưu trữ ID đơn hàng được mở
        };
    },
    created() {
        this.$store.dispatch('fetchOrders');
        this.fetchReviewedProducts();
        this.fetchBannedWords(); // Gọi API lấy danh sách từ khóa cấm

    },
    computed: {
        orders() {
            const orders = this.$store.getters.userOrders;
            orders.forEach(order => {
                this.orderStatuses[order._id] = order.orderStatus;
            });
            return orders;
        }
    },
    methods: {
        async fetchBannedWords() {
            try {
                const response = await axios.get("http://localhost:5000/api/banned-words", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                this.bannedWords = response.data.map((word) => word.word);
            } catch (error) {
                console.error("Error fetching banned words:", error);
            }
        },
        async cancelOrder(orderId) {
            try {
                const response = await axios.patch(
                    `http://localhost:5000/api/orders/${orderId}/cancel`,
                    {},
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );

                // Cập nhật trạng thái đơn hàng ngay trong dữ liệu orders và orderStatuses
                const updatedOrder = response.data.order;
                this.orderStatuses[orderId] = updatedOrder.orderStatus;
                this.statusMessage[orderId] = 'Đơn hàng đã được hủy thành công.';

                // Cập nhật trạng thái trực tiếp trong danh sách orders nếu cần
                const orderIndex = this.orders.findIndex(order => order._id === orderId);
                if (orderIndex !== -1) {
                    this.orders[orderIndex].orderStatus = updatedOrder.orderStatus;
                }

            } catch (error) {
                console.error("Lỗi khi hủy đơn hàng:", error);
                this.statusMessage[orderId] = 'Không thể hủy đơn hàng ngay bây giờ.';
            }
        },
        showCannotCancelMessage(orderId) {
            this.statusMessage[orderId] = 'Không thể hủy đơn hàng ngay bây giờ.';
        },
        toggleOrderDetails(orderId) {
            const index = this.openedOrderIds.indexOf(orderId);
            if (index === -1) {
                this.openedOrderIds.push(orderId);
            } else {
                this.openedOrderIds.splice(index, 1);
            }
        },
        setRating(star) {
            this.rating = star;
        },
        formatCurrencyVND(amount) {
            if (!amount) return "Chưa có thông tin giá";
            return amount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            });
        },
        translatePaymentMethod(paymentMethod) {
            if (paymentMethod === 'cash_on_delivery') return 'Thanh toán khi nhận hàng';
            if (paymentMethod === 'zalopay') return 'Thanh toán qua Zalopay';
            if (paymentMethod === 'paypal') return 'Thanh toán qua PayPal';
            if (paymentMethod === 'momo') return 'Thanh toán qua MoMo';
            return 'Phương thức khác';
        },
        formatOrderDate(dateString) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        },
        removeImage(index) {
            this.previewImages.splice(index, 1); // Xóa URL ảnh khỏi danh sách preview
            this.selectedImages.splice(index, 1); // Xóa file tương ứng
        },
        resetImages() {
            this.selectedImages = [];
            this.previewImages = [];
            this.errorMessage = ""; // Reset thông báo lỗi
            this.$refs.fileInput.value = ""; // Reset input file
        },

        async fetchReviewedProducts() {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews/user-reviewed-products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.reviewedProducts = response.data.reviewedProducts;
            } catch (error) {
                console.error('Error fetching reviewed products:', error);
            }
        },
        openReviewModal(order, product) {
            this.currentOrder = { product, orderId: order._id };
            this.rating = null;
            this.comment = '';
            this.selectedImages = []; // Reset danh sách hình ảnh đã chọn
            this.previewImages = []; // Reset preview hình ảnh
            this.errorMessage = ''; // Reset thông báo lỗi
            this.showReviewModal = true;
        },
        closeReviewModal() {
            this.showReviewModal = false;
            this.rating = null;
            this.comment = '';
            this.selectedImage = null;
            this.previewImage = null;
        },
        containsBannedWords(comment) {
            // Kiểm tra nếu comment chứa bất kỳ từ cấm nào
            return this.bannedWords.some((word) => comment.includes(word));
        },
        async submitReview() {
            // Kiểm tra nội dung đánh giá
            if (this.containsBannedWords(this.comment)) {
                this.errorMessage = "Nội dung của bạn chứa từ khóa nhạy cảm.";
                return; // Không gửi đánh giá nếu phát hiện từ cấm
            }

            try {
                const formData = new FormData();
                formData.append("productId", this.currentOrder.product._id);
                formData.append("rating", this.rating);
                formData.append("comment", this.comment);

                if (this.selectedImages && this.selectedImages.length > 0) {
                    this.selectedImages.slice(0, 3).forEach((image) => {
                        formData.append("images", image);
                    });
                }

                await axios.post("http://localhost:5000/api/reviews", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                this.reviewedProducts.push(this.currentOrder.product._id);
                this.closeReviewModal();
                alert("Đánh giá đã được gửi thành công.");
            } catch (error) {
                console.error("Error submitting review:", error);
                alert("Không thể gửi đánh giá. Vui lòng thử lại.");
            }
        },
        onImageChange(event) {
            const files = event.target.files;
            if (!files || files.length === 0) return; // Kiểm tra nếu không có file nào được chọn

            const newImages = Array.from(files);

            if (this.selectedImages.length + newImages.length > 3) {
                alert("Bạn chỉ có thể tải lên tối đa 3 hình ảnh.");
                return;
            }

            newImages.forEach(file => {
                const url = URL.createObjectURL(file);
                this.previewImages.push(url);
                this.selectedImages.push(file);
            });
        },
        handleImageUpload(event) {
            const files = Array.from(event.target.files); // Lấy danh sách file

            // Kiểm tra số lượng file (tối đa 3 hình ảnh)
            if (files.length > 3) {
                alert("Bạn chỉ có thể chọn tối đa 3 hình ảnh.");
                event.target.value = ""; // Reset input file
                return;
            }

            // Kiểm tra định dạng file
            const validExtensions = /\.(jpeg|jpg|png)$/i; // Regex kiểm tra định dạng file
            const invalidFiles = files.filter((file) => !validExtensions.test(file.name));
            if (invalidFiles.length > 0) {
                alert("Chỉ chấp nhận các định dạng hình ảnh: jpeg, jpg, png.");
                event.target.value = ""; // Reset input file
                return;
            }

            // Kiểm tra kích thước file (tối đa 2MB mỗi file)
            const oversizedFiles = files.filter((file) => file.size > 2 * 1024 * 1024); // 2MB
            if (oversizedFiles.length > 0) {
                alert("Một hoặc nhiều hình ảnh vượt quá giới hạn kích thước 2MB.");
                event.target.value = ""; // Reset input file
                return;
            }

            // Nếu hợp lệ, lưu hình ảnh và tạo preview
            this.selectedImages = files;
            this.previewImages = files.map((file) => URL.createObjectURL(file));
        }



    }
};
</script>



<style scoped>
.image-preview-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.image-preview-item {
    position: relative;
    width: 80px;
    height: 80px;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
}

.error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
}

.images-preview-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.image-preview-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
}

.image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
}

.order-history {
    background-color: #f1f5f8;
}

h1 {
    font-size: 2rem;
    color: #333;
}

.no-orders {
    font-size: 1.25rem;
    color: #888;
}

/* Thẻ đơn hàng */
.order-item {
    position: relative;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.order-item:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.order-id span {
    color: #007bff;
    font-weight: bold;
}

/* Tình trạng đơn hàng */
.order-status-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

.text-warning {
    color: #ffc107;
}

.text-info {
    color: #17a2b8;
}

.text-success {
    color: #28a745;
}

.text-danger {
    color: #dc3545;
}

/* Nút hành động */
.cancel-order-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.cancel-order-btn:hover {
    background-color: #ff1a1a;
}

/* Nút xem chi tiết */
.toggle-details-btn {
    background-color: transparent;
    border: 1px solid #007bff;
    color: #007bff;
    padding: 5px 10px;
    font-size: 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    margin-top: 10px;
}

.toggle-details-btn:hover {
    background-color: #007bff;
    color: white;
}

/* Danh sách sản phẩm */
.product-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.product-image {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-details {
    flex-grow: 1;
    margin-left: 20px;
}

.product-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.product-quantity,
.product-price {
    margin-bottom: 5px;
}

/* Tổng tiền */
.total-amount {
    font-size: 1.25rem;
    color: #28a745;
    text-align: right;
}

/* Modal đánh giá sản phẩm */
.review-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.modal-textarea {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 100px;
    resize: none;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

/* Star Rating CSS */
.star-rating {
    display: flex;
    gap: 5px;
    font-size: 2rem;
    color: #ccc;
}

.star-rating .star {
    cursor: pointer;
    transition: color 0.2s ease-in-out;
}

.star-rating .star.filled {
    color: gold;
}
</style>
