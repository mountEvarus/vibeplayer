export function getPaletteColor(color) {
  const currentPalette = document.querySelector(".palette").value

  switch(currentPalette) {
    case "violentRed":
      return `rgb(209, ${100-(color*0.5)}, ${100-(color*0.5)})`
    case "jungleGreen":
      return `rgb(163, 240, ${color*0.5})`
    case "iceBlue":
      return `rgb(${color+30}, ${color+30}, 219)`
    case "redFade":
      return `rgb(${color}, 0, 0)`
    case "greenFade":
      return `rgb(0, ${color}, 0)`
    case "blueFade":
      return `rgb(0, 0, ${color})`
    case "solidWhite":
      return "white"
    case "monochrome":
      return `rgb(${color}, ${color}, ${color})`
    case "autumn":
      return `rgb(150, ${color}, 50)`
    case "lilac":
      return `rgb(150, ${color*0.5}, 150)`
    case "roseGold":
      return `rgb(250, 150, ${color*0.5})`
    case "rainbow":
      return `hsl(${color*1.5}, 100%, 50%)`
    default:
      return `rgb(50, ${color+50}, 200)`
  }
}
