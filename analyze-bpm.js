const fs = require("fs")
const wav = require("wav-decoder")
const MusicTempo = require("music-tempo")

// Leer archivo WAV
const buffer = fs.readFileSync("./Libre_Soy_Barak.wav")

wav.decode(buffer).then(audioData => {
  const channelData = audioData.channelData[0] // Solo usamos el canal izquierdo
  const mt = new MusicTempo(channelData)

  console.log("⏱️ BPM promedio:", mt.tempo)

  // Generar tiempos de nota
  const duracionNota = 60000 / mt.tempo
  const duracionCancionMs = audioData.length / audioData.sampleRate * 1000

  const tiemposNotas = []
  for (let t = 0; t < duracionCancionMs; t += duracionNota) {
    tiemposNotas.push(Math.round(t))
  }

  // Guardar archivo .json
  fs.writeFileSync("tiemposNotasL.json", JSON.stringify(tiemposNotas, null, 2))
  console.log("✅ Archivo tiemposNotas.json generado con", tiemposNotas.length, "notas")
})
