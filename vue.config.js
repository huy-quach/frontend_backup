// vue.config.js
module.exports = {
  devServer: {
    port: 5000, // Cổng chạy frontend của bạn (có thể là 5001 nếu backend chạy trên 5000)
    allowedHosts: "all", // Cho phép tất cả các host (bao gồm cả ngrok)
  },
};
