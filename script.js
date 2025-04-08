const cancion = document.getElementById("cancion")
const DURACION_CAIDA = 3000 // ms
let indiceNota = 0
let puntos = 0
let combos = 0
let activo = -1
let notas = []
let tiemposNotas = []

function iniciarJuego() {
  cancion.play()
  indiceNota = 0
  puntos = 0
  combos = 0
  activo = -1
  document.getElementById("play").style.display = "none"
  actualizarPuntajes()
  programarNotas()
}

function programarNotas() {
  tiemposNotas.forEach((tiempo, i) => {
    const tiempoLanzamiento = tiempo - DURACION_CAIDA
    if (tiempoLanzamiento >= 0) {
      setTimeout(() => lanzarNota(i), tiempoLanzamiento)
    }
  })
}

function lanzarNota(index) {
  const botones = document.querySelectorAll(".boton")
  const botonAsignado = Math.floor(Math.random() * botones.length) // Elige un botón al azar
  const rect = botones[botonAsignado].getBoundingClientRect() // Obtiene la posición del botón
  const colores = ["blue", "green", "red", "yellow"]

  const nota = document.createElement("div")
  nota.classList.add("nota")
  nota.dataset.boton = botonAsignado
  nota.dataset.id = index
  nota.style.backgroundColor = colores[botonAsignado]

  // Posiciona la nota centrada sobre el botón correspondiente
  nota.style.left = `${rect.left + rect.width / 2 - 42.5}px` // Centra la nota sobre el botón
  nota.style.animation = `caer ${DURACION_CAIDA}ms linear forwards`

  nota.addEventListener("animationend", () => {
    nota.remove()
  })

  document.getElementById("contenedor-notas").appendChild(nota)
  notas.push({ id: index, boton: botonAsignado })
}

function resaltarBoton(index) {
  const boton = document.getElementById(`boton-${index}`)
  boton.classList.add("brillar")
  setTimeout(() => boton.classList.remove("brillar"), 200)
}


function botonPulsado(id) {
  //Función resaltar boton
  resaltarBoton(id)

  const nota = notas.find(n => n.boton == id)
  if (nota) {
    notas = notas.filter(n => n.id !== nota.id)
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

function actualizarPuntajes() {
  document.querySelector("#puntos").textContent = `Puntos: ${puntos}`
  document.querySelector("#combos").textContent = `Combo: ${combos}`
}

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

  document.getElementById("play").addEventListener("click", iniciarJuego)

  // Cargar el archivo tiemposNotas.json
  fetch("tiemposNotasL.json")
    .then(res => res.json())
    .then(data => {
      tiemposNotas = data
      console.log("🎵 Notas cargadas:", tiemposNotas.length)
    })
    .catch(err => {
      console.error("Error cargando tiemposNotas.json:", err)
    })
})

// Evento que se activa al faltar 4.7 segundos de la cancion(lo que dura el GIF)
// Evento que se activa cuando se conoce la duración de la canción
cancion.addEventListener("loadedmetadata", () => {
  const duracion = cancion.duration
  const momentoMostrar = duracion - 4.1

  if (momentoMostrar > 0) {
    setTimeout(() => {
      const gifCadena = document.getElementById("cadena")
      if (gifCadena) {
        gifCadena.style.display = "block"

        // Se oculta después de 4.7 segundos (duración del GIF)
        setTimeout(() => {
          gifCadena.style.display = "none"
        }, 4100)
      }
    }, momentoMostrar * 1000) // convertir a milisegundos
  }
})


