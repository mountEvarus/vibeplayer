import { updateMediaData } from "./media-tags.js"
import { initialiseVisualiser } from "./visualiser.js"

let audioContext = null

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
  const audio = document.querySelector(".audioElement")
  audio.src = src

  if(!audioContext) {
    initialiseVisualiser(audio, audioContext)
  }

  audio.play().catch((e) => {
    console.log(`Failed to play audiofile becasue ${e.message}`)
  })
}

init()
