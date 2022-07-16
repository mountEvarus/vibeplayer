import { updateMediaData } from "./media-tags.js"
import { initialiseVisualiser } from "./visualiser.js"

const { read } = window.jsmediatags
let audioContext = null

function init() {
  const input = document.querySelector("input")
  input.addEventListener("change", handleUpload)
}

function handleUpload() {
  const input = document.querySelector("input")
  const fileSrc = window.URL.createObjectURL(input.files[0])

  updateMediaData(input.files[0])
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
