<template>
    <div class="blog-page">
        <IdleLogout />
        <div class="container">
            <div class="main-content">
                <h1>Những thông tin mới nhất</h1>

                <!-- Existing Blogs -->
                <div v-if="blogsOnPage.length">
                    <div v-for="blog in blogsOnPage" :key="blog._id" class="blog-post">
                        <div class="post-thumbnail">
                            <img v-if="blog.imageUrl" :src="'http://localhost:5000' + blog.imageUrl" alt="Blog Image" />
                        </div>
                        <div class="post-content">
                            <h2>{{ blog.title }}</h2>
                            <p class="meta">
                                <span class="date">{{ new Date(blog.createdAt).toLocaleDateString() }}</span>
                                <span class="author"> by {{ blog.author }}</span>
                            </p>
                            <p>{{ truncateContent(blog.content) }}</p>
                            <router-link :to="`/blog/${blog._id}`">
                                <button class="read-more-btn">Xem thêm</button>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>No blogs found.</p>
                </div>

                <!-- Pagination for main blogs -->
                <div class="pagination">
                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                        :class="{ active: currentPage === page }">
                        {{ page }}
                    </button>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="sidebar">
                <!-- What's Hot -->
                <div class="widget">
                    <h3>Mới nhất</h3>
                    <ul class="hot-posts">
                        <li v-for="blog in hotBlogs" :key="blog._id" class="hot-post">
                            <router-link :to="`/blog/${blog._id}`" class="hot-post-link">
                                <img v-if="blog.imageUrl" :src="'http://localhost:5000' + blog.imageUrl"
                                    alt="Blog Image" />
                                <p>{{ blog.title }}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Most Popular Categories -->
                <div class="widget">
                    <h3>Danh mục phổ biến</h3>
                    <ul class="categories">
                        <li @click="filterBlogs('Business')">Kinh doanh</li>
                        <li @click="filterBlogs('Sport')">Thể thao</li>
                        <li @click="filterBlogs('Game')">Giải trí</li>
                        <li @click="filterBlogs('Life')">Cuộc sống</li>
                        <li @click="filterBlogs('')">Tất cả</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IdleLogout from '@/components/IdleLogout.vue';
export default {
    data() {
        return {
            blogs: [],          // Dữ liệu blog đầy đủ
            blogsOnPage: [],    // Blog hiển thị trên trang hiện tại
            currentPage: 1,     // Trang hiện tại
            blogsPerPage: 5,    // Số blog hiển thị trên mỗi trang

            // Dữ liệu cho "What's Hot"
            hotBlogs: [],       // Blog nóng, hiển thị phần "What's Hot"
        };
    },
    components: {
        IdleLogout
    },
    computed: {
        // Tính tổng số trang cho blog chính
        totalPages() {
            return Math.ceil(this.blogs.length / this.blogsPerPage);
        },
    },
    created() {
        this.fetchBlogs();
    },
    methods: {
        // Fetch all blogs
        async fetchBlogs(category = '') {
            try {
                let url = 'http://localhost:5000/api/blogs';
                if (category) {
                    url += `?category=${category}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                this.blogs = data;

                // Sắp xếp blog theo thứ tự thời gian mới nhất
                this.hotBlogs = data.slice(0, 3); // Hiển thị 3 blog mới nhất trong "What's Hot"
                this.paginateBlogs();
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        },

        // Giới hạn nội dung hiển thị
        truncateContent(content) {
            const maxLength = 200; // Giới hạn số ký tự
            return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
        },

        // Chuyển đến trang mới (phần blog chính)
        goToPage(page) {
            this.currentPage = page;
            this.paginateBlogs();
        },

        // Phân trang blog chính
        paginateBlogs() {
            const start = (this.currentPage - 1) * this.blogsPerPage;
            const end = start + this.blogsPerPage;
            this.blogsOnPage = this.blogs.slice(start, end);
        },

        // Lọc blog theo danh mục và reset lại trang
        filterBlogs(category) {
            this.fetchBlogs(category);
            this.currentPage = 1;
        },
    },
};
</script>

<style scoped>
/* Các CSS khác */
.blog-page {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f4f4f4;
}

.container {
    display: flex;
    gap: 20px;
}

.main-content {
    flex: 3;
}

h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.blog-post {
    background-color: white;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.post-thumbnail img {
    width: 150px;
    height: auto;
    border-radius: 4px;
}

.post-content {
    flex: 1;
}

.post-content h2 {
    font-size: 20px;
    color: #333;
}

.post-content .meta {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
}

.post-content p {
    font-size: 16px;
    color: #555;
}

.read-more-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
}

.read-more-btn:hover {
    background-color: #0056b3;
}

.pagination {
    margin-top: 20px;
}

.pagination button {
    background-color: #f4f4f4;
    color: #333;
    border: 1px solid #ddd;
    padding: 10px 15px;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 4px;
}

.pagination button.active {
    background-color: #007bff;
    color: white;
}

.pagination button:hover {
    background-color: #0056b3;
    color: white;
}

.sidebar {
    flex: 1;
}

.widget {
    background-color: white;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.widget h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
}

/* What's Hot */
.hot-posts {
    list-style-type: none;
    padding: 0;
}

.hot-post {
    margin-bottom: 10px;
}

.hot-post img {
    width: 100px;
    height: auto;
    margin-right: 10px;
}

.hot-post-link {
    text-decoration: none;
    /* Loại bỏ gạch chân */
}

.hot-post-link:hover p {
    text-decoration: underline;
    /* Thêm gạch chân khi hover */
}

.hot-post-link p {
    font-size: 14px;
    color: #333;
    margin: 0;
}

.categories {
    list-style-type: none;
    padding: 0;
}

.categories li {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
    cursor: pointer;
}

.categories li:hover {
    color: #007bff;
}
</style>
