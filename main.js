const { app, BrowserWindow, Notification } = require("electron");
const io = require("socket.io-client");
const squirrelStartup = require("electron-squirrel-startup"); // Thêm dòng này
const axios = require("axios");
const { v4 } = require("uuid");

const isSingleInstance = app.requestSingleInstanceLock();
const NOTIFICATION_TITLE = "Pia chat";
// const NOTIFICATION_BODY = "Notification from the Main process";

if (!isSingleInstance) {
  app.quit(); // Chỉ cho phép một phiên bản chạy
}

const get_list_conversation = async (idUser, accessToken) => {
  const res = await axios({
    url: `http://localhost:4000/api/conversations/` + idUser,
    method: "get",
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
  const result = await res.data;
  return result;
};

const get_profile_user = async (meId, accessToken) => {
  const res = await axios({
    url: `http://localhost:4000/api/users/${meId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "get",
    params: {
      id: meId,
    },
  });
  const result = await res.data;

  return result;
};

if (squirrelStartup) {
  app.quit();
}

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: __dirname + "/icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    show: true,
  });

  win.webContents.on("will-navigate", (event, url) => {
    // Kiểm tra xem URL được mở có phải là liên kết cụ thể mà bạn muốn mở hay không.
    if (url === "http://localhost:3000/") {
      // Ngăn chặn việc mở trình duyệt mặc định và mở liên kết trong app của bạn.
      event.preventDefault();
      win.loadURL(url); // Load liên kết trong app
    }
  });

  win.loadURL("http://localhost:3000/");
  win.webContents.executeJavaScript(
    'localStorage.setItem("appdesktop", "true")',
    true
  );
  const socket = io("http://localhost:4000", [{ transports: ["websocket"] }]); // Thay thế bằng URL của server socket.io

  socket.on("connect", () => {
    console.log("Connected to server via socket.io");
    // Gửi một tin nhắn tới server
    socket.emit("message", "Hello, server!");
  });
  var list_conversation_user = [];
  let uid = "";
  let accessToken = "";
  let dataUser = {};
  win.webContents
    .executeJavaScript(
      'localStorage.getItem("uid")+ "|||" +localStorage.getItem("accessToken")',
      true
    )
    .then((result) => {
      uid = result.split("|||")[0];
      accessToken = result.split("|||")[1];
      return result;
    })
    .then(async () => {
      try {
        const result1 = await get_profile_user(uid, accessToken);
        console.log(result1);
        const result = await get_list_conversation(uid, accessToken);
        dataUser = result1;
        list_conversation_user = result;
        socket.emit("join_room_self", { meId: result1._id });
        socket.on("toggle_notification_server", (data) => {
          console.log(data);
          dataUser.isDeaf = data?.is_notification;
          // app.commandLine.appendSwitch
        });

        socket.on("newest_message_notification", (data) => {
          if (dataUser?.isDeaf === true) {
            const index = list_conversation_user.findIndex(
              (item) => item.id_conversation === data?.roomId
            );
            // console.log(list_conversation_user)
            if (index >= 0 && uid !== data?.senderId) {
              const notification = new Notification({
                title: NOTIFICATION_TITLE,
                subtitle: data?.data?.username,
                body: data?.message,
                icon: data?.data?.profilePicture,
                replyPlaceholder: "Trả lời",
                hasReply: true,
              });
              notification.on("reply", (event, arg) => {
                socket.emit("send_new_message", { ...data, senderId: uid });
                socket.emit("message_from_client", {
                  sender: dataUser,
                  type_message: "text",
                  createdAt: new Date(),
                  key: v4(),
                  roomId: data?.roomId,
                  message: arg,
                });
              });
              notification.on("click", (event, arg) => {
                // console.log("clicked");
                // Khi người dùng nhấn vào thông báo
                if (!win || win.isDestroyed()) {
                  win = new BrowserWindow({
                    width: 1200,
                    height: 800,
                    icon: __dirname + "/icon.png",
                    webPreferences: {
                      nodeIntegration: true,
                      contextIsolation: false,
                      enableRemoteModule: true,
                    },
                    show: true,
                  });

                  win.webContents.on("will-navigate", (event, url) => {
                    // Kiểm tra xem URL được mở có phải là liên kết cụ thể mà bạn muốn mở hay không.
                    if (url === "http://localhost:3000/") {
                      // Ngăn chặn việc mở trình duyệt mặc định và mở liên kết trong app của bạn.
                      event.preventDefault();
                      win.loadURL(url); // Load liên kết trong app
                    }
                  });

                  win.loadURL("http://localhost:3000/chat/" + data?.roomId);
                  win.webContents.executeJavaScript(
                    'localStorage.setItem("appdesktop", "true")',
                    true
                  );
                } else if (!win.isVisible()) {
                  socket.emit("navigate_chat_from_notification_desktop", {
                    ...data,
                    meId: uid,
                  });
                  win.show(); // Hiển thị cửa sổ nếu đang ẩn
                } else if (win.isVisible()) {
                  socket.emit("navigate_chat_from_notification_desktop", {
                    ...data,
                    meId: uid,
                  });
                }
              });
              notification.show();
            }
          }
        });
        socket.on("notification_app_desktop", (data) => {
          console.log(data);
        });
      } catch (error) {
        console.log(error);
      }
    });
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (win && !win.isVisible()) {
      win.show();
    }
  });

  app.on("before-quit", (event) => {
    if (win && !win.isDestroyed()) {
      event.preventDefault();
      win.hide();
    }
  });
});

app.on("window-all-closed", (event) => {
  event.preventDefault();
});
