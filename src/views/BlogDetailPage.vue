<template>
    <div class="blog-detail-page">
        <div class="container" v-if="blog && blog.title">
            <h1 class="blog-title">{{ blog.title }}</h1>
            <div class="blog-image">
                <img v-if="blog.imageUrl" :src="'http://localhost:5000' + blog.imageUrl" alt="Blog Image" />
            </div>
            <div class="blog-content">
                <div v-html="formattedContent"></div>
            </div>
            <div class="blog-meta">
                <p><strong>Tác giả:</strong> {{ blog.author }}</p>
                <p><strong>Thể loại:</strong> {{ blog.category }}</p>
                <p><strong>Ngày xuất bản:</strong> {{ new Date(blog.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="blog-interactions">
                <button @click="likeBlog">👍 Yêu thích ({{ blog.likes }})</button>
                <button @click="voteUseful">✔️ Hữu ích ({{ blog.usefulVotes }})</button>
                <button @click="voteNotUseful">❌ Không hữu ích ({{ blog.notUsefulVotes }})</button>
            </div>
            <!-- Display the message below the buttons -->
            <p class="vote-message" v-if="voteMessage">{{ voteMessage }}</p>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            blog: {},
            voteMessage: "", // New state to hold the vote message
        };
    },
    computed: {
        formattedContent() {
            return this.blog.content ? this.blog.content.replace(/\n/g, '<br>') : '';
        },
    },
    created() {
        const blogId = this.$route.params.id;
        this.fetchBlog(blogId);
    },
    methods: {
        async fetchBlog(blogId) {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                this.blog = data;
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        },
        async likeBlog() {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${this.blog._id}/like`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    this.blog = data.blog;
                    this.voteMessage = "Bạn đã thích tin tức này";
                } else {
                    this.voteMessage = data.message || "Lỗi khi thích";
                }
            } catch (error) {
                this.voteMessage = "Lỗi khi thích";
            }
        },
        async voteUseful() {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${this.blog._id}/vote-useful`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    this.blog = data.blog;
                    this.voteMessage = "Bạn đã thích bài viết hữu ích này";
                } else {
                    this.voteMessage = data.message || "Lỗi khi thích";
                }
            } catch (error) {
                this.voteMessage = "Lỗi khi thích";
            }
        },
        async voteNotUseful() {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${this.blog._id}/vote-not-useful`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    this.blog = data.blog;
                    this.voteMessage = "Bạn đã không thấy bài viết hữu ích này!";
                } else {
                    this.voteMessage = data.message || "Lỗi khi thích";
                }
            } catch (error) {
                this.voteMessage = "Lỗi khi thích";
            }
        },
    },
};
</script>

<style scoped>
.vote-message {
    margin-top: 13px;
    color: red;
    font-weight: bold;
    font-size: 13px;
}
/* Container Styles */
.blog-detail-page {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    /* Thay đổi màu nền */
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background-color: white;
    padding: 30px;
    /* Tăng padding cho thoáng hơn */
    border-radius: 12px;
    /* Làm tròn các góc hơn */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Title Styles */
.blog-title {
    font-size: 36px;
    /* Tăng kích thước tiêu đề */
    font-weight: bold;
    margin-bottom: 20px;
    color: #2c3e50;
    /* Sử dụng màu tối hơn */
}

/* Blog Image Styles */
.blog-image {
    text-align: center;
    margin-bottom: 20px;
}

.blog-image img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    /* Làm tròn các góc hình ảnh */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Blog Content Styles */
.blog-content {
    font-size: 18px;
    line-height: 1.8;
    /* Tăng khoảng cách giữa các dòng */
    color: #34495e;
    /* Sử dụng màu tối hơn */
    margin-bottom: 30px;
}

/* Blog Meta Info Styles */
.blog-meta {
    font-size: 16px;
    color: #7f8c8d;
    /* Sử dụng màu nhạt hơn */
    margin-top: 20px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

.blog-meta p {
    margin-bottom: 5px;
}

.blog-meta strong {
    color: #2c3e50;
    /* Màu cho các tiêu đề mạnh mẽ hơn */
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 20px;
        /* Giảm padding cho thiết bị nhỏ hơn */
    }

    .blog-title {
        font-size: 30px;
        /* Giảm kích thước tiêu đề cho nhỏ hơn */
    }

    .blog-content {
        font-size: 16px;
    }

    .blog-meta {
        font-size: 14px;
    }
}

.blog-interactions {
    margin-top: 30px;
    /* Tăng khoảng cách trên */
}

.blog-interactions button {
    margin-right: 15px;
    /* Điều chỉnh khoảng cách giữa các nút */
    padding: 12px 18px;
    /* Thay đổi padding cho nút lớn hơn */
    font-size: 16px;
    /* Tăng kích thước văn bản */
    border: none;
    background-color: #3498db;
    /* Màu nền nút */
    color: white;
    border-radius: 6px;
    /* Làm tròn các góc của nút */
    cursor: pointer;
    transition: background-color 0.3s ease;
    /* Hiệu ứng chuyển động cho nút */
}

.blog-interactions button:hover {
    background-color: #2980b9;
    /* Màu nền khi hover */
}
</style>