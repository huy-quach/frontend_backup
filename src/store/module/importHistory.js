import axios from "axios";

const state = {
    importHistory: [], // Dữ liệu lịch sử nhập hàng
};

const mutations = {
    SET_IMPORT_HISTORY(state, history) {
        state.importHistory = history; // Cập nhật lịch sử nhập hàng
    },
};

const actions = {
    async fetchImportHistory({ commit }) {
        try {
            const response = await axios.get("http://localhost:5000/api/import-history/getImportHistory", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Đảm bảo gửi token hợp lệ
                },
            });
            commit("SET_IMPORT_HISTORY", response.data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử nhập hàng:", error);
        }
    },
};

const getters = {
    importHistory: (state) => state.importHistory, // Getter để lấy lịch sử nhập hàng
};

export default {
    namespaced: true, // Kích hoạt namespaced để module hoạt động độc lập
    state,
    mutations,
    actions,
    getters,
};
