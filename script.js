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
  activo = Math.floor(Math.random() * 4)
  const nota = document.createElement("div")
  nota.classList.add("nota", `boton-${activo}`)
  nota.dataset.boton = activo
  nota.dataset.id = index
  nota.style.animation = `caer ${DURACION_CAIDA}ms linear forwards`

  nota.addEventListener("animationend", () => {
    nota.remove()
  })

  document.getElementById("contenedor-notas").appendChild(nota)
  notas.push({ id: index, boton: activo })
}

function botonPulsado(id) {
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
  fetch("tiemposNotas.json")
    .then(res => res.json())
    .then(data => {
      tiemposNotas = data
      console.log("🎵 Notas cargadas:", tiemposNotas.length)
    })
    .catch(err => {
      console.error("Error cargando tiemposNotas.json:", err)
    })
})
