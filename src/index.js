import { updateMediaData } from "./media-tags.js"
import { initialiseVisualiser } from "./visualiser.js"

window.vibe = {}
window.vibe.audioContext = null

function init() {
  const input = document.querySelector("input")
  input.addEventListener("change", handleUpload)
}

function handleUpload() {
  const file = document.querySelector("input").files[0]
  const fileSrc = window.URL.createObjectURL(file)

  updateMediaData(file)
  updateSourceAndPlay(fileSrc)
}

function updateSourceAndPlay(src) {
  const audioContext = window.vibe.audioContext
  const audio = document.querySelector(".audioElement")
  audio.src = src

  if(!audioContext) {
    initialiseVisualiser(audio)
  }

  if (!audio.paused) {
    audio.pause()
  }

  audio.play().catch((e) => {
    const message = `Failed to play audiofile becasue: ${e.message}`
    // eslint-disable-next-line no-console
    console.error(message)
    alert(message)
  })
}

init()
