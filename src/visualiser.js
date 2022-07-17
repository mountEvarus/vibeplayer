import { renderFrame } from "./waveform.js"

let analyser = null

export function initialiseVisualiser(audio) {
  setupWiring(audio)
  
  const canvas = document.querySelector(".visualiser")
  renderFrame(analyser, canvas)
}

function setupWiring(audio) {

  try {
    window.vibe.audioContext = new AudioContext()
    const audioContext = window.vibe.audioContext
    const source = audioContext.createMediaElementSource(audio)
    analyser = audioContext.createAnalyser()

    source.connect(analyser)
    analyser.connect(audioContext.destination)
  } catch(e) {
    const message = `Failed to initialise audio context becasue: ${e.message}`
    // eslint-disable-next-line no-console
    console.error(message)
    alert(message)
  }
}
