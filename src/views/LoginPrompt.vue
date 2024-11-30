<!-- components/LoginPrompt.vue -->
<template>
  <div class="modal-backdrop" v-if="show">
    <div class="modal-content">
      <h3>Thông báo</h3>
      <p>Bạn cần phải đăng nhập để mua sản phẩm!</p>
      <div class="modal-actions">
        <button @click="goToLogin">Đăng nhập</button>
        <button @click="closeModal">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close'); // Gửi sự kiện đóng modal
    },
    goToLogin() {
      this.$emit('close'); // Đóng modal và chuyển hướng
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
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

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px;
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:first-child {
  background-color: #4caf50;
  color: white;
}

button:last-child {
  background-color: #f44336;
  color: white;
}
</style>
