// Ví dụ sử dụng thư viện firebase-admin để gửi thông báo đến FCM từ máy chủ
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fcmService = {
  sendNotification: function (title, body) {
    const payload = {
      notification: {
        title: title,
        body: body,
      },
      // Thêm các tùy chọn thông báo khác tùy ý tại đây
    };

    // Gửi thông báo đến tất cả thiết bị đã đăng ký trong FCM
    admin
    
      .messaging()
      .sendToTopic("allDevices", payload)
      .then((response) => {
        console.log("Thông báo đã được gửi thành công:", response);
      })
      .catch((error) => {
        console.error("Lỗi gửi thông báo:", error);
      });
  },
};

module.exports = { fcmService };
