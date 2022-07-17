import { getPaletteColor } from "./color.js"

export function renderFrame (analyser, canvas) {
  const ctx = canvas.getContext("2d")
  ctx.canvas.width = window.innerWidth - 10
  ctx.canvas.height = window.innerHeight - 10
  ctx.fillStyle= "#000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const setFftSize = document.querySelector(".fftSize").value
  analyser.fftSize = setFftSize

  drawWaveform(analyser, canvas)
}

function drawWaveform(analyser, canvas) {
  const ctx = canvas.getContext("2d")
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteFrequencyData(dataArray)

  requestAnimationFrame(() => renderFrame(analyser, canvas))

  const waveformShape = document.querySelector(".waveform").value
  switch(waveformShape) {
    case "bar":
      spectrumWaveform("bar")
      break
    case "static":
      spectrumWaveform("static")
      break
    default:
      circularWaveform()
  }


  function circularWaveform() {
    let radius = (canvas.width / 15)
  
    for (let i = 0; i < bufferLength; i++) {
      const radians = (Math.PI * 2) / bufferLength
      const bar_height = ((dataArray[i] / 255) * canvas.width) / 5
      const x = canvas.width / 2 + Math.cos(radians * i) * radius
      const y = canvas.height / 2 + Math.sin(radians * i) * radius
      const x_end = canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height)
      const y_end = canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height)
      const color = (dataArray[i]) + (25 * i/bufferLength)

      ctx.strokeStyle = getPaletteColor(color)
      ctx.lineWidth = (canvas.width / bufferLength)*2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x_end, y_end)
      ctx.stroke()
    }
  }

  function spectrumWaveform(type = "bar") {
    const barWidth = (canvas.width / bufferLength)

    let bar = 0

    for (let i = 0; i < bufferLength; i++) {
      let barHeight = (dataArray[i] / 255) * canvas.height
      const color = dataArray[i] + (25 * (i/bufferLength))
      ctx.fillStyle = getPaletteColor(color)

      ctx.fillRect(bar, canvas.height - barHeight, barWidth, type === "bar" ? barHeight : barWidth) 
      bar += barWidth
    }
  }
}
