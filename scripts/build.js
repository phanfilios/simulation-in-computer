const { build } = require('electron-builder');
const packageJson = require('../package.json');

console.log(' Iniciando construcción de SCSC Quantum Security...');
console.log(` Versión: ${packageJson.version}`);

build({
    config: {
        ...packageJson.build,
        publish: null
    }
})
.then(() => {
    console.log(' Build completado exitosamente!');
    console.log(' Ejecutable ubicado en: dist/');
})
.catch(err => {
    console.error(' Error durante el build:', err);
    process.exit(1);
});