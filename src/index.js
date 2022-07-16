const { read } = window.jsmediatags

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

function updateMediaData(src) {
  const details = document.querySelector(".details")
  const cover = document.querySelector(".cover")

  read(src, {
    onSuccess: (data) => {
      details.innerText = `${data.tags.title ?? "Unknown"} by ${data.tags.artist ?? "unkown"}`
      cover.src = getImage(data.tags.picture)
    },
  })
}

function getImage(image) {
  if (image) {
    let base64String = ""
    for (let i = 0; i < image.data.length; i++) {
      base64String += String.fromCharCode(image.data[i])
    }
    return "data:" + image.format + ";base64," + window.btoa(base64String)
  } else return "./assets/no-artwork.png"
}

function updateSourceAndPlay(src) {
  const audio = document.querySelector(".audioElement")
  audio.src = src

  audio.play().catch((e) => {
    console.log(`Failed to play audiofile becasue ${e.message}`)
  })
}

init()
