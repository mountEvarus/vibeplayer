const musicObjArr = [
    { url: "./assets/songs/back_n_forth.mp3", name: "Back 'n Forth"},
    { url: "./assets/songs/hurricane.mp3", name: "Hurricane"},
    { url: "./assets/songs/fake_pods.mp3", name: "Fake Pods"},
    { url: "./assets/songs/crack_rock.mp3", name: "Crack Rock"},
    { url: "./assets/songs/chapter_6.mp3", name: "Chapter Six"},
    { url: "./assets/songs/my_only_one.flac", name: "My Only One"},
    { url: "./assets/songs/blessings.mp3", name: "Blessings"},
    { url: "./assets/songs/feel_the_love.flac", name: "Feel The Love"},
    { url: "./assets/songs/she.mp3", name: "She"},
];
const optionsArr = [
    {type: "colorOption", name: "Northern Lights"},
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
    {type: "colorOption", name: "Rainbow"},
    {type: "waveformOption", name:"Spectrum"},
    {type: "waveformOption", name:"Static"},
    {type: "waveformOption", name: "Eclipse"}
    // DOTS/SINE WAVE
];

let colorConfig = null;
let waveformConfig = null;
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

// CURRENT VERSION NOTE:
const currentVersion = document.createElement("p");
currentVersion.style.position = "fixed";
currentVersion.style.bottom = "20px";
currentVersion.style.right = "20px";
currentVersion.style.color = "white";
currentVersion.innerHTML = "Version a1.0"
audioPlayer.append(currentVersion);

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
colorOptionsLabel.innerHTML = "Pick a Theme:"
const waveformOptions = document.createElement("select");
const waveformOptionsLabel = document.createElement("label");
waveformOptionsLabel.innerHTML = "Pick a Waveform:"
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
    ctx.canvas.width  = 675;
    ctx.canvas.height = 675;
    src.connect(analyser);
    analyser.connect(audioContext.destination);

    // 1024, 512, 256, 128, 64, 32? - make it a choice!
    analyser.fftSize = 1024;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width / bufferLength);
    
    const renderFrame = () => {

        ctx.fillStyle= "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        switch(waveformConfig) {
            case "Eclipse": 
                drawCircularVisualiser();
                break;
            case "Dotted":
                drawDefaultVisualiser(waveformConfig);
                break;
            default:
                drawDefaultVisualiser(waveformConfig);
        }
    }

    const drawDefaultVisualiser = (waveformConfig) => {
        requestAnimationFrame(renderFrame);
        let bar = 0;
        analyser.getByteFrequencyData(dataArray);
        
        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i] * 2.5;
            const color = dataArray[i] + (25 * (i/bufferLength));
            ctx.fillStyle = checkColorConfig(color);

            if (waveformConfig === "Static") {
                ctx.fillRect(bar, canvas.height - barHeight, barWidth, barWidth);
            } else {
                ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
            }
            bar += barWidth;
        }
    }
    const drawCircularVisualiser = () => {
        let radius = 150;
        // Draw circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0 , 2 * Math.PI);
        ctx.stroke();
        analyser.getByteFrequencyData(dataArray);
        
        for (var i = 0; i < bufferLength; i++) {
            const radians = (Math.PI * 2) / bufferLength;
            let bar_height = (dataArray[i] * 0.75);
    
            const x = canvas.width / 2 + Math.cos(radians * i) * radius;
            const y = canvas.height / 2 + Math.sin(radians * i) * radius;
            const x_end = canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
            const y_end = canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
            const color = (dataArray[i]) + (25 * i/bufferLength);
            ctx.strokeStyle = checkColorConfig(color);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x_end, y_end);
            ctx.stroke();
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
}

// Playing/Pausing songs:
const loadedSongList = document.querySelectorAll(".songListItem");
loadedSongList.forEach(listItem => {
    listItem.addEventListener("click", (e) => {
        e.preventDefault();

        if (!audioContext) createVisualiser();
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

// Changing colors/waveforms:
colorOptions.addEventListener("change", (e) => {
    colorConfig = e.target.value;
});
waveformOptions.addEventListener("change", (e) => {
    waveformConfig = e.target.value;
});

const checkColorConfig = (color) => {
    switch(colorConfig) {
        case "Violent Red":
            return `rgb(209, ${100-(color*0.5)}, ${100-(color*0.5)})`;
        case "Jungle Green":
            return `rgb(163, 240, ${color*0.5})`;
        case "Ice Blue":
            return `rgb(${color+30}, ${color+30}, 219)`;
        case "Red Fade":
            return `rgb(${color}, 0, 0)`;
        case "Green Fade":
            return `rgb(0, ${color}, 0)`;
        case "Blue Fade":
            return `rgb(0, 0, ${color})`;
        case "Solid White":
            return `white`;
        case "Monochrome":
            return `rgb(${color}, ${color}, ${color})`;
        case "Autumn":
            return `rgb(150, ${color}, 50)`;
        case "Lilac":
            return `rgb(150, ${color*0.5}, 150)`;
        case "Rose Gold":
            return `rgb(250, 150, ${color*0.5})`;
        case "Rainbow":
            return `hsl(${color*1.5}, 100%, 50%)`;
        default:
            return `rgb(50, ${color+50}, 200)`;
    }
}