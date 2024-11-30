import axios from "axios";
import { createStore } from "vuex";
import importHistory from "./module/importHistory"; // Import module lịch sử nhập hàng

export default createStore({
  state() {
    return {
      token: localStorage.getItem("token") || "",
      user: JSON.parse(localStorage.getItem("user") || "null"),
      furniture: [],
      filteredFurniture: [],
      cart: JSON.parse(localStorage.getItem("cart") || "[]"),
      shippingAddress: {},
      selectedPaymentMethod: "",
      orders: [],
      reviewedProducts: [],
      currentOrderId: null,
      inventory: [],
    };
  },
  methods: {
    setPaymentMethod(method) {
      this.paymentMethod = method;
      this.$store.commit("SET_SELECTED_PAYMENT_METHOD", method); // Cập nhật Vuex
    },
    confirmShippingAddress() {
      this.$store.commit("SET_SHIPPING_ADDRESS", this.shippingAddress); // Lưu địa chỉ vào Vuex
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User stored in Vuex:", state.user); // Kiểm tra xem `user` có chứa `id` không
    },
    SET_REVIEWED_PRODUCTS(state, products) {
      state.reviewedProducts = products;
    },
    LOGOUT(state) {
      state.token = "";
      state.user = null;
      state.cart = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    },
    SET_FURNITURE(state, furniture) {
      state.furniture = furniture;
    },
    UPDATE_FURNITURE(state, updatedProduct) {
      const index = state.furniture.findIndex(
        (product) => product._id === updatedProduct._id
      );
      if (index !== -1) {
        // Thay thế sản phẩm cũ bằng sản phẩm đã cập nhật
        state.furniture.splice(index, 1, updatedProduct);
      }
    },
    HIDE_FURNITURE(state, productId) {
      const index = state.furniture.findIndex(
        (product) => product._id === productId
      );

      if (index === -1) {
        console.error(`Sản phẩm với ID ${productId} không tồn tại trong state`);
        return;
      }

      state.furniture[index].active = false; // Cập nhật trạng thái active thành false
    },
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory;
    },
    ADD_INVENTORY(state, newInventory) {
      state.inventory.push(newInventory);
    },
    SET_FILTERED_FURNITURE(state, filteredFurniture) {
      state.filteredFurniture = filteredFurniture;
    },
    ADD_TO_CART(state, product) {
      const existingProduct = state.cart.find(
        (item) => item._id === product._id
      );
      if (existingProduct) {
        existingProduct.quantity += product.quantity; // Cộng dồn số lượng nếu sản phẩm đã tồn tại trong giỏ
      } else {
        state.cart.push(product); // Thêm sản phẩm mới nếu chưa có trong giỏ
      }
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Lưu giỏ hàng vào localStorage
    },
    SET_CART(state, cart) {
      state.cart = cart;
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Lưu vào localStorage
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    REMOVE_FURNITURE(state, productId) {
      state.furniture = state.furniture.filter((product) => product._id !== productId);
    },

    SET_SHIPPING_ADDRESS(state, address) {
      state.shippingAddress = address;
    },
    SET_SELECTED_PAYMENT_METHOD(state, method) {
      state.selectedPaymentMethod = method;
    },
    SET_ORDERS(state, orders) {
      state.orders = orders;
    },

    CLEAR_CART(state) {
      state.cart = []; // Làm trống giỏ hàng
      localStorage.removeItem("cart"); // Xóa giỏ hàng trong localStorage
    },
  },
  actions: {
    async fetchInventory({ commit }) {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Inventory fetched:", response.data); // Log dữ liệu trả về
        commit("SET_INVENTORY", response.data); // Lưu dữ liệu vào Vuex
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    },
    async deleteProduct({ commit }, productId) {
      try {
        await axios.delete(`http://localhost:5000/api/furniture/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Cập nhật danh sách sản phẩm trong state
        commit("REMOVE_FURNITURE", productId);
      } catch (error) {
        console.error("Error deleting product:", error.response?.data || error);
        throw error; // Để component xử lý lỗi (nếu cần)
      }
    },

    async updateInventoryAfterOrderCompletion({ productId, quantitySold }) {
      try {
        const response = await axios.patch(
          "http://localhost:5000/api/inventory/update-after-sale",
          { productId, quantitySold },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("Inventory updated after sale:", response.data);
      } catch (error) {
        console.error("Failed to update inventory after sale:", error);
      }
    },
    async importProducts({ dispatch }, formData) {
      try {
        const formDataObj = new FormData();
        formDataObj.append("productName", formData.productName);
        formDataObj.append("description", formData.description);
        formDataObj.append("costPrice", formData.originalPrice); // Giá gốc
        formDataObj.append("salePrice", formData.price); // Giá bán
        formDataObj.append("category", formData.category);
        formDataObj.append("quantity", formData.quantity);
        formDataObj.append("material", formData.material);
        formDataObj.append("supplier", formData.supplier);

        if (formData.image) {
          formDataObj.append("image", formData.image);
        }

        // Gửi yêu cầu API
        await axios.post("http://localhost:5000/api/inventory/import", formDataObj, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Tải lại danh sách kho
        await dispatch("fetchInventory");
      } catch (error) {
        console.error("Lỗi nhập hàng:", error);
        throw error; // Ném lỗi để xử lý ở component
      }
    },
    async fetchReviewedProducts({ commit }) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reviews/user-reviewed-products",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        commit("SET_REVIEWED_PRODUCTS", response.data.reviewedProducts);
      } catch (error) {
        console.error("Error fetching reviewed products:", error);
      }
    },
    async updateProduct({ commit }, { id, formData }) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/furniture/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Cập nhật danh sách sản phẩm trong Vuex
        commit("UPDATE_FURNITURE", response.data);

        // Trả về sản phẩm đã cập nhật để component sử dụng
        return response.data;
      } catch (error) {
        console.error("Error updating furniture:", error.response?.data || error);
        throw error;
      }
    },
    async hideProduct({ commit, dispatch }, productId) {
      try {
        if (!productId) {
          throw new Error("Product ID không hợp lệ");
        }

        await axios.put(
          `http://localhost:5000/api/furniture/${productId}/hide`,
          { active: false },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        commit("HIDE_FURNITURE", productId); // Cập nhật trạng thái trên frontend

        // Gọi thêm một hành động để làm mới dữ liệu (nếu cần thiết)
        await dispatch('fetchFurniture');
      } catch (error) {
        console.error("Error hiding furniture:", error);
      }
    },

    async loadUserFromToken({ commit, dispatch, state }) {
      if (state.token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/users/me",
            {
              headers: {
                Authorization: `Bearer ${state.token}`,
              },
            }
          );
          commit("SET_USER", response.data.user);
          await dispatch("fetchCart");
        } catch (error) {
          console.error("Failed to load user:", error);
          commit("LOGOUT");
        }
      }
    },
    async fetchOrders({ commit, state }) {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/user", {
          headers: { Authorization: `Bearer ${state.token}` },
        });

        console.log("Orders response:", response.data); // Log dữ liệu đơn hàng trả về để kiểm tra

        const orders = response.data.map(order => ({
          ...order,
          products: order.products || [],  // Đảm bảo luôn có mảng sản phẩm
          orderStatus: order.orderStatus || "Đang gửi", // Gán trạng thái mặc định nếu thiếu
        }));

        commit("SET_ORDERS", orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    },
    async fetchAllOrders({ commit, state }) {
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        commit("SET_ORDERS", response.data);
      } catch (error) {
        console.error("Failed to fetch all orders", error);
      }
    },
    async login({ commit, dispatch }, { email, password }) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          { email, password }
        );
        const token = response.data.accessToken;
        const user = response.data.user;

        commit("SET_TOKEN", token);
        commit("SET_USER", user);

        await dispatch("fetchCart");

        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    logout({ commit }) {
      commit("CLEAR_USER"); // Xóa dữ liệu người dùng
      localStorage.removeItem("token"); // Xóa token khỏi localStorage
      commit("SET_TOKEN", null);
    },
    async fetchFurniture({ commit }) {
      try {
        const response = await axios.get("http://localhost:5000/api/furniture");
        commit("SET_FURNITURE", response.data);
      } catch (error) {
        console.error("Fetch furniture failed:", error);
      }
    },
    async fetchCart({ commit, state }) {
      if (state.user) {
        try {
          const response = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${state.token}` },
          });
          commit("SET_CART", response.data);
          localStorage.removeItem("cart");
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      }
    },
    async saveCart({ state }) {
      if (state.user && state.token) {
        try {
          await axios.post(
            "http://localhost:5000/api/cart",
            { cart: state.cart },
            { headers: { Authorization: `Bearer ${state.token}` } }
          );
        } catch (error) {
          console.error("Failed to save cart:", error);
        }
      }
    },
    async updateCart({ commit, state, getters, dispatch }, updatedItem) {
      try {
        // Lấy thông tin tồn kho từ getter getInventoryItem
        const inventoryItem = getters.getInventoryItem(updatedItem._id);
    
        // Kiểm tra nếu không tìm thấy thông tin tồn kho
        if (!inventoryItem) {
          console.error("Không tìm thấy thông tin tồn kho:", {
            productId: updatedItem._id,
            inventory: state.inventory,
          });
          throw new Error(`Không tìm thấy thông tin tồn kho cho sản phẩm "${updatedItem.name}".`);
        }
    
        // Kiểm tra nếu số lượng vượt quá tồn kho
        if (updatedItem.quantity > inventoryItem.remainingQuantity) {
          throw new Error(
            `Số lượng sản phẩm "${updatedItem.name}" chỉ còn ${inventoryItem.remainingQuantity}.`
          );
        }
    
        // Cập nhật giỏ hàng
        const updatedCart = state.cart.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
        commit("SET_CART", updatedCart);
    
        // Lưu giỏ hàng vào server nếu người dùng đã đăng nhập
        if (state.user && state.token) {
          await dispatch("saveCart");
        }
      } catch (error) {
        console.error("Error updating cart:", error.message);
        throw error; // Để component xử lý hiển thị thông báo lỗi nếu cần
      }
    },    
    async checkout({ commit, state, dispatch }) {
      try {
        const orderDetails = {
          products: state.cart.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          totalAmount: state.cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
          shippingAddress: state.shippingAddress,
          paymentMethod: state.selectedPaymentMethod,
        };

        const response = await axios.post(
          "http://localhost:5000/api/orders",
          orderDetails,
          {
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );

        console.log("Order placed successfully:", response.data);

        // Cập nhật tồn kho sau khi đơn hàng được đặt
        for (let item of state.cart) {
          await dispatch("updateInventoryAfterOrderCompletion", {
            productId: item._id,
            quantitySold: item.quantity,
          });
        }

        commit("CLEAR_CART");
        localStorage.removeItem("cart");

        await axios.delete("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
      } catch (error) {
        console.error("Failed to place order", error);
        alert("Failed to place order");
      }
    },

    async createOrder({ state, commit, dispatch }, orderData) {
      try {
        const totalAmount = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const orderDetails = {
          products: state.cart.map((item) => ({ product: item._id, quantity: item.quantity })),
          totalAmount: totalAmount,
          ...orderData,
        };

        const response = await axios.post("http://localhost:5000/api/orders", orderDetails, {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        console.log("Order created:", response.data);

        // Cập nhật tồn kho sau khi hoàn tất đơn hàng
        await Promise.all(
          state.cart.map((item) =>
            dispatch("updateInventoryAfterOrderCompletion", { productId: item._id, quantitySold: item.quantity })
          )
        );

        commit("CLEAR_CART");
      } catch (error) {
        console.error("Failed to create order:", error.response?.data || error.message);
        throw error;
      }
    },
    addToCart({ commit, dispatch }, product) {
      // Fetch giá sản phẩm từ API hoặc Vuex state
      const productToAdd = {
        _id: product._id,
        name: product.name,
        price: product.salePrice || product.price, // Sử dụng salePrice nếu có, nếu không fallback sang price
        material: product.material,
        description: product.description || "No description available",
        image: product.image,
        quantity: product.quantity || 1, // Đảm bảo số lượng mặc định là 1 nếu không có
      };

      // Thêm sản phẩm vào giỏ hàng
      commit("ADD_TO_CART", productToAdd);

      // Lưu giỏ hàng vào backend hoặc localStorage
      dispatch("saveCart");
    },

    removeFromCart({ commit, dispatch }, productId) {
      commit("REMOVE_FROM_CART", productId);
      dispatch("saveCart");
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
    async clearCartBackend({ commit, state }) {
      try {
        // Gọi API để xóa giỏ hàng từ backend
        await axios.delete("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${state.token}` },
        });

        // Cập nhật giỏ hàng trên frontend (Vuex)
        commit("CLEAR_CART");
      } catch (error) {
        console.error("Failed to clear cart from backend:", error);
      }
    },
  },
  getters: {
    getInventoryItem: (state) => (productId) => {
      return state.inventory.find((inventory) => inventory.product._id === productId);
    },
    isAuthenticated: (state) => !!state.token,
    reviewedProducts: (state) => state.reviewedProducts,
    furniture(state) {
      return state.furniture;
    },
    cartItems(state) {
      return state.cart || [];
    },
    cartItemCount: (state) => state.cart.reduce((total, item) => total + item.quantity, 0),
    userOrders: (state) => state.orders,
    cartTotalAmount: (state) => state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    filteredFurniture: (state) => {
      return state.furniture.filter((product) => product.active); // Chỉ hiển thị sản phẩm active
    },
  },
  modules: {
    importHistory, // Đăng ký module importHistory
  },
});