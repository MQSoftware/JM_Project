const estadoBotones = {}
let activo = 0
let puntos = 0
let combos = 0
const cancion = document.getElementById("cancion")
const tiemposNotas = [1000, 2000, 3000, 4500, 6000] // Tiempos en ms cuando caen las notas
let indiceNota = 0
let juegoActivo = false

// Función para iniciar el juego y la canción
function iniciarJuego() {
    console.log("El juego ha iniciado");
    if (juegoActivo) return // Evitar que se inicie dos veces

    cancion.play()
    juegoActivo = true
    indiceNota = 0
    puntos = 0
    combos = 0
    actualizarPuntajes()

    // Ocultar botón de iniciar
    document.getElementById("play").style.display = "none"

    // Generar la primera nota de inmediato
    generaActivoAleatorio()
}

// Genera una nueva nota según la canción
function generaActivoAleatorio() {
    if (indiceNota < tiemposNotas.length) {
        activo = Math.floor(Math.random() * 4) // Número aleatorio entre 0 y 3
        document.querySelector("#botones").className = `boton-${activo}`
        actualizarPuntajes()

        // Programar la siguiente nota
        indiceNota++
        if (indiceNota < tiemposNotas.length) {
            setTimeout(generaActivoAleatorio, tiemposNotas[indiceNota] - tiemposNotas[indiceNota - 1])
        }
    }
}

// Función para actualizar los puntajes en la pantalla
function actualizarPuntajes() {
    document.querySelector("#puntos").textContent = `Puntos: ${puntos}`
    document.querySelector("#combos").textContent = `Combo: ${combos}`
}

// Función que maneja la pulsación de un botón
function botonPulsado(id) {
    if (!juegoActivo) return // Evitar que se pulsen botones antes de iniciar

    if (id === activo) {
        combos++
        const puntosASumar = Math.min(combos, 5)
        puntos += puntosASumar
        document.querySelector("#booster").textContent = "x" + puntosASumar
    } else {
        combos = 0
        document.querySelector("#booster").textContent = "x1"
    }
    actualizarPuntajes()
}

// Asignar eventos a los botones y el teclado
document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".boton")
    botones.forEach((boton, index) => {
        boton.addEventListener("click", () => botonPulsado(index))
    })

    document.addEventListener("keydown", (event) => {
        const teclas = ["a", "s", "d", "f"]
        const index = teclas.indexOf(event.key)
        if (index !== -1) {
            botonPulsado(index)
        }
    })

    // Iniciar juego al hacer clic en el botón de play
    document.getElementById("play").addEventListener("click", iniciarJuego)
})
