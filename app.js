const musicObjArr = [
    { url: "./assets/songs/back_n_forth.mp3", name: "Back 'n Forth"},
    { url: "./assets/songs/i_kill_for_fun.mp3", name: "I Kill For Fun"},
    { url: "./assets/songs/crawl.flac", name: "Crawl"},
    { url: "./assets/songs/crack_rock.mp3", name: "Crack Rock"},
    { url: "./assets/songs/chapter_6.mp3", name: "Chapter Six"},
    { url: "./assets/songs/my_only_one.flac", name: "My Only One"}
];
const optionsArr = [
    {type: "colorOption", name: "Default"},
    {type: "colorOption", name: "Violent Red"},
    {type: "colorOption", name: "Jungle Green"},
    {type: "colorOption", name: "Ice Blue"},
    {type: "colorOption", name: "Red Fade"},
    {type: "colorOption", name: "Green Fade"},
    {type: "colorOption", name: "Blue Fade"},
    {type: "colorOption", name: "Solid White"},
    {type: "colorOption", name: "Monochrome"},

    {type: "colorOption", name: "Autumn"},
    {type: "colorOption", name: "Lilac"},
    {type: "colorOption", name: "Rose Gold"},

    {type: "waveformOption", name:"Default"},
    {type: "waveformOption", name: "Circular"}
    // DOTS/SINE WAVE
];

let fftSize = 512;
let colorConfig = null;
let audioContext = null;
const audioPlayer = document.querySelector(".audioPlayer");

// Loading in songs:
const loadSongData = (element) => {
    musicObjArr.forEach(musicObj => {
        const songName = document.createElement("a");
        songName.innerHTML = musicObj.name;
        songName.href = musicObj.url;
        songName.classList.add("songListItem");
        element.appendChild(songName);
    });
}

// Loading in options:
const loadWaveformColorOptions = (element1, element2) => {
    optionsArr.forEach(option => {
        const newOption = document.createElement("option");
        newOption.innerHTML = option.name;

        if (option.type === "colorOption") {
            element1.appendChild(newOption);
        } else if (option.type === "waveformOption") {
            element2.appendChild(newOption);
        }
    });
}

// Audio Player:
const audioElement = document.createElement("audio");
audioElement.classList.add("audioElement");
const player = document.createElement("section");
audioPlayer.append(audioElement);
audioPlayer.appendChild(player);
loadSongData(player);

// Canvas/Visualizer:
const canvas = document.createElement("canvas");
audioPlayer.appendChild(canvas);

// Waveform Options:
const colorOptions = document.createElement("select");
const colorOptionsLabel = document.createElement("label");
colorOptionsLabel.innerHTML = "Pick a Theme!"
const waveformOptions = document.createElement("select");
const waveformOptionsLabel = document.createElement("label");
waveformOptionsLabel.innerHTML = "Pick a Waveform Style (INACTIVE)"
loadWaveformColorOptions(colorOptions, waveformOptions);

const options = document.createElement("section");
options.append(colorOptionsLabel);
options.append(colorOptions);
options.append(waveformOptionsLabel);
options.append(waveformOptions);

audioPlayer.appendChild(options);

// Visualizer:
const createVisualiser = () => {
    audioContext = new AudioContext();
    const src = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();
    const ctx = canvas.getContext("2d");
    src.connect(analyser);
    analyser.connect(audioContext.destination);

    // 2048, 1024, 512, 256, 128, 64? - make it a choice!
    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width / bufferLength) * 2.5;
    
    const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        let bar = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle= "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i] - 125;
            const color = barHeight + (25 * (i/bufferLength));

            // switch/case with colorConfig;
            switch(colorConfig) {
                case "Violent Red":
                    ctx.fillStyle = `rgb(209, ${100-(color)}, ${100-(color)})`;
                    break;
                case "Jungle Green":
                    ctx.fillStyle = `rgb(163, 240, ${color})`;
                    break;
                case "Ice Blue":
                    ctx.fillStyle = `rgb(50, ${color+50}, 200)`;
                    break;
                case "Red Fade":
                    ctx.fillStyle = `rgb(${color+30}, 30, 30)`;
                    break;
                case "Green Fade":
                    ctx.fillStyle = `rgb(30, ${color+30}, 30)`;
                    break;
                case "Blue Fade":
                    ctx.fillStyle = `rgb(30, 30, ${color+30})`;
                    break;
                case "Solid White":
                    ctx.fillStyle = `white`;
                    break;
                case "Monochrome":
                    ctx.fillStyle = `rgb(${color+80}, ${color+80}, ${color+80})`;
                    break;
                case "Autumn":
                    ctx.fillStyle = `rgb(150, ${color}, 50)`;
                    break;
                case "Lilac":
                    ctx.fillStyle = `rgb(150, ${color}, 150)`;
                    break;
                case "Rose Gold":
                    ctx.fillStyle = `rgb(250, 150, ${color})`;
                    break;
                default:
                    ctx.fillStyle = `rgb(${color+30}, ${color+30}, 219)`;
            }


            ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
            bar += barWidth + 2;
        }
    }
    renderFrame();
}

// Playing/Pausing songs:
const loadedSongList = document.querySelectorAll(".songListItem");
loadedSongList.forEach(listItem => {
    listItem.addEventListener("click", (e) => {
        e.preventDefault();

        if (!audioContext) {
            createVisualiser();
        }

        const isCurrentAudio = listItem.href == audioElement.src;

        if (!isCurrentAudio) {
            audioElement.src = listItem.href
            audioElement.play();
        } else if (isCurrentAudio && !audioElement.paused) {
            audioElement.pause();
        } else if (isCurrentAudio && audioElement.paused) {
            audioElement.play();
        }
    });
});

// Changing colors:
colorOptions.addEventListener("change", (e) => {
    colorConfig = e.target.value;
})


// Music sorting
// By normal tags (Artist,song name, etc)
// Grouping (Like in musicBee)
// By cover (analyse covers and sort by rbg scale)