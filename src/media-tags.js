const { read } = window.jsmediatags

export function updateMediaData(src) {
  const details = document.querySelector(".details")
  const cover = document.querySelector(".cover")

  read(src, {
    onSuccess: (data) => {
      details.innerHTML = `<b>${data.tags.title ?? "Unknown"}</b> by <b>${data.tags.artist ?? "unkown"}</b>`
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
