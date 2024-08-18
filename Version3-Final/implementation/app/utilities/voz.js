/**
 * @fileoverview Manejo de reconocimiento de voz y síntesis de voz para la web, 
 * con alertas visuales para proporcionar retroalimentación al usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Obtener elementos del DOM
    const botonVoz = document.getElementById('BotonVoz');
    const textareaResultado = document.getElementById('entradaTexto');
    let escuchando = false;
    let alertaVoz;

    // Verificar compatibilidad con el navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('El reconocimiento de voz no es compatible con este navegador.');
        mostrarAlertaTemporal("Su navegador no es compatible con el reconocimiento de voz.", 5000);

        // Asignar evento al botón para mostrar el mismo mensaje si no es compatible
        botonVoz.addEventListener('click', () => {
            mostrarAlertaTemporal("Su navegador no es compatible con el reconocimiento de voz.", 5000);
        });

        return;
    }

    // Configurar reconocimiento de voz
    const reconocimientoVoz = new SpeechRecognition();
    reconocimientoVoz.lang = 'es-ES'; // Configurar el idioma (español)
    reconocimientoVoz.interimResults = false; // Mostrar resultados parciales o no

    /**
     * Evento para manejar el clic en el botón de voz. 
     * Inicia o detiene el reconocimiento de voz y muestra alertas visuales.
     */
    botonVoz.addEventListener('click', () => {
        if (!escuchando) {
            reconocimientoVoz.start(); // Iniciar reconocimiento de voz
            escuchando = true;
            alertaVoz = mostrarAlerta("Empiece a hablar. Haga clic de nuevo en el micrófono para detener la escucha.");
        } else {
            reconocimientoVoz.stop(); // Detener reconocimiento de voz
            escuchando = false;
            if (alertaVoz) {
                alertaVoz.remove();
            }
            mostrarAlertaTemporal("Escucha detenida.");
        }
    });

    /**
     * Maneja el resultado del reconocimiento de voz y actualiza el textarea con el texto reconocido.
     * @param {SpeechRecognitionEvent} event - El evento del reconocimiento de voz que contiene los resultados.
     */
    reconocimientoVoz.onresult = function (event) {
        const resultado = event.results[0][0].transcript;
        console.log('Texto reconocido:', resultado);
        textareaResultado.value = resultado; // Mostrar texto reconocido en el textarea
    };

    /**
     * Maneja los errores durante el reconocimiento de voz.
     * @param {SpeechRecognitionErrorEvent} event - El evento de error del reconocimiento de voz.
     */
    reconocimientoVoz.onerror = function (event) {
        console.error('Error en el reconocimiento de voz:', event.error);
        escuchando = false;
        if (alertaVoz) {
            alertaVoz.remove();
        }
        mostrarAlertaTemporal("Error en el reconocimiento de voz.");
    };

    /**
     * Asegura que el reconocimiento de voz se reinicie si no se ha detenido manualmente.
     */
    reconocimientoVoz.onend = function () {
        if (escuchando) {
            reconocimientoVoz.start(); // Reiniciar el reconocimiento de voz si no se ha detenido manualmente
        }
    };

});

/**
 * Función para leer el texto de un elemento HTML en voz alta utilizando el API de síntesis de voz.
 */
function leerTexto() {
    const texto = document.getElementById('respuestaTexto').textContent;
    const synth = window.speechSynthesis;

    if (synth.speaking) {
        synth.cancel();
        alert('Lectura de texto detenida.');
    } else {
        const mensaje = new SpeechSynthesisUtterance();
        mensaje.lang = 'es-ES'; // Español de España
        mensaje.text = texto;
        synth.speak(mensaje);
        mostrarAlertaTemporal('Leyendo el texto. Haga clic de nuevo para detener.');
    }
}

/**
 * Muestra una alerta persistente en la pantalla con el mensaje proporcionado.
 * @param {string} mensaje - El mensaje a mostrar en la alerta.
 * @returns {HTMLElement} - El elemento de la alerta que se crea.
 */
function mostrarAlerta(mensaje) {
    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.style.position = 'fixed';
    alerta.style.left = '50%';
    alerta.style.top = '1px';
    alerta.style.transform = 'translateX(-50%)';
    alerta.style.backgroundColor = '#5BC1FB';
    alerta.style.color = '#000';
    alerta.style.fontWeight = 'bold';
    alerta.style.padding = '10px 20px';
    alerta.style.borderRadius = '5px';
    alerta.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    alerta.style.zIndex = '9999';
    alerta.style.opacity = '0';
    alerta.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(alerta);

    setTimeout(function () {
        alerta.style.opacity = '1';
    }, 100);

    return alerta;
}

/**
 * Muestra una alerta temporal en la pantalla con el mensaje proporcionado y una duración específica.
 * @param {string} mensaje - El mensaje a mostrar en la alerta.
 * @param {number} [duracion=2000] - La duración de la alerta en milisegundos.
 */
function mostrarAlertaTemporal(mensaje, duracion = 2000) {
    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.style.position = 'fixed';
    alerta.style.left = '50%';
    alerta.style.top = '1px';
    alerta.style.transform = 'translateX(-50%)';
    alerta.style.backgroundColor = '#5BC1FB';
    alerta.style.color = '#000';
    alerta.style.fontWeight = 'bold';
    alerta.style.padding = '10px 20px';
    alerta.style.borderRadius = '5px';
    alerta.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    alerta.style.zIndex = '9999';
    alerta.style.opacity = '0';
    alerta.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(alerta);

    setTimeout(function () {
        alerta.style.opacity = '1';
    }, 100);

    setTimeout(function () {
        alerta.style.opacity = '0';
        setTimeout(function () {
            alerta.remove();
        }, 300);
    }, duracion);
}
