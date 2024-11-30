<template>
  <div id="app">
    <!-- Hiển thị Navbar và Footer nếu không phải là trang login, register, hoặc admin-board -->
    <Navbar v-if="!isAuthOrAdminBoardPage" />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Footer v-if="!isAuthOrAdminBoardPage" />
  </div>
</template>

<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  computed: {
    // Kiểm tra nếu route hiện tại là trang login, register, hoặc admin-board
    isAuthOrAdminBoardPage() {
      return (
        this.$route.path === 'Error404' ||
        this.$route.path === '/login' ||
        this.$route.path === '/register' ||
        this.$route.path.includes('/admin-board') || 
        this.$route.path.includes('/manage-orders') ||
        this.$route.path.includes('/manage-furniture') ||
        this.$route.path.includes('/manage-employee') ||
        this.$route.path.includes('/manage-blog') ||
        this.$route.path.includes('/manage-testimonials') ||
        this.$route.path.includes('/manage-carousel') ||
        this.$route.path.includes('/manage-inventory') ||
        this.$route.path.includes('manage-hidden-furniture') ||
        this.$route.path.includes('manage-delivery') ||
        this.$route.path.includes('reset-password') ||
        this.$route.path.includes('manage-banned-words') ||
        this.$route.path.includes('import-history')
      );
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Đảm bảo div#app chiếm toàn bộ chiều cao màn hình */
}

.app-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
