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
    {type: "waveformOption", name: "Eclipse"},
    {type: "sizeOption", name: "1024"},
    {type: "sizeOption", name: "512"},
    {type: "sizeOption", name: "256"},
    {type: "sizeOption", name: "128"},
    {type: "sizeOption", name: "64"},
    {type: "sizeOption", name: "32"},
];

let sizeConfig = 1024;
let colorConfig = null;
let waveformConfig = null;
let audioContext = null;
const audioPlayer = document.querySelector(".audioPlayer");

// Loading in options:
const loadWaveformColorOptions = (element1, element2, element3) => {
    optionsArr.forEach(option => {
        const newOption = document.createElement("option");
        newOption.innerHTML = option.name;

        if (option.type === "colorOption") {
            element1.appendChild(newOption);
        } else if (option.type === "waveformOption") {
            element2.appendChild(newOption);
        } else if (option.type === "sizeOption") {
            element3.appendChild(newOption);
        }
    });
}

// CURRENT VERSION NOTE:
const currentVersion = document.createElement("p");
currentVersion.style.position = "fixed";
currentVersion.style.bottom = "20px";
currentVersion.style.right = "20px";
currentVersion.style.color = "white";
currentVersion.innerHTML = "Version a1.1"
audioPlayer.append(currentVersion);

// Audio Player:
const audioElement = document.createElement("audio");
audioElement.classList.add("audioElement");
const player = document.createElement("section");
const fileSelector = document.createElement("input");
fileSelector.type = "file";
player.append(fileSelector);
audioPlayer.append(audioElement);
audioPlayer.appendChild(player);


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

const sizeOptions = document.createElement("select");
const sizeOptionsLabel = document.createElement("label");
sizeOptionsLabel.innerHTML = "Pick the number of shown frequencies (refresh to change):"

loadWaveformColorOptions(colorOptions, waveformOptions, sizeOptions);

const options = document.createElement("section");
options.append(colorOptionsLabel);
options.append(colorOptions);
options.append(waveformOptionsLabel);
options.append(waveformOptions);
options.append(sizeOptionsLabel);
options.append(sizeOptions);
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
    analyser.fftSize = sizeConfig;

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
        ctx.lineWidth = 3;
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
            ctx.lineWidth = (canvas.width / bufferLength)*2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x_end, y_end);
            ctx.stroke();
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
}

// Loading/Playing/Pausing songs:
fileSelector.addEventListener("change", () => {
    const song = document.createElement("a");
    const url = window.URL.createObjectURL(fileSelector.files[0])
    song.innerHTML = fileSelector.files[0].name;
    song.href = url;
    song.classList.add("songListItem");
    player.append(song);

    song.addEventListener("click", (e) => {
        e.preventDefault();
        const isCurrentAudio = song.href == audioElement.src;

        if (!isCurrentAudio) {
            audioElement.src = song.href;
            audioElement.play();
        } else if (isCurrentAudio && !audioElement.paused) {
            audioElement.pause();
        } else if (isCurrentAudio && audioElement.paused) {
            audioElement.play();
        }
    });

    if (!audioContext) createVisualiser();
    audioElement.src = song.href;
    audioElement.play();
});

// Changing options:
colorOptions.addEventListener("change", (e) => {
    colorConfig = e.target.value;
});
waveformOptions.addEventListener("change", (e) => {
    waveformConfig = e.target.value;
});
sizeOptions.addEventListener("change", (e) => {
    sizeConfig = e.target.value;
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