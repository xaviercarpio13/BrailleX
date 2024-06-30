/**
 * voz.js
 * 
 * Este script maneja la funcionalidad de reconocimiento de voz y síntesis de voz
 * para el traductor.
 */

// Sección para el reconocimiento de voz
document.addEventListener('DOMContentLoaded', () => {
    // Obtener elementos del DOM
    const botonVoz = document.getElementById('BotonVoz');
    const textareaResultado = document.getElementById('entradaTexto');

    // Configurar reconocimiento de voz
    const reconocimientoVoz = new webkitSpeechRecognition();
    reconocimientoVoz.lang = 'es-ES'; // Configurar el idioma (español)
    reconocimientoVoz.interimResults = false; // Mostrar resultados parciales o no

    // Evento al hacer clic en el botón de voz
    botonVoz.addEventListener('click', () => {
        reconocimientoVoz.start(); // Iniciar reconocimiento de voz
    });

    // Manejar el resultado del reconocimiento de voz
    reconocimientoVoz.onresult = function (event) {
        const resultado = event.results[0][0].transcript;
        console.log('Texto reconocido:', resultado);
        textareaResultado.value = resultado; // Mostrar texto reconocido en el textarea
    };

    // Manejar errores en el reconocimiento de voz
    reconocimientoVoz.onerror = function (event) {
        console.error('Error en el reconocimiento de voz:', event.error);
    };
});

