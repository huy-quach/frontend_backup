<template>
  <div class="contact-container">
    <IdleLogout />
    <h1>Liên hệ với LuxiFur</h1>
    <p>
      Chúng tôi sẵn sàng hỗ trợ bạn mọi lúc. Hãy gửi tin nhắn cho chúng tôi và
      chúng tôi sẽ liên hệ lại sớm nhất.
    </p>

    <div class="contact-content">
      <!-- Map Section -->
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.288516084612!2d105.76842631415533!3d10.029933875206638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08821d030a1e1%3A0x832a1d6e74629f4d!2sCan%20Tho%20University!5e0!3m2!1sen!2s!4v1633334375112!5m2!1sen!2s"
          width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>

      <!-- Contact Form Section -->
      <form @submit.prevent="submitContactForm" class="contact-form">
        <div class="form-group">
          <label for="name">Họ và Tên</label>
          <input type="text" v-model="name" id="name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>

        <div class="form-group">
          <label for="phone">Số điện thoại</label>
          <input type="text" v-model="phone" id="phone" />
        </div>

        <div class="form-group">
          <label for="message">Tin nhắn</label>
          <textarea v-model="message" id="message" rows="5" required></textarea>
        </div>

        <button type="submit" class="submit-btn">Gửi liên hệ</button>
      </form>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import IdleLogout from '@/components/IdleLogout.vue';
export default {
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      message: "",
      successMessage: "",
    };
  },
  components: {
    IdleLogout
  },
  methods: {
    async submitContactForm() {
      try {
        const response = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            phone: this.phone,
            message: this.message,
          }),
        });

        if (response.ok) {
          this.successMessage = "Tin nhắn của bạn đã được gửi thành công!";
          this.name = "";
          this.email = "";
          this.phone = "";
          this.message = "";
        } else {
          this.successMessage = "Đã xảy ra lỗi khi gửi tin nhắn.";
        }
      } catch (error) {
        console.error("Error:", error);
        this.successMessage = "Đã xảy ra lỗi khi gửi tin nhắn.";
      }
    },
  },
};
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

p {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.map-container {
  flex: 1;
  height: 400px;
  margin-right: 2rem;
}

.contact-form {
  flex: 1;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #ff8533;
}

.success-message {
  text-align: center;
  margin-top: 1.5rem;
  color: green;
}
</style>
