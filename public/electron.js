const { app, globalShortcut, BrowserWindow } = require("electron");
const path = require("path");
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 800,
		x: 20,
		y: 20,
		frame: true,
		resizable: true,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
		},
		backgroundColor: "#F0F2F7",
		fullscreen: false,
	});
	mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
	mainWindow.on("closed", () => (mainWindow = null));
}

// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
// 	app.quit();
// } else {
// 	app.on("second-instance", (event, commandLine, workingDirectory) => {
// 		if (mainWindow) {
// 			if (mainWindow.isMinimized()) mainWindow.restore();
// 			mainWindow.focus();
// 		}
// 	});
// }

app.on("ready", () => {
	createWindow();
	// Регистрируем слушатель для сочетания клавиш 'CommandOrControl+X'.
	const ret = globalShortcut.register("CommandOrControl+Q", () => {
		console.log("CommandOrControl+X is pressed");
		mainWindow.show();
	});

	if (!ret) {
		console.log("ошибка регистрации");
	}

	// Проверяем, было ли сочетание зарегистрировано.
	console.log(globalShortcut.isRegistered("CommandOrControl+Q"));
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

app.on("will-quit", () => {
	// Отменяем регистрацию сочетания клавиш.
	globalShortcut.unregister("CommandOrControl+Q");

	// Отменяем регистрацию всех сочетаний.
	globalShortcut.unregisterAll();
});

const { ipcMain } = require("electron");
ipcMain.on("asynchronous-message", (event, arg) => {
	console.log(arg); // prints "ping"
	event.reply("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
	console.log(arg); // prints "ping"
	event.returnValue = "pong";
});
