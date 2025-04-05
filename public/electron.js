const { app, globalShortcut, BrowserWindow, ipcMain } = require("electron");
const path = require('node:path')
const drivelist = require('drivelist');
const networkDrive = require('windows-network-drive')
const { readdir, lstat } = require('node:fs/promises')
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		x: 20,
		y: 20,
		frame: true,
		resizable: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
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

ipcMain.handle("localList", async () => {
	const list = await drivelist.list();
	return list;
})

ipcMain.handle("isWinOs", async () => networkDrive.isWinOs())

ipcMain.handle("networkList", async () => await networkDrive.list())

ipcMain.handle("filesList", async (event, path) => {
	const files = await readdir(path);
	const filesStat = await lstat(path);
	console.log(filesStat)
	return files;
}) 

ipcMain.handle("isFile", async (event, ...args) => {
	console.log(...args)
	const fileInfo = await lstat(path.join(...args));
	return fileInfo.isFile();
}) 

ipcMain.handle("pathJoin", async (event, ...args) => {
	return path.join(...args);
} ) 