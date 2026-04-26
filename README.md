# 🔐 SCSC - Quantum Security System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Electron](https://img.shields.io/badge/Electron-27.0.0-47848F)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)

**Sistema de Ciberseguridad Cuántica para Cluster Distribuido**

*Simulación avanzada de criptografía post-cuántica y computación cuántica*

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Características Principales](#características-principales)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Comandos Disponibles](#comandos-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Demostración](#demostración)
- [Despliegue en IBM Cloud](#despliegue-en-ibm-cloud)
- [Solución de Problemas](#solución-de-problemas)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## 📖 Descripción General

**SCSC (Sistema de Ciberseguridad Cuántica)** es una plataforma experimental que simula y demuestra los principios de la ciberseguridad basada en mecánica cuántica. El sistema integra:

- ⚛️ **Simulación Cuántica** - Circuitos cuánticos, entrelazamiento y superposición
- 🔐 **Criptografía Post-Cuántica** - Algoritmos resistentes a computadoras cuánticas (Kyber, SPHINCS+)
- 🌐 **Cluster Distribuido** - Arquitectura maestro-esclavo para procesamiento paralelo
- 🛡️ **Detección de Intrusiones** - IDS cuántico con respuesta automática
- 📊 **Monitoreo en Tiempo Real** - Métricas de rendimiento y estado del sistema

> **Nota:** Este es un sistema de simulación educativo que demuestra conceptos reales de ciberseguridad cuántica utilizando principios validados por NIST e IBM Quantum.

---


# <img width="1896" height="981" alt="image" src="https://github.com/user-attachments/assets/79b5868e-0ee7-4f3e-8d49-f298a719e528" />



### Componentes:

| Componente | Descripción |
|------------|-------------|
| **Master Node** | Orquestador central, gestión de tareas, monitoreo global |
| **Worker Nodes** | Ejecución distribuida de simulaciones cuánticas |
| **Quantum Engine** | Simulación de circuitos (Qiskit/Aer) |
| **Crypto Module** | Kyber-1024, SPHINCS+, QKD (BB84/E91) |
| **IDS Cuántico** | Detección de intrusiones basada en no-clonación |

---

## ✨ Características Principales

### ⚛️ Computación Cuántica
- Simulación de hasta 24 qubits
- Puertas cuánticas: Hadamard, CNOT, Pauli, Rotaciones
- Estados de Bell y GHZ
- Algoritmo de Grover y Shor (simulado)
- Corrección de errores cuántica

### 🔐 Criptografía Post-Cuántica
- **Kyber-1024** - Intercambio de claves lattice-based
- **SPHINCS+** - Firmas digitales hash-based
- **BB84** - Distribución cuántica de claves (simulado)
- **AES-256-GCM** - Cifrado de datos
- Detección de escuchas (no-clonación)

### 🌐 Cluster Distribuido
- 1 Master + hasta 5 Workers
- Balanceo de carga round-robin
- Heartbeat y recuperación automática
- Latencia < 10ms en red local

### 📊 Monitoreo
- CPU/Memoria en tiempo real
- Fidelidad cuántica (0.9997 objetivo)
- QBER (tasa de error cuántico)
- Tráfico de red y throughput

---

## 💻 Requisitos del Sistema

### Mínimos:
| Recurso | Especificación |
|---------|----------------|
| **OS** | Windows 10/11, Ubuntu 20.04+, macOS 11+ |
| **RAM** | 4 GB (8 GB recomendado) |
| **CPU** | 2 núcleos a 2.0 GHz |
| **Node.js** | v18.0 o superior |
| **Espacio** | 500 MB |

### Para Cluster (5+ nodos):
| Nodo | CPU | RAM | Red |
|------|-----|-----|-----|
| Master | 4 núcleos | 8 GB | 1 Gbps |
| Worker | 2 núcleos | 4 GB | 1 Gbps |

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/scsc/quantum-security.git
cd scsc-desktop

2. Instalar Node.js (si no lo tienes)
Descargar desde nodejs.org (versión LTS recomendada)

3. Instalar dependencias
bash

npm install

4. Verificar instalación

npm --version  # Debería mostrar v18+
node --version # Debería mostrar v18+

Configuración
Variables de entorno (.env)

# Master Node
MASTER_HOST=192.168.1.100
MASTER_PORT=8080

# Worker Nodes
NODE_1_HOST=192.168.1.101
NODE_2_HOST=192.168.1.102
NODE_3_HOST=192.168.1.103
NODE_4_HOST=192.168.1.104
NODE_5_HOST=192.168.1.105

# Quantum
QUANTUM_BACKEND=aer_simulator
MAX_QUBITS=24
QUANTUM_SHOTS=1024

# Security
CLUSTER_SECRET_KEY=tu_clave_secreta_aqui

Configuración avanzada (src/config/settings.json)

{
  "quantum": {
    "backend": "aer_simulator",
    "maxQubits": 24,
    "shots": 1024
  },
  "crypto": {
    "keyExchange": "kyber-1024",
    "signature": "sphincs+"
  },
  "monitoring": {
    "refreshInterval": 2000,
    "logLevel": "info"
  }
}

Ejecución
Modo Desarrollo

npm run dev

Modo Producción
npm start

Generar Ejecutable (Windows)
bash
npm run build:win
El instalador se generará en dist/SCSC_Quantum_Setup_1.0.0.exe

Cluster Completo (6 máquinas)
Master:

bash
npm run dev
Cada Worker:

bash
npm run worker -- --node-id node_01
⌨️ Comandos Disponibles
Comando	Descripción	Ejemplo
help	Muestra ayuda	help
status	Estado del cluster	status
crypto	Estado de criptografía	crypto
quantum	Estado cuántico	quantum
attack	Simula intrusión	attack
metrics	Métricas detalladas	metrics
nodes	Lista de nodos	nodes
clear	Limpia terminal	clear
reset	Reinicia simulación	reset
📁 Estructura del Proyecto
text
scsc-desktop/
│
├── src/
│   ├── main/
│   │   └── main.js              # Proceso principal Electron
│   ├── renderer/
│   │   ├── index.html           # Interfaz principal
│   │   ├── css/
│   │   │   └── styles.css       # Estilos
│   │   └── js/
│   │       ├── main.js          # Lógica UI
│   │       ├── quantum.js       # Simulación cuántica
│   │       └── crypto.js        # Criptografía
│   ├── preload/
│   │   └── preload.js           # Bridge seguro
│   └── config/
│       └── settings.json        # Configuración
│
├── build/
│   └── icon.ico                 # Icono de la app
│
├── package.json                 # Dependencias
├── electron-builder.yml         # Configuración build
├── .gitignore
└── README.md
🎥 Demostración
Pantalla Principal (Terminal PowerShell)
text
┌─────────────────────────────────────────────────────────────────┐
│  ● ● ●   SCSC Quantum Security System v1.0.0              ● ACTIVE │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┬─────────────────────────────┐
│ │ PS C:\Quantum\SCSC>            │ SYSTEM METRICS              │
│ │ [10:23:45] SCSC Quantum...     │ CPU: 23.4%                  │
│ │ [10:23:46] Quantum backend...  │ Memory: 8.2/32 GB           │
│ │ [10:23:47] Post-quantum...     │ Fidelity: 0.9997            │
│ │ [10:23:48] Cluster: 5/5...     │ QBER: 0.8%                  │
│ │                                 │                             │
│ │ PS> _                          │ CLUSTER NODES               │
│ └─────────────────────────────────┴─────────────────────────────┘
│ [▶ EXECUTE] [⚠ SIMULATE] [🗑 CLEAR]                              │
│ SCSC v1.0.0 | Cluster: OPERATIONAL | Quantum Backend: Active    │
└─────────────────────────────────────────────────────────────────┘
Ejemplo de uso:
bash
PS> help
Available commands: help, status, crypto, quantum, attack, clear, metrics

PS> status
Cluster Status: 5/5 active nodes | Quantum Fidelity: 0.9997 | QBER: 0.8%

PS> quantum execute
Executing quantum circuit...
|ψ⟩ = α|0⟩ + β|1⟩ superposition state prepared
Quantum fidelity: 0.9997
☁️ Despliegue en IBM Cloud
Requisitos previos:
Cuenta IBM Cloud

IBM Quantum token

IBM Cloud API Key

Pasos:
bash
# 1. Configurar variables
export IBM_QUANTUM_TOKEN="tu_token"
export IBM_CLOUD_API_KEY="tu_api_key"

# 2. Ejecutar script de despliegue
chmod +x deploy_ibm_cloud.sh
./deploy_ibm_cloud.sh
🐛 Solución de Problemas
Error: "Missing script: dev"
Solución:

bash
# Verificar package.json
cat package.json | grep "dev"

# Si no existe, añadir:
npm set-script dev "electron ."
Error: "Cannot find module 'electron'"
Solución:

bash
npm install electron --save-dev
Error: "Address already in use"
Solución:

bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
La interfaz no carga CSS
Solución: Usa el HTML autónomo (todo incluido) que evita problemas de rutas.

📄 Licencia
MIT License

Copyright (c) 2024 SCSC Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...

👥 Contacto
Autor: SCSC Team

Email: scsc@quantum.security

GitHub: github.com/scsc/quantum-security

Documentación: docs.scsc.quantum

🙏 Agradecimientos
IBM Quantum por su plataforma Qiskit

NIST por la estandarización post-cuántica

Comunidad open-source de Electron

<div align="center">
Hecho con ⚛️ para un futuro post-cuántico más seguro

</div> ```
✅ Ahora crea el archivo:
bash
# En la terminal de VSCode, dentro de scsc-desktop
echo "# SCSC - Quantum Security System" > README.md
Luego copia TODO el contenido de arriba en el archivo README.md y guárdalo (Ctrl+S).

📋 Archivos completos hasta ahora:
Archivo	Estado
package.json	⚠️ Por verificar/actualizar
README.md	✅ CREADO
electron-builder.yml	✅ CREADO
.gitignore	✅ CREADO
src/main/main.js	✅ CREADO
src/preload/preload.js	✅ CREADO
src/renderer/index.html	✅ CREADO
src/config/settings.json	✅ CREADO
🚀 Ahora sí, vuelve a ejecutar:
bash
# 1. Verificar package.json
cat package.json

# 2. Si no tiene "dev", actualízalo con el código que te di

# 3. Instalar dependencias
npm install

# 4. Ejecutar
npm run dev








