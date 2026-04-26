const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Configuración
    getVersion: () => ipcRenderer.invoke('get-version'),
    getConfig: () => ipcRenderer.invoke('get-config'),
    getQuantumConfig: () => ipcRenderer.invoke('get-quantum-config'),
    getCryptoConfig: () => ipcRenderer.invoke('get-crypto-config'),
    getClusterStatus: () => ipcRenderer.invoke('get-cluster-status'),
    updateConfig: (configUpdate) => ipcRenderer.invoke('update-config', configUpdate),
    
    // Logs
    saveLog: (logData) => ipcRenderer.invoke('save-log', logData),
    
    // Eventos del menú
    onResetSimulation: (callback) => ipcRenderer.on('reset-simulation', callback),
    onExportLogs: (callback) => ipcRenderer.on('export-logs', callback),
    onExecuteQuantum: (callback) => ipcRenderer.on('execute-quantum', callback),
    onSimulateAttack: (callback) => ipcRenderer.on('simulate-attack', callback),
    onClearTerminal: (callback) => ipcRenderer.on('clear-terminal', callback),
    onConfigLoaded: (callback) => ipcRenderer.on('config-loaded', callback),
    onScenarioChanged: (callback) => ipcRenderer.on('scenario-changed', callback),
    onSystemError: (callback) => ipcRenderer.on('system-error', callback),
    
    // Remover listeners
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});

// Información del sistema
contextBridge.exposeInMainWorld('systemInfo', {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome
});