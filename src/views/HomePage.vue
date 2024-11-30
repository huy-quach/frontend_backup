<template>
  <div class="homepage-container">
    <IdleLogout />
    <!-- Hero Carousel -->
    <section class="custom-carousel">
      <div id="customCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-inner">
          <div v-for="(slide, index) in carousels" :key="slide._id" :class="['carousel-item', { active: index === 0 }]">
            <div class="carousel-overlay">
              <div class="carousel-content">
                <h1 class="carousel-title">{{ slide.title }}</h1>
                <p class="carousel-text">{{ slide.content }}</p>
              </div>
            </div>
            <img :src="`http://localhost:5000/uploads/${slide.image}`" class="d-block w-100 carousel-image"
              alt="Carousel Image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bộ sưu tập nội thất với slider -->
    <section class="furniture-section">
      <h2 class="section-title">Các sản phẩm nổi bật</h2>

      <!-- Sử dụng slider cho sản phẩm -->
      <div class="carousel">
        <button class="carousel-control prev" @click="prevSlide">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="carousel-track-container">
          <ul class="carousel-track">
            <li v-for="item in visibleFurniture" :key="item._id" class="furniture-card">
              <!-- Thêm sự kiện @click trên hình ảnh -->
              <img :src="`http://localhost:5000/uploads/${item.image}`" alt="Furniture Image" class="furniture-image"
                @click="goToProductDetail(item._id)" />
              <h3 class="furniture-name">{{ item.name }}</h3>
              <p class="furniture-description" title="item.description">{{ item.description }}</p>
              <p class="furniture-price">Giá: {{ formatCurrencyVND(item.salePrice) }}</p>
              <p class="furniture-stock" v-if="item.inStock">Còn hàng</p>
              <p class="furniture-out-of-stock" v-else>Hết hàng</p>
              <router-link :to="{ name: 'ProductPage' }" class="detail-button">Xem thêm</router-link>
            </li>
          </ul>
        </div>
        <button class="carousel-control next" @click="nextSlide">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
    <!-- Phần giới thiệu về thương hiệu -->
    <section class="about-us-section">
      <div class="about-us-container">
        <h2>Giới thiệu về LuxiFur</h2>
        <p>
          LuxiFur là thương hiệu nội thất hàng đầu, mang đến cho bạn những sản phẩm tinh tế, sang trọng và hiện đại. Với
          hơn 10 năm kinh nghiệm trong lĩnh vực sản xuất và kinh doanh nội thất, chúng tôi tự hào cung cấp các sản phẩm
          chất lượng cao được thiết kế để biến ngôi nhà của bạn thành một không gian sống tuyệt vời.
        </p>
        <p>
          Chúng tôi cam kết không chỉ mang đến những sản phẩm bền đẹp mà còn cung cấp dịch vụ chăm sóc khách hàng tận
          tâm. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn, hỗ trợ bạn trong việc lựa chọn và trang trí nội
          thất, giúp bạn biến mọi ý tưởng thành hiện thực.
        </p>
        <p>
          Tại LuxiFur, chúng tôi tin rằng mỗi sản phẩm đều kể một câu chuyện và phản ánh phong cách sống của bạn. Hãy
          cùng chúng tôi xây dựng không gian sống đẳng cấp và cá nhân hóa với bộ sưu tập nội thất độc đáo của chúng tôi.
        </p>
        <a href="/about" class="btn btn-primary">Xem thêm</a>
      </div>
    </section>

    <!-- Phần nội dung mới -->
    <section class="info-section">
      <div class="info-container">
        <div class="info-image">
          <img src="@/assets/logo.png" alt="Info Image" />
        </div>
        <div class="info-content">
          <h2>Xây dựng, bán và phát triển</h2>
          <div class="info-features">
            <div class="info-item">
              <i class="fas fa-book"></i>
              <h3>Tài nguyên miễn phí</h3>
              <p>Tìm câu trả lời cho các câu hỏi thường gặp và đọc hướng dẫn sử dụng trong Trung tâm trợ giúp.</p>
            </div>
            <div class="info-item">
              <i class="fas fa-pencil-ruler"></i>
              <h3>Thiết kế trực quan</h3>
              <p>Chọn từ hơn 70 chủ đề có thể tùy chỉnh để tạo ra một cửa hàng nổi bật.</p>
            </div>
            <div class="info-item">
              <i class="fas fa-chart-line"></i>
              <h3>Thông tin chi tiết thông minh</h3>
              <p>Xem xu hướng bán hàng với các báo cáo sản phẩm được thiết kế riêng và phân tích dữ liệu của bạn để tạo
                các chiến dịch hấp dẫn.
              </p>
            </div>
            <div class="info-item">
              <i class="fas fa-headset"></i>
              <h3>Hỗ trợ tận tình</h3>
              <p>Liên hệ bất cứ lúc nào với bất kỳ thách thức nào mà doanh nghiệp nội thất của bạn phải đối mặt. Nhận hỗ
                trợ 24/7.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Accordion Section - Learn more about selling furniture -->
    <section class="accordion-section">
      <h2>Tìm hiểu thêm về việc bán đồ nội thất</h2>
      <div class="accordion">
        <div v-for="(item, index) in questions" :key="index" class="accordion-item" :class="{ open: item.open }">
          <div class="accordion-header" @click="toggleItem(index)">
            <h3>{{ item.question }}</h3>
            <i :class="item.open ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
          <div v-if="item.open" class="accordion-content">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="services-section">
      <div class="service">
        <i class="fas fa-dolly"></i>
        <h3>Giao Hàng & Lắp Đặt</h3>
        <p>Miễn Phí</p>
      </div>
      <div class="service">
        <i class="fas fa-sync-alt"></i>
        <h3>Đổi Trả 1 - 1</h3>
        <p>Miễn Phí</p>
      </div>
      <div class="service">
        <i class="fas fa-shield-alt"></i>
        <h3>Bảo Hành 2 Năm</h3>
        <p>Miễn Phí</p>
      </div>
      <div class="service">
        <i class="fas fa-headset"></i>
        <h3>Tư Vấn Thiết Kế</h3>
        <p>Miễn Phí</p>
      </div>
    </section>
    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2>Khách hàng đã nói gì</h2>
      <div class="testimonials-container">
        <div v-for="(testimonial) in testimonials" :key="testimonial._id" class="testimonial-card">
          <!-- Hiển thị hình ảnh đầu tiên -->
          <img :src="`http://localhost:5000/uploads/${testimonial.images[0]}`" alt="Customer Image"
            class="testimonial-image" @click="openImageViewer(testimonial.images, 0)" />
          <h4 class="testimonial-name">{{ testimonial.userId.name }}</h4>
          <div class="testimonial-stars">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= testimonial.rating }">&#9733;</span>
          </div>
          <p class="testimonial-message">{{ testimonial.comment }}</p>
        </div>
      </div>

      <!-- Modal hiển thị hình ảnh -->
      <div v-if="showImageViewer" class="image-viewer-modal">
        <div class="modal-overlay" @click="closeImageViewer"></div>
        <div class="modal-content">
          <button class="close-button" @click="closeImageViewer">&times;</button>
          <img :src="`http://localhost:5000/uploads/${currentImage}`" alt="Large Image" class="large-image" />
          <div class="modal-navigation">
            <button class="prev-button" @click="prevImage" v-if="canPrevImage">❮</button>
            <button class="next-button" @click="nextImage" v-if="canNextImage">❯</button>
          </div>
        </div>
      </div>
    </section>

    <div class="image-viewer-modal" v-if="showImageViewer">
      <div class="modal-overlay" @click="closeImageViewer"></div>
      <div class="modal-content">
        <button class="close-button" @click="closeImageViewer">&times;</button>
        <img :src="`http://localhost:5000/uploads/${currentImage}`" alt="Large Image" class="large-image" />
        <div class="modal-navigation">
          <button class="prev-button" @click="prevImage" v-if="canPrevImage">❮</button>
          <button class="next-button" @click="nextImage" v-if="canNextImage">❯</button>
        </div>
      </div>
    </div>



  </div>
  <df-messenger intent="WELCOME" chat-title="Chatbot_Website_Furniture" agent-id="ae895758-1d47-4420-8599-419b9288537a"
    language-code="vi">
  </df-messenger>

  <a href="https://m.me/472381645962423" target="_blank" class="messenger-button">
    <img src="../assets/logo/messenger.jpg" alt="Messenger" />
  </a>






</template>

<script>
import IdleLogout from '@/components/IdleLogout.vue';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      carousels: [], // Lưu trữ dữ liệu carousel từ API
      showImageViewer: false, // Kiểm soát hiển thị modal
      currentImage: null, // Hình ảnh hiện tại trong modal
      currentImageIndex: 0, // Chỉ mục hình ảnh hiện tại
      currentImageList: [],
      currentIndex: 0, // Vị trí hiện tại của slider
      itemsPerPage: 3, // Số sản phẩm hiển thị
      testimonials: [],
      questions: [
        {
          question: "Tôi có thể bán đồ nội thất trực tuyến ở đâu?",
          answer: "Bạn có thể bán đồ nội thất trực tuyến từ cửa hàng của riêng mình được xây dựng trên nền tảng như Shopify, trên các thị trường của bên thứ ba như Amazon và eBay, trên các trang web chuyên biệt như ArtDeco và 1dibs, trên mạng xã hội và thông qua hình thức bán buôn.",
          open: false
        },
        {
          question: "Tôi có thể bán đồ nội thất trên Shopify không?",
          answer: "Có, bạn có thể bán đồ nội thất trên Shopify. Onske là một ví dụ về một thương gia Shopify bán đồ nội thất.",
          open: false
        },
        {
          question: "Loại đồ nội thất nào bán chạy nhất?",
          answer: "Ghế ăn/bếp, Ghế văn phòng và đồ nội thất văn phòng tại nhà khác, Đồ nội thất cổ và tân cổ điển, Bàn đầu giường/bàn cạnh.",
          open: false
        },
        {
          question: "Tôi định giá đồ nội thất như thế nào?",
          answer: "Để định giá đồ nội thất, hãy cộng tất cả các chi phí liên quan đến việc đưa sản phẩm của bạn ra thị trường, đặt biên lợi nhuận của bạn lên trên các chi phí đó và niêm yết giá của bạn. Bạn có thể thay đổi giá theo thời gian để tăng doanh số hoặc biên lợi nhuận.",
          open: false
        }
      ]
    };
  },
  components: {
    IdleLogout
  },
  computed: {
    ...mapState(['furniture']),
    canPrevImage() {
      return this.currentImageIndex > 0;
    },
    canNextImage() {
      return this.currentImageIndex < this.currentImageList.length - 1;
    },
  visibleFurniture() {
    if (!this.furniture || !Array.isArray(this.furniture)) {
      return []; // Trả về mảng rỗng nếu furniture chưa được tải
    }
    const start = this.currentIndex;
    const end = start + this.itemsPerPage;

    return this.furniture.slice(start, end).map((item) => ({
      ...item,
      name: item.name || "Không rõ tên",
      description: item.description || "Không có mô tả",
      image: item.image || "placeholder.jpg",
      salePrice: item.salePrice || 0,
      inStock: item.totalStock > 0,
    }));
  },
  },
  methods: {
    // Mở modal xem ảnh
    openImageViewer(images, index) {
      this.currentImageList = images;
      this.currentImageIndex = index;
      this.currentImage = images[index];
      this.showImageViewer = true;
    },
    // Đóng modal
    closeImageViewer() {
      this.showImageViewer = false;
      this.currentImage = null;
      this.currentImageIndex = 0;
      this.currentImageList = [];
    },
    openImageModal(images) {
      this.currentImages = images;
      this.currentIndex = 0; // Bắt đầu với ảnh đầu tiên
      this.isModalOpen = true;
    },
    nextImage() {
      if (this.canNextImage) {
        this.currentImageIndex++;
        this.currentImage = this.currentImageList[this.currentImageIndex];
      }
    },
    // Ảnh trước đó
    prevImage() {
      if (this.canPrevImage) {
        this.currentImageIndex--;
        this.currentImage = this.currentImageList[this.currentImageIndex];
      }
    },
    formatCurrencyVND(amount) {
      if (typeof amount !== "number" || isNaN(amount)) {
        return "Chưa có thông tin";
      }
      return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    },
    goToProductDetail(productId) {
      // Điều hướng đến ProductDetailPage với ID sản phẩm
      this.$router.push({ name: "ProductDetail", params: { id: productId } });
    },
    async fetchCarousels() {
      try {
        const response = await fetch('http://localhost:5000/api/carousels');
        this.carousels = await response.json();
      } catch (error) {
        console.error('Error fetching carousels:', error);
      }
    },
    nextSlide() {
      if (this.currentIndex + this.itemsPerPage < this.furniture.length) {
        this.currentIndex += this.itemsPerPage;
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex -= this.itemsPerPage;
      }
    },
    toggleItem(index) {
      this.questions[index].open = !this.questions[index].open; // Đảo ngược trạng thái của open
    },
    async fetchTestimonials() {
      try {
        const response = await fetch("http://localhost:5000/api/reviews/testimonials");
        this.testimonials = await response.json();
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    },

  },
  created() {
    this.fetchTestimonials();
    this.fetchCarousels();
    this.$store.dispatch("fetchFurniture");
  },
};
</script>

<style scoped>
.modal-image {
  width: 80%;
  /* 80% chiều rộng của container cha */
  max-width: 500px;
  /* Giới hạn tối đa chiều rộng */
  height: auto;
  /* Tự động điều chỉnh chiều cao để giữ tỷ lệ */
  object-fit: cover;
}

.image-viewer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
}

.modal-content {
  position: relative;
  max-width: 70%;
  max-height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.large-image {
  width: 80vw;
  /* Chiều rộng chiếm 80% chiều rộng cửa sổ */
  height: 80vh;
  /* Chiều cao chiếm 80% chiều cao cửa sổ */
  max-width: 1200px;
  /* Giới hạn chiều rộng tối đa */
  max-height: 800px;
  /* Giới hạn chiều cao tối đa */
  object-fit: contain;
  /* Đảm bảo toàn bộ hình ảnh được hiển thị mà không bị cắt */
  border-radius: 8px;
  /* Bo góc */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  /* Hiệu ứng bóng */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
}

.modal-navigation {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateY(-50%);
  /* Căn giữa theo chiều dọc */
}

.prev-button,
.next-button {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute;
  /* Để định vị chính xác */
  top: 50%;
  /* Căn giữa theo chiều dọc */
  transform: translateY(-50%);
  /* Căn chỉnh nút giữa chiều dọc */
}

.prev-button:hover,
.next-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.prev-button {
  left: 0;
  /* Canh trái */
}

.next-button {
  right: 0;
  /* Canh phải */
}

.messenger-button {
  position: fixed;
  bottom: 80px;
  /* Cách đáy một khoảng */
  right: 24px;
  /* Cách phải một khoảng */
  z-index: 1000;
  width: 50px;
  /* Đặt chiều rộng cụ thể */
  height: 50px;
  /* Đặt chiều cao cụ thể */
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  /* Bo tròn nút */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.messenger-button:hover {
  transform: scale(1.1);
  /* Hiệu ứng phóng to khi hover */
}

.messenger-button img {
  width: 100%;
  /* Co giãn theo kích thước của nút */
  height: auto;
  /* Tự động giữ tỉ lệ */
  border-radius: 50%;
  /* Bo tròn hình ảnh */
}

df-messenger {
  --df-messenger-bot-message: #0084ff;
  --df-messenger-button-titlebar-color: #0084ff;
  --df-messenger-font-color: white;
  position: fixed !important;
  bottom: 24px !important;
  /* Cách cạnh dưới */
  right: 24px !important;
  /* Cách cạnh phải */
  z-index: 999;
  /* Đảm bảo luôn nổi lên trên */
}

.fb-customerchat {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 999 !important;
}

.furniture-image {
  cursor: pointer;
  /* Con trỏ chuột sẽ thành hình bàn tay */
  transition: transform 0.3s ease;
  /* Hiệu ứng khi hover */
}

.custom-carousel {
  position: relative;
  width: 100vw;
  height: 100vh;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  margin-top: -48px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(80%);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.carousel-content {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
  color: white;
}

.carousel-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.carousel-text {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .custom-carousel {
    height: 50vh;
  }

  .carousel-title {
    font-size: 2rem;
  }

  .carousel-text {
    font-size: 1.2rem;
  }

  .carousel-image {
    height: 50vh;
  }
}

/* Tổng thể trang Home */
.homepage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
}

/* Phần giới thiệu - Hero Section */
.hero-section {
  width: 100%;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  color: white;
  text-align: center;
  margin-bottom: 4rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: white;
  color: #ff6600;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #f1f1f1;
}

/* Phần bộ sưu tập nội thất */
.furniture-section {
  width: 100%;
  padding: 2rem 0;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

/* Carousel container */
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem 0;
}

.carousel-track-container {
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
}

.carousel-track {
  display: flex;
  list-style: none;
  padding: 0;
  transition: transform 0.5s ease-in-out;
}

.furniture-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 0 1rem;
  flex: 1 0 300px;
}

.furniture-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.furniture-name {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.furniture-description {
  max-width: 250px;
  font-size: 1rem;
  color: #777;
  margin: 0 auto 1rem auto;
  text-align: center;
  /* Canh giữa văn bản */
  display: -webkit-box;
  /* Sử dụng Webkit Box Model */
  -webkit-line-clamp: 2;
  /* Hiển thị tối đa 2 dòng */
  -webkit-box-orient: vertical;
  overflow: hidden;
}



.furniture-price {
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 1rem;
}

.furniture-stock {
  color: green;
  font-weight: bold;
}

.furniture-out-of-stock {
  color: red;
  font-weight: bold;
}

.furniture-image {
  width: 100%;
  height: auto;
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .furniture-card {
    margin-bottom: 20px;
    flex: 1 0 100%;
  }
}

/* Nút Chi Tiết */
.detail-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #ff6600;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.detail-button:hover {
  background-color: #ff8533;
}

/* Các nút điều hướng */
.carousel-control {
  background-color: #ff6600;
  color: white;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.carousel-control.prev {
  left: -10px;
}

.carousel-control.next {
  right: -10px;
}

.carousel-control:hover {
  background-color: #ff8533;
}

.carousel-control i {
  font-size: 1.5rem;
}

/* Phần nội dung mới */
.info-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 4rem 2rem;
  background-color: #f4f4f4;
}

.info-container {
  display: flex;
  gap: 4rem;
  align-items: center;
}

.info-image img {
  max-width: 300px;
  border-radius: 8px;
}

.info-content {
  flex: 1;
  margin-left: 2rem;
}

.info-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-item i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.info-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.info-item p {
  font-size: 1rem;
  color: #666;
}

.accordion-section {
  width: 100%;
  padding: 2rem 1rem;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.accordion-section h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
}

.accordion {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accordion-item {
  width: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.accordion-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.accordion-header {
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
}

.accordion-content {
  padding: 1.5rem;
  background-color: #fafafa;
  transition: opacity 0.3s ease;
}

.accordion i {
  transition: transform 0.3s ease;
}

.accordion-header .fa-chevron-down {
  transform: rotate(0deg);
}

.accordion-header .fa-chevron-up {
  transform: rotate(180deg);
}

.accordion-item.open .accordion-content {
  display: block;
}

/* Phần dịch vụ */
.services-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 5rem;
  background-color: #f9f9f9;
  margin-top: 3rem;
}

.service {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  width: 25%;
  height: 320px;
  margin-right: 1rem;
}

.service:last-child {
  margin-right: 0;
}

.service i {
  font-size: 3.5rem;
  color: #ff6600;
  margin-bottom: 1rem;
}

.service h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #333;
  white-space: nowrap;
}

.service p {
  font-size: 1.2rem;
  color: #777;
}

/* Điều chỉnh cho responsive */
@media (max-width: 768px) {
  .services-section {
    flex-direction: column;
    padding: 1rem;
  }

  .service {
    margin-bottom: 1rem;
    width: 100%;
    white-space: normal;
  }
}

.about-us-section {
  padding: 3rem 5%;
  background-color: #f9f9f9;
  text-align: center;
}

.about-us-container {
  max-width: 1000px;
  margin: 0 auto;
}

.about-us-section h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.about-us-section p {
  font-size: 1.2rem;
  color: #555;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.about-us-section .btn {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 1.1rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.about-us-section .btn:hover {
  background-color: #0056b3;
}

.testimonials-section {
  padding: 3rem 1rem;
  background-color: #f9f9f9;
  text-align: center;
}

.testimonials-section h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.testimonials-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  flex: 1 1 calc(33.33% - 2rem);
  max-width: 30%;
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.testimonial-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.testimonial-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.testimonial-stars {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.testimonial-stars .star {
  font-size: 1.5rem;
  color: #ccc;
}

.testimonial-stars .star.filled {
  color: gold;
}

.testimonial-message {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .testimonial-card {
    flex: 1 1 calc(50% - 1rem);
    max-width: 48%;
  }
}

@media (max-width: 480px) {
  .testimonial-card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>