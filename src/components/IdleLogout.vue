<!-- components/IdleLogout.vue -->
<template>
    <div></div> <!-- Component này không cần hiển thị nội dung -->
</template>

<script>
export default {
    data() {
        return {
            idleTimeout: null,
            idleTimeLimit: 10 * 60 * 1000, // 10 phút
        };
    },
    methods: {
        resetIdleTimer() {
            // Xóa bộ đếm thời gian hiện tại nếu có
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
            }

            // Thiết lập lại bộ đếm thời gian
            this.idleTimeout = setTimeout(() => {
                // Gọi hàm logout sau khi hết thời gian
                this.logoutUser();
            }, this.idleTimeLimit);
        },
        logoutUser() {
            // Chỉ thực hiện logout nếu người dùng đã đăng nhập
            if (this.$store.getters.isAuthenticated) {
                this.$store.dispatch('logout'); // Gọi Vuex action để logout
                this.$router.push('/login'); // Chuyển hướng đến trang đăng nhập
            }
        }
    },
    mounted() {
        // Lắng nghe các sự kiện tương tác
        window.addEventListener('mousemove', this.resetIdleTimer);
        window.addEventListener('scroll', this.resetIdleTimer);
        window.addEventListener('keydown', this.resetIdleTimer);

        // Thiết lập bộ đếm thời gian lần đầu khi người dùng truy cập trang
        this.resetIdleTimer();
    },
    beforeUnmount() {
        // Gỡ bỏ các event listener khi component bị hủy
        window.removeEventListener('mousemove', this.resetIdleTimer);
        window.removeEventListener('scroll', this.resetIdleTimer);
        window.removeEventListener('keydown', this.resetIdleTimer);

        // Xóa bộ đếm thời gian khi component bị hủy
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
        }
    }
};
</script>
