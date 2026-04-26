/**
 * SCSC Quantum Security System
 * Main Renderer Process - UI Logic & Terminal Control
 * Versión: 1.0.0
 */

// ============================================================
// ESTADO GLOBAL DEL SISTEMA
// ============================================================

const SystemState = {
    version: '1.0.0',
    startupTime: new Date(),
    metrics: {
        cpu: 23.4,
        memory: 8.2,
        memoryTotal: 32,
        fidelity: 0.9997,
        qber: 0.8,
        entangled: 12,
        maxQubits: 24,
        throughput: 1234,
        latency: 12.3,
        attacksBlocked: 128,
        keysDistributed: 45
    },
    cluster: {
        masterActive: true,
        activeNodes: 5,
        totalNodes: 5,
        nodes: []
    },
    quantum: {
        backend: 'aer_simulator',
        circuitActive: null,
        lastFidelity: 0.9997
    },
    crypto: {
        algorithm: 'Kyber-1024',
        signature: 'SPHINCS+',
        qkdProtocol: 'BB84'
    },
    terminalHistory: [],
    autoGenerationActive: true,
    commandHistory: [],
    historyIndex: -1
};

// ============================================================
// INICIALIZACIÓN DEL SISTEMA
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[SCSC] Initializing Quantum Security System...');
    initializeTerminal();
    initializeEventListeners();
    loadConfiguration();
    startMetricsUpdate();
    startAutoLogGeneration();
    loadClusterNodes();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => showWelcomeMessage(), 500);
});

function initializeTerminal() {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) {
        console.error('[SCSC] Terminal element not found');
        return;
    }
    
    // Limpiar terminal (por si hay contenido por defecto)
    terminal.innerHTML = '';
    
    addTerminalMessage('============================================================', 'info');
    addTerminalMessage('SCSC QUANTUM SECURITY SYSTEM v' + SystemState.version, 'highlight');
    addTerminalMessage('============================================================', 'info');
    addTerminalMessage('Quantum Backend: ' + SystemState.quantum.backend, 'quantum');
    addTerminalMessage('Post-Quantum Crypto: ' + SystemState.crypto.algorithm + ' + ' + SystemState.crypto.signature, 'crypto');
    addTerminalMessage('Cluster: ' + SystemState.cluster.activeNodes + '/' + SystemState.cluster.totalNodes + ' nodes active', 'success');
    addTerminalMessage('Type "help" for available commands', 'info');
}

function showWelcomeMessage() {
    addTerminalMessage('Quantum engine initialized successfully', 'quantum');
    addTerminalMessage('Post-quantum cryptography protocols activated', 'crypto');
    addTerminalMessage('Connecting to 5-node quantum cluster...', 'info');
    
    setTimeout(() => {
        addTerminalMessage('All nodes responding - Cluster operational', 'success');
        addTerminalMessage('SCSC Quantum Security System ready for operations', 'success');
    }, 1000);
}

// ============================================================
// CONFIGURACIÓN
// ============================================================

async function loadConfiguration() {
    if (window.electronAPI) {
        try {
            const config = await window.electronAPI.getConfig();
            if (config) {
                SystemState.quantum.backend = config.quantum?.backend || SystemState.quantum.backend;
                SystemState.quantum.maxQubits = config.quantum?.maxQubits || 24;
                SystemState.metrics.maxQubits = SystemState.quantum.maxQubits;
                SystemState.crypto.algorithm = config.crypto?.postQuantum?.keyExchange || SystemState.crypto.algorithm;
                
                updateUIWithConfig(config);
                console.log('[CONFIG] Configuration loaded successfully');
            }
        } catch (error) {
            console.error('[CONFIG] Error loading config:', error);
        }
    }
}

function updateUIWithConfig(config) {
    const versionSpan = document.getElementById('appVersion');
    if (versionSpan && config.system) {
        versionSpan.innerText = config.system.version || SystemState.version;
        SystemState.version = config.system.version;
    }
    
    // Actualizar backend en UI
    const quantumStatusSpan = document.getElementById('quantumStatus');
    if (quantumStatusSpan) {
        quantumStatusSpan.innerText = `Quantum Backend: ${SystemState.quantum.backend}`;
    }
}

// ============================================================
// EVENTOS Y COMANDOS
// ============================================================

function initializeEventListeners() {
    // Botones de acción
    const btnQuantum = document.getElementById('btnQuantum');
    const btnAttack = document.getElementById('btnAttack');
    const btnClear = document.getElementById('btnClear');
    
    if (btnQuantum) btnQuantum.addEventListener('click', () => executeQuantumCircuit());
    if (btnAttack) btnAttack.addEventListener('click', () => simulateIntrusion());
    if (btnClear) btnClear.addEventListener('click', () => clearTerminal());
    
    // Input de comandos
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = commandInput.value.trim();
                if (command) {
                    executeCommand(command);
                    commandInput.value = '';
                }
            }
        });
        
        // Historial de comandos (flecha arriba/abajo)
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (SystemState.historyIndex < SystemState.commandHistory.length - 1) {
                    SystemState.historyIndex++;
                    commandInput.value = SystemState.commandHistory[SystemState.commandHistory.length - 1 - SystemState.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (SystemState.historyIndex > 0) {
                    SystemState.historyIndex--;
                    commandInput.value = SystemState.commandHistory[SystemState.commandHistory.length - 1 - SystemState.historyIndex];
                } else if (SystemState.historyIndex === 0) {
                    SystemState.historyIndex = -1;
                    commandInput.value = '';
                }
            }
        });
    }
    
    // Eventos desde el menú de Electron
    if (window.electronAPI) {
        window.electronAPI.onExecuteQuantum(() => executeQuantumCircuit());
        window.electronAPI.onSimulateAttack(() => simulateIntrusion());
        window.electronAPI.onClearTerminal(() => clearTerminal());
        window.electronAPI.onResetSimulation(() => resetSimulation());
        window.electronAPI.onConfigLoaded((event, config) => {
            if (config) updateUIWithConfig(config);
        });
    }
}

function executeCommand(command) {
    const cmd = command.toLowerCase().trim();
    
    // Guardar en historial
    if (cmd !== '') {
        SystemState.commandHistory.push(command);
        SystemState.historyIndex = -1;
    }
    
    addTerminalMessage(`PS> ${command}`, 'prompt');
    
    const commandActions = {
        'help': () => showHelp(),
        'status': () => showStatus(),
        'crypto': () => showCryptoStatus(),
        'quantum': () => showQuantumStatus(),
        'attack': () => simulateIntrusion(),
        'clear': () => clearTerminal(),
        'metrics': () => showMetrics(),
        'nodes': () => showNodes(),
        'version': () => showVersion(),
        'reset': () => resetSimulation(),
        'export': () => exportLogs()
    };
    
    if (commandActions[cmd]) {
        setTimeout(() => commandActions[cmd](), 50);
    } else if (cmd !== '') {
        addTerminalMessage(`Unknown command: '${command}'. Type 'help' for available commands.`, 'warning');
    }
}

// ============================================================
// COMANDOS DEL SISTEMA
// ============================================================

function showHelp() {
    addTerminalMessage('Available commands:', 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('  help     - Show this help message', 'info');
    addTerminalMessage('  status   - Display cluster and system status', 'info');
    addTerminalMessage('  crypto   - Show post-quantum crypto status', 'crypto');
    addTerminalMessage('  quantum  - Display quantum state information', 'quantum');
    addTerminalMessage('  attack   - Simulate intrusion attempt', 'warning');
    addTerminalMessage('  metrics  - Show detailed system metrics', 'info');
    addTerminalMessage('  nodes    - List all cluster nodes', 'info');
    addTerminalMessage('  version  - Show system version', 'info');
    addTerminalMessage('  reset    - Reset quantum simulation', 'warning');
    addTerminalMessage('  export   - Export terminal logs to file', 'info');
    addTerminalMessage('  clear    - Clear terminal screen', 'info');
    addTerminalMessage('', 'info');
}

function showStatus() {
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
    addTerminalMessage('SCSC CLUSTER STATUS', 'highlight');
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
    addTerminalMessage(`Master Node: 192.168.1.100:8080 [${SystemState.cluster.masterActive ? 'ACTIVE' : 'OFFLINE'}]`, 
        SystemState.cluster.masterActive ? 'success' : 'error');
    addTerminalMessage(`Worker Nodes: ${SystemState.cluster.activeNodes}/${SystemState.cluster.totalNodes} active`, 'success');
    addTerminalMessage(`Uptime: ${getUptime()}`, 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('QUANTUM METRICS', 'quantum');
    addTerminalMessage(`  Quantum Fidelity: ${SystemState.metrics.fidelity}`, 'quantum');
    addTerminalMessage(`  QBER: ${SystemState.metrics.qber}%`, 'info');
    addTerminalMessage(`  Entangled Qubits: ${SystemState.metrics.entangled}/${SystemState.metrics.maxQubits}`, 'quantum');
    addTerminalMessage(`  Avg Latency: ${SystemState.metrics.latency}ms`, 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('SYSTEM METRICS', 'info');
    addTerminalMessage(`  CPU Usage: ${SystemState.metrics.cpu}%`, 'info');
    addTerminalMessage(`  Memory: ${SystemState.metrics.memory}/${SystemState.metrics.memoryTotal} GB`, 'info');
    addTerminalMessage(`  Throughput: ${SystemState.metrics.throughput.toLocaleString()} ops/s`, 'info');
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
}

function showCryptoStatus() {
    addTerminalMessage('═══════════════════════════════════════════════════', 'crypto');
    addTerminalMessage('POST-QUANTUM CRYPTOGRAPHY STATUS', 'highlight');
    addTerminalMessage('═══════════════════════════════════════════════════', 'crypto');
    addTerminalMessage(`Key Exchange: ${SystemState.crypto.algorithm} (Lattice-based)`, 'crypto');
    addTerminalMessage(`Digital Signature: ${SystemState.crypto.signature} (Hash-based)`, 'crypto');
    addTerminalMessage(`Encryption: AES-256-GCM`, 'crypto');
    addTerminalMessage(`QKD Protocol: ${SystemState.crypto.qkdProtocol} (Simulated)`, 'crypto');
    addTerminalMessage('', 'info');
    addTerminalMessage(`Keys Distributed: ${SystemState.metrics.keysDistributed}`, 'success');
    addTerminalMessage(`Attacks Blocked: ${SystemState.metrics.attacksBlocked}`, 'success');
    addTerminalMessage(`QBER Threshold: 3.0% (Current: ${SystemState.metrics.qber}%)`, 
        parseFloat(SystemState.metrics.qber) < 3 ? 'success' : 'warning');
    addTerminalMessage('═══════════════════════════════════════════════════', 'crypto');
}

function showQuantumStatus() {
    addTerminalMessage('═══════════════════════════════════════════════════', 'quantum');
    addTerminalMessage('QUANTUM SYSTEM STATUS', 'highlight');
    addTerminalMessage('═══════════════════════════════════════════════════', 'quantum');
    addTerminalMessage(`Backend: ${SystemState.quantum.backend}`, 'quantum');
    addTerminalMessage(`Max Qubits: ${SystemState.metrics.maxQubits}`, 'quantum');
    addTerminalMessage(`Entangled Qubits: ${SystemState.metrics.entangled}/${SystemState.metrics.maxQubits}`, 'quantum');
    addTerminalMessage(`Fidelity: ${SystemState.metrics.fidelity}`, 'quantum');
    addTerminalMessage(`QBER: ${SystemState.metrics.qber}%`, 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('ACTIVE CIRCUIT', 'quantum');
    addTerminalMessage(`  Type: Variational Ansatz`, 'info');
    addTerminalMessage(`  Depth: 4`, 'info');
    addTerminalMessage(`  Gates: RY, RZ, CX`, 'info');
    addTerminalMessage(`  Status: ${SystemState.quantum.circuitActive ? 'EXECUTING' : 'READY'}`, 'success');
    addTerminalMessage('', 'info');
    addTerminalMessage('ERROR MITIGATION', 'info');
    addTerminalMessage(`  Method: Readout Error Correction`, 'info');
    addTerminalMessage(`  Status: ACTIVE`, 'success');
    addTerminalMessage('═══════════════════════════════════════════════════', 'quantum');
}

function showMetrics() {
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
    addTerminalMessage('DETAILED SYSTEM METRICS', 'highlight');
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('CPU METRICS', 'info');
    addTerminalMessage(`  Usage: ${SystemState.metrics.cpu}%`, 'info');
    addTerminalMessage(`  Cores: 8 (virtual)`, 'info');
    addTerminalMessage(`  Frequency: 3.2 GHz`, 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('MEMORY METRICS', 'info');
    addTerminalMessage(`  Used: ${SystemState.metrics.memory} GB`, 'info');
    addTerminalMessage(`  Total: ${SystemState.metrics.memoryTotal} GB`, 'info');
    addTerminalMessage(`  Available: ${(SystemState.metrics.memoryTotal - SystemState.metrics.memory).toFixed(1)} GB`, 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('QUANTUM METRICS', 'quantum');
    addTerminalMessage(`  Fidelity: ${SystemState.metrics.fidelity}`, 'quantum');
    addTerminalMessage(`  QBER: ${SystemState.metrics.qber}%`, 'info');
    addTerminalMessage(`  Entanglement Entropy: ${(0.5 + Math.random() * 0.4).toFixed(3)}`, 'quantum');
    addTerminalMessage(`  T1 Time: ${(20 + Math.random() * 30).toFixed(1)} µs`, 'quantum');
    addTerminalMessage(`  T2 Time: ${(15 + Math.random() * 25).toFixed(1)} µs`, 'quantum');
    addTerminalMessage('', 'info');
    addTerminalMessage('NETWORK METRICS', 'info');
    addTerminalMessage(`  Throughput: ${SystemState.metrics.throughput.toLocaleString()} ops/s`, 'info');
    addTerminalMessage(`  Latency: ${SystemState.metrics.latency} ms`, 'info');
    addTerminalMessage(`  Bandwidth: 2.4 Gbps`, 'info');
    addTerminalMessage(`  Packet Loss: 0.001%`, 'info');
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
}

function showNodes() {
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
    addTerminalMessage('CLUSTER NODES', 'highlight');
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('MASTER NODE', 'success');
    addTerminalMessage(`  ID: master_01`, 'info');
    addTerminalMessage(`  Address: 192.168.1.100:8080`, 'info');
    addTerminalMessage(`  Status: ${SystemState.cluster.masterActive ? 'ONLINE' : 'OFFLINE'}`, SystemState.cluster.masterActive ? 'success' : 'error');
    addTerminalMessage(`  Role: Coordinator`, 'info');
    addTerminalMessage('', 'info');
    addTerminalMessage('WORKER NODES', 'info');
    
    const nodeStatuses = ['heartbeat 1.2ms', 'heartbeat 1.5ms', 'heartbeat 1.1ms', 'heartbeat 2.3ms', 'heartbeat 1.8ms'];
    for (let i = 1; i <= SystemState.cluster.totalNodes; i++) {
        const status = SystemState.cluster.activeNodes >= i ? nodeStatuses[i-1] : 'OFFLINE';
        const isActive = SystemState.cluster.activeNodes >= i;
        addTerminalMessage(`  NODE-${i.toString().padStart(2, '0')} [192.168.1.10${i}] → ${status}`, isActive ? 'success' : 'error');
    }
    addTerminalMessage('', 'info');
    addTerminalMessage(`Total Active: ${SystemState.cluster.activeNodes}/${SystemState.cluster.totalNodes}`, 'success');
    addTerminalMessage('═══════════════════════════════════════════════════', 'info');
}

function showVersion() {
    addTerminalMessage(`SCSC Quantum Security System v${SystemState.version}`, 'highlight');
    addTerminalMessage(`Build Date: ${new Date().toLocaleDateString()}`, 'info');
    addTerminalMessage(`Quantum Backend: ${SystemState.quantum.backend} v1.0`, 'quantum');
    addTerminalMessage(`Crypto Provider: Kyber-1024/SPHINCS+`, 'crypto');
}

function getUptime() {
    const diff = new Date() - SystemState.startupTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

// ============================================================
// ACCIONES PRINCIPALES
// ============================================================

function executeQuantumCircuit() {
    addTerminalMessage('Executing quantum circuit...', 'quantum');
    addTerminalMessage('|ψ⟩ = α|0⟩ + β|1⟩ superposition state prepared', 'quantum');
    addTerminalMessage('Hadamard gates applied to all qubits', 'quantum');
    
    setTimeout(() => {
        addTerminalMessage('Entanglement layer 1/2 completed', 'quantum');
    }, 300);
    
    setTimeout(() => {
        addTerminalMessage('Entanglement layer 2/2 completed', 'quantum');
    }, 600);
    
    setTimeout(() => {
        addTerminalMessage('Circuit transpiled for IBM quantum hardware', 'quantum');
        addTerminalMessage('Measurement completed with 1024 shots', 'quantum');
        const fidelity = (0.999 + Math.random() * 0.0009).toFixed(4);
        addTerminalMessage(`Quantum fidelity: ${fidelity}`, 'success');
        updateQuantumMetrics(fidelity);
    }, 1000);
    
    // Aumentar throughput
    SystemState.metrics.throughput += 50;
    updateSystemMetricsUI();
}

function simulateIntrusion() {
    const attacks = [
        { msg: 'INTRUSION DETECTED: Brute force attempt from 185.143.223.12', type: 'warning' },
        { msg: 'QUANTUM ATTACK MITIGATED: DDoS pattern neutralized in 234ms', type: 'warning' },
        { msg: 'PORT SCAN DETECTED: Quantum ports scanned from 45.33.22.11', type: 'warning' },
        { msg: 'MALICIOUS QUBIT INJECTION: Rejected by quantum filter', type: 'warning' },
        { msg: 'MITM QUANTUM ATTACK: Intercepted by no-cloning protocol', type: 'warning' },
        { msg: 'EAVESDROPPING DETECTED: QKD protocol triggered alert', type: 'warning' }
    ];
    
    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    addTerminalMessage(attack.msg, attack.type);
    
    setTimeout(() => {
        addTerminalMessage('Quantum IDS response executed - Threat neutralized', 'success');
        SystemState.metrics.attacksBlocked++;
        updateCryptoMetricsUI();
    }, 500);
}

function resetSimulation() {
    addTerminalMessage('Resetting quantum simulation...', 'warning');
    addTerminalMessage('Clearing quantum state cache...', 'info');
    addTerminalMessage('Reinitializing quantum backend...', 'quantum');
    
    setTimeout(() => {
        SystemState.metrics.entangled = 12;
        SystemState.metrics.fidelity = 0.9997;
        SystemState.metrics.qber = 0.8;
        SystemState.metrics.throughput = 1234;
        updateAllMetricsUI();
        addTerminalMessage('Simulation reset complete. System ready.', 'success');
    }, 1500);
}

function clearTerminal() {
    const terminal = document.getElementById('terminalOutput');
    if (terminal) {
        terminal.innerHTML = '';
        addTerminalMessage('Terminal cleared. SCSC Quantum Security System ready.', 'success');
        addTerminalMessage('Type "help" for available commands', 'info');
    }
}

async function exportLogs() {
    const terminal = document.getElementById('terminalOutput');
    if (terminal && window.electronAPI) {
        const logContent = terminal.innerText;
        const result = await window.electronAPI.saveLog(logContent);
        if (result.success) {
            addTerminalMessage(`Logs exported successfully to: ${result.path}`, 'success');
        } else {
            addTerminalMessage('Failed to export logs', 'error');
        }
    }
}

// ============================================================
// MÉTRICAS Y ACTUALIZACIONES
// ============================================================

function updateSystemMetrics() {
    SystemState.metrics.cpu = (20 + Math.random() * 15).toFixed(1);
    SystemState.metrics.memory = (8.2 + Math.random() * 0.8).toFixed(1);
    SystemState.metrics.latency = (10 + Math.random() * 8).toFixed(1);
    SystemState.metrics.throughput = Math.max(800, Math.min(2000, SystemState.metrics.throughput + (Math.random() - 0.5) * 20));
    
    updateSystemMetricsUI();
}

function updateQuantumMetrics(fidelity = null) {
    if (fidelity) {
        SystemState.metrics.fidelity = fidelity;
    } else {
        SystemState.metrics.fidelity = (0.999 + Math.random() * 0.0009).toFixed(4);
    }
    
    SystemState.metrics.qber = (0.5 + Math.random() * 1.2).toFixed(1);
    SystemState.metrics.entangled = Math.max(8, Math.min(SystemState.metrics.maxQubits, 
        SystemState.metrics.entangled + (Math.random() - 0.5) * 2));
    SystemState.metrics.entangled = Math.floor(SystemState.metrics.entangled);
    
    updateQuantumMetricsUI();
}

function updateSystemMetricsUI() {
    const cpuElem = document.getElementById('cpuMetric');
    const ramElem = document.getElementById('ramMetric');
    const throughputElem = document.getElementById('throughputMetric');
    const latencyElem = document.getElementById('latencyMetric');
    
    if (cpuElem) cpuElem.innerText = `${SystemState.metrics.cpu}%`;
    if (ramElem) ramElem.innerText = `${SystemState.metrics.memory} / ${SystemState.metrics.memoryTotal} GB`;
    if (throughputElem) throughputElem.innerText = `${Math.round(SystemState.metrics.throughput).toLocaleString()} ops/s`;
    if (latencyElem) latencyElem.innerText = `${SystemState.metrics.latency} ms`;
}

function updateQuantumMetricsUI() {
    const fidelityElem = document.getElementById('fidelityMetric');
    const qberElem = document.getElementById('qberMetric');
    const entangledElem = document.getElementById('entangledMetric');
    
    if (fidelityElem) fidelityElem.innerText = SystemState.metrics.fidelity;
    if (qberElem) qberElem.innerText = `${SystemState.metrics.qber}%`;
    if (entangledElem) entangledElem.innerText = `${SystemState.metrics.entangled}/${SystemState.metrics.maxQubits}`;
}

function updateCryptoMetricsUI() {
    const keysElem = document.getElementById('keysMetric');
    const attacksElem = document.getElementById('attacksMetric');
    
    if (keysElem) keysElem.innerText = SystemState.metrics.keysDistributed;
    if (attacksElem) attacksElem.innerText = SystemState.metrics.attacksBlocked;
}

function updateAllMetricsUI() {
    updateSystemMetricsUI();
    updateQuantumMetricsUI();
    updateCryptoMetricsUI();
}

function loadClusterNodes() {
    const nodesPanel = document.getElementById('nodesPanel');
    if (nodesPanel) {
        nodesPanel.innerHTML = '';
        const nodes = [
            { id: 'MASTER', ip: '192.168.1.100', status: 'ACTIVE', latency: '-' },
            { id: 'NODE-01', ip: '192.168.1.101', status: 'ACTIVE', latency: '1.2ms' },
            { id: 'NODE-02', ip: '192.168.1.102', status: 'ACTIVE', latency: '1.5ms' },
            { id: 'NODE-03', ip: '192.168.1.103', status: 'ACTIVE', latency: '1.1ms' },
            { id: 'NODE-04', ip: '192.168.1.104', status: 'ACTIVE', latency: '2.3ms' },
            { id: 'NODE-05', ip: '192.168.1.105', status: 'ACTIVE', latency: '1.8ms' }
        ];
        
        nodes.forEach(node => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'node-item';
            nodeDiv.innerHTML = `${node.id} [${node.ip}] - ${node.status} ${node.latency !== '-' ? 'heartbeat ' + node.latency : ''}`;
            nodesPanel.appendChild(nodeDiv);
        });
    }
}

function startMetricsUpdate() {
    setInterval(() => {
        updateSystemMetrics();
        updateQuantumMetrics();
    }, 2500);
}

function startAutoLogGeneration() {
    setInterval(() => {
        if (SystemState.autoGenerationActive && Math.random() > 0.7) {
            const messages = [
                { msg: 'Quantum state |ψ⟩ evolving with applied gates', type: 'quantum' },
                { msg: 'Heartbeat received from all cluster nodes', type: 'info' },
                { msg: 'Key rotation completed for quantum channel', type: 'crypto' },
                { msg: 'Error mitigation protocol executed successfully', type: 'success' }
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            addTerminalMessage(msg.msg, msg.type);
        }
    }, 8000);
}

// ============================================================
// UTILIDADES DE TERMINAL
// ============================================================

function addTerminalMessage(message, type = 'info') {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) return;
    
    const timestamp = new Date().toLocaleTimeString();
    let colorClass = 'output-info';
    
    switch(type) {
        case 'quantum': colorClass = 'output-quantum'; break;
        case 'crypto': colorClass = 'output-crypto'; break;
        case 'success': colorClass = 'output-success'; break;
        case 'warning': colorClass = 'output-warning'; break;
        case 'error': colorClass = 'output-error'; break;
        case 'highlight': colorClass = 'output-highlight'; break;
        case 'prompt': colorClass = 'output-prompt'; break;
        default: colorClass = 'output-info';
    }
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'prompt') {
        line.innerHTML = `<span class="timestamp">[${timestamp}]</span> <span class="${colorClass}">${message}</span>`;
    } else {
        line.innerHTML = `<span class="timestamp">[${timestamp}]</span> <span class="${colorClass}">${message}</span>`;
    }
    
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Limitar historial a 2000 líneas
    while (terminal.children.length > 2000) {
        terminal.removeChild(terminal.firstChild);
    }
    
    // Guardar en historial
    SystemState.terminalHistory.push({ timestamp, message, type });
    if (SystemState.terminalHistory.length > 5000) {
        SystemState.terminalHistory.shift();
    }
}

// ============================================================
// EXPORTAR MÓDULOS PARA DEPURACIÓN
// ============================================================

if (typeof window !== 'undefined') {
    window.SCSC = {
        SystemState,
        executeQuantumCircuit,
        simulateIntrusion,
        clearTerminal,
        addTerminalMessage,
        getState: () => ({ ...SystemState })
    };
}

console.log('[SCSC] Main module loaded successfully');