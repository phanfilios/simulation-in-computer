// Script de post-procesamiento después del empaquetado
exports.default = async function(context) {
    console.log(' Post-procesando aplicación...');
    console.log(' Platform:', context.electronPlatformName);
    console.log(' Output:', context.appOutDir);
    
    // Aquí puedes agregar lógica post-build
    // Por ejemplo: firmar el ejecutable, copiar archivos adicionales, etc.
};