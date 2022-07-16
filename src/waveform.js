export function renderFrame (analyser, canvas) {
  const ctx = canvas.getContext("2d")
  // TODO - accurate sizing
  ctx.canvas.width = window.innerWidth - 10
  ctx.canvas.height = window.innerHeight - 10
  ctx.fillStyle= "#000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // TODO static & default waveforms
  circularWaveform(analyser, canvas)
}


function circularWaveform(analyser, canvas) {
  const ctx = canvas.getContext("2d")
  // TODO - dynamic FFT
  analyser.fftSize = 1024
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  requestAnimationFrame(() => renderFrame(analyser, canvas))
  let radius = 150
  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0 , 2 * Math.PI)
  ctx.stroke()
  analyser.getByteFrequencyData(dataArray)
  
  for (let i = 0; i < bufferLength; i++) {
    const radians = (Math.PI * 2) / bufferLength
    // TODO - variable / more accurate?
    const bar_height = (dataArray[i] * 0.75)
    const x = canvas.width / 2 + Math.cos(radians * i) * radius
    const y = canvas.height / 2 + Math.sin(radians * i) * radius
    const x_end = canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height)
    const y_end = canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height)
    const color = (dataArray[i]) + (25 * i/bufferLength)

    // TODO - dynamic color
    ctx.strokeStyle = `rgb(50, ${color+50}, 200)`
    ctx.lineWidth = (canvas.width / bufferLength)*2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x_end, y_end)
    ctx.stroke()
  }
}
