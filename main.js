const { app, BrowserWindow, ipcMain } = require('electron')
const { Notification } = require('electron')
const { fcmService } = require('./fcmService'); // Đối tượng fcmService chứa hàm để gửi thông báo đến máy tính người dùng.

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  win.webContents.on('will-navigate', (event, url) => {
    // Kiểm tra xem URL được mở có phải là liên kết cụ thể mà bạn muốn mở hay không.
    if (url === 'https://piachat-web-and-desktop.vercel.app/chat/64c03d01e2a2cb8133a22e44') {
      // Ngăn chặn việc mở trình duyệt mặc định và mở liên kết trong app của bạn.
      event.preventDefault();
      win.loadURL(url); // Load liên kết trong app
    }
  });


  win.loadURL('https://piachat-web-and-desktop.vercel.app')
  win.webContents.openDevTools()  
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})