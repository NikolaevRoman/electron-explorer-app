const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('drivers', {
    localList: () => ipcRenderer.invoke('localList'),
    isWinOs: () => ipcRenderer.invoke('isWinOs'),
    networkList: () => ipcRenderer.invoke('networkList'),
})

contextBridge.exposeInMainWorld('files', {
    filesList: (path) => ipcRenderer.invoke('filesList', path),
    isFile: (path, fileName) => ipcRenderer.invoke('isFile', path, fileName),
    pathJoin: (path, fileName) => ipcRenderer.invoke("pathJoin", path, fileName),
})