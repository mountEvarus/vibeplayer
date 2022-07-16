import { renderFrame } from "./waveform.js"

export function initialiseVisualiser(audio, audioContext) {
  const { analyser, canvas } = setupWiring(audio, audioContext)
  
  renderFrame(analyser, canvas)
}

function setupWiring(audio, audioContext) {
  audioContext = new AudioContext()
  const source = audioContext.createMediaElementSource(audio)
  const analyser = audioContext.createAnalyser()
  const canvas = document.querySelector(".visualiser")

  source.connect(analyser)
  analyser.connect(audioContext.destination)

  return { analyser, canvas }
}
