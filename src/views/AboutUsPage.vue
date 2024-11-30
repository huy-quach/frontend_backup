<template>
    <IdleLogout />
    <div class="about-page">
        <!-- Phần Giới thiệu chung -->
        <section class="intro-section">
            <div class="container">
                <h1>Giới thiệu chung về công ty LuxFur</h1>
                <p>
                    LuxiFur là thương hiệu nội thất hàng đầu, cung cấp các sản phẩm nội thất cao cấp và phong cách hiện
                    đại, giúp bạn biến không gian sống thành nơi phản ánh cá tính và sự tinh tế của bạn.
                </p>
                <img src="../assets/About/about_page.jpg" alt="LuxiFur Furniture" class="intro-image" />
            </div>
        </section>

        <!-- Phần Sứ mệnh và Giá trị cốt lõi -->
        <section class="mission-values-section">
            <div class="container">
                <h2>Sứ Mệnh Của Chúng Tôi</h2>
                <p>
                    Tại LuxiFur, sứ mệnh của chúng tôi là mang lại những sản phẩm nội thất bền vững và phong cách, đồng
                    thời cung cấp trải nghiệm khách hàng vượt trội với dịch vụ hỗ trợ toàn diện.
                </p>
                <h3>Giá Trị Cốt Lõi</h3>
                <ul class="core-values-list">
                    <li>Chất lượng: Sản phẩm của chúng tôi luôn đảm bảo chất lượng cao nhất.</li>
                    <li>Sự sáng tạo: Luôn đổi mới trong thiết kế và công nghệ sản xuất.</li>
                    <li>Bền vững: Hướng tới các giải pháp nội thất thân thiện với môi trường.</li>
                    <li>Khách hàng là trung tâm: Luôn lắng nghe và đặt khách hàng lên hàng đầu.</li>
                </ul>
            </div>
        </section>

        <!-- Phần Lịch sử phát triển -->
        <section class="history-section">
            <div class="container">
                <h2>Lịch Sử Phát Triển</h2>
                <div class="history-timeline">
                    <div class="history-event">
                        <h4>2010</h4>
                        <p>Thành lập với mong muốn mang lại sự khác biệt trong thiết kế nội thất.</p>
                    </div>
                    <div class="history-event">
                        <h4>2015</h4>
                        <p>Mở rộng thị trường ra quốc tế với sự thành công tại nhiều nước châu Âu.</p>
                    </div>
                    <div class="history-event">
                        <h4>2020</h4>
                        <p>Ra mắt dòng sản phẩm nội thất bền vững, hướng tới môi trường xanh.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Phần Đội ngũ -->
        <section class="team-section">
            <div class="container">
                <h2>Đội Ngũ Của Chúng Tôi</h2>
                <div class="team-members">
                    <div class="team-member">
                        <img src="../assets/About/avatar_icon1.jpg" alt="Team Member 1" class="team-member-image" />
                        <h4>Quách Huyền Huy</h4>
                        <p>Giám đốc điều hành</p>
                    </div>
                    <div class="team-member">
                        <img src="../assets/About/avatar_icon2.avif" alt="Team Member 2" class="team-member-image" />
                        <h4>Quách Huyền Trân</h4>
                        <p>Trưởng phòng thiết kế</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Phần Liên hệ -->
        <section class="contact-section">
            <div class="container">
                <h2>Liên Hệ Với Chúng Tôi</h2>
                <p>Nếu bạn có bất kỳ câu hỏi nào hoặc muốn biết thêm về sản phẩm, hãy liên hệ với chúng tôi qua:</p>
                <ul class="contact-info">
                    <li class="email">Email: huyquach@luxifur.com</li>
                    <li class="phone">Phone:: (+84) 335-854-405</li>
                    <li class="address">Address: Can Tho City</li>
                </ul>
            </div>
        </section>
    </div>
</template>
<script>
import IdleLogout from '@/components/IdleLogout.vue';
export default {
    components: {
        IdleLogout
    }
};
</script>
<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.about-page {
    font-family: 'Montserrat', sans-serif;
    color: #333;
    padding: 0;
    line-height: 1.6;
}

.container {
    width: 75%;
    margin: 0 auto;
}

h1,
h2,
h3 {
    text-align: center;
    margin-bottom: 2rem;
    font-weight: bold;
    color: #ff6600;
}

.intro-section {
    padding: 5rem 0;
    background-color: #f9f9f9;
    text-align: center;
}

.intro-image {
    width: 100%;
    max-width: 1200px;
    /* Tăng kích thước tối đa của hình ảnh */
    margin: 1.5rem auto;
    display: block;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
}

.intro-image:hover {
    transform: scale(1.05);
}

.mission-values-section,
.history-section,
.team-section,
.contact-section {
    padding: 4rem 0;
    /* Tăng không gian giữa các phần */
}

.core-values-list {
    list-style: none;
    padding: 0;
    font-size: 1.2rem;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.core-values-list li {
    position: relative;
    padding-left: 2.5rem;
    /* Tăng khoảng cách giữa dấu tích và nội dung */
    font-size: 1.1rem;
    line-height: 1.6;
}

.core-values-list li::before {
    content: "✔";
    position: absolute;
    left: 0;
    color: #28a745;
    font-size: 1.8rem;
    /* Tăng kích thước dấu tích */
    top: 0.1rem;
}

.history-timeline {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
}

.history-event {
    text-align: center;
    width: 30%;
    background-color: #ff6600;
    color: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

.history-event:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.team-section .team-members {
    display: flex;
    justify-content: space-around;
    margin-top: 2rem;
}

.team-member {
    text-align: center;
}

.team-member-image {
    border-radius: 50%;
    width: 180px;
    /* Tăng kích thước ảnh */
    height: 180px;
    object-fit: cover;
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.team-member-image:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.contact-section {
    background-color: #f9f9f9;
    padding: 3rem 0;
    text-align: center;
    /* Căn giữa nội dung */
    color: #333;
}

.contact-section h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #ff6600;
    margin-bottom: 2rem;
}

.contact-info {
    list-style: none;
    font-size: 1.2rem;
    line-height: 2rem;
    padding-left: 0;
}

.contact-info li {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    /* Căn giữa từng dòng */
    align-items: center;
}

.contact-info li i {
    margin-right: 10px;
    font-size: 1.5rem;
}

.contact-info li.email:before {
    content: url('https://img.icons8.com/ios-filled/24/000000/email-open.png');
}

.contact-info li.phone:before {
    content: url('https://img.icons8.com/ios-filled/24/000000/phone.png');
}

.contact-info li.address:before {
    content: url('https://img.icons8.com/ios-filled/24/000000/marker.png');
}
</style>