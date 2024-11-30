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
                    <router-link to="/manage-employee" class="nav-link active">
                        <i class="fas fa-user-tie"></i>
                        Quản lý nhân viên
                    </router-link>
                </li>
                <li v-if="isAdmin">
                    <router-link to="/manage-testimonials" class="nav-link">
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



          <!-- Nội dung chính -->
  <div class="main-content">
    <header class="admin-header">
      <h1>Quản lý nhân viên</h1>
      <button @click="showModal = true" class="add-employee-button">
        Thêm nhân viên mới
      </button>
    </header>

    <!-- Bảng danh sách nhân viên -->
    <div class="table-responsive">
      <table class="employee-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Phân quyền</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employees" :key="employee._id">
            <td>{{ index + 1 }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.role }}</td>
            <td>
              <div class="action-buttons">
                <button
                  @click="deleteEmployee(employee._id)"
                  class="delete-button"
                >
                  <i class="fas fa-trash-alt"></i> Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

        <!-- Modal để nhập thông tin nhân viên -->
  <div v-if="showModal" class="modal-backdrop">
    <div class="custom-modal">
      <div class="modal-content">
        <h2 class="text-center">Thêm nhân viên mới</h2>
        <form @submit.prevent="addEmployee">
          <div class="form-group">
            <label for="name">Tên: </label>
            <input v-model="newEmployee.name" type="text" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="email">Email: </label>
            <input v-model="newEmployee.email" type="email" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="password">Mật khẩu: </label>
            <input v-model="newEmployee.password" type="password" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="role">Phân quyền: </label>
            <select v-model="newEmployee.role" class="input-field">
              <option value="employee">Employee</option>
              <option value="shipper">Shipper</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="submit" class="submit-button">Xác nhận</button>
            <button type="button" @click="showModal = false" class="cancel-button">Đóng</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      employees: [],
      showModal: false,
      newEmployee: {
        name: "",
        email: "",
        password: "",
        role: "employee", // Mặc định là employee
      },
    };
  },
  computed: {
    ...mapState(["user"]), // Lấy thông tin user từ Vuex store

    isAdmin() {
      return this.user && this.user.role === "admin";
    },
    isAdminOrEmployee() {
      return this.user && (this.user.role === "admin" || this.user.role === "employee");
    },
  },
  created() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:5000/api/users/employees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.employees = response.data;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    async addEmployee() {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/add-employee",
          this.newEmployee,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        this.employees.push(response.data);
        this.showModal = false;
        this.resetForm();
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    },
    resetForm() {
      this.newEmployee = { name: "", email: "", password: "", role: "employee" };
    },
    async deleteEmployee(employeeId) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${employeeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.employees = this.employees.filter((emp) => emp._id !== employeeId);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    },
  },
};
</script>

<style scoped>
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

.add-employee-button {
    background-color: #007bff;
    color: white;
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
}

.add-employee-button:hover {
    background-color: #0056b3;
}

/* Table */
.employee-table {
    width: 100%;
    border-collapse: collapse;
}

.employee-table th,
.employee-table td {
    padding: 1rem;
    text-align: center;
    border: 1px solid #dee2e6;
    /* Thêm viền cho các ô */
}

.employee-table th {
    background-color: white;
    /* Bỏ màu xanh dương */
    color: black;
    /* Đổi màu chữ thành đen */
    font-weight: bold;
    /* Giữ chữ đậm cho tiêu đề */
}

.employee-table td {
    background-color: white;
}

/* Action buttons */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.delete-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
}

/* Modal */
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

.custom-modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 450px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.input-field {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    margin-bottom: 1rem;
}

.submit-button {
    background-color: #28a745;
    color: white;
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
}

.cancel-button {
    background-color: #6c757d;
    color: white;
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
}
</style>
