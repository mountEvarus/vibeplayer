import optionsArr from "./config.js";

let sizeConfig = 1024;
let colorConfig = null;
let waveformConfig = null;
let audioContext = null;
const jsmediatags = window.jsmediatags;
const audioPlayer = document.querySelector(".audioPlayer");

// Loading in options:
const loadWaveformColorOptions = (element1, element2, element3) => {
    optionsArr.forEach(option => {
        const newOption = document.createElement("option");
        newOption.style.background = "black";
        newOption.style.fontSize = "20px";
        newOption.innerHTML = option.name;

        if (option.type === "colorOption") element1.appendChild(newOption);
        else if (option.type === "waveformOption") element2.appendChild(newOption);
        else if (option.type === "sizeOption") element3.appendChild(newOption);
    });
}

// Current Version Note:
const currentVersion = document.createElement("p");
currentVersion.style.position = "fixed";
currentVersion.style.bottom = "20px";
currentVersion.style.right = "20px";
currentVersion.style.color = "white";
currentVersion.innerHTML = "Version 0.8.4.1"
audioPlayer.append(currentVersion);

// Audio Player:
const audioElement = document.createElement("audio");
audioElement.classList.add("audioElement");
const player = document.createElement("section");
const fileSelector = document.createElement("input");
fileSelector.type = "file";
fileSelector.className = "fileSelector";
fileSelector.id = "file-selector";
const fileSelectorLabel = document.createElement("label");
fileSelectorLabel.htmlFor = "file-selector";
fileSelectorLabel.innerHTML = "<i class='fas fa-upload'></i> Select Music";
fileSelectorLabel.className = "fileSelectorLabel";
const musicList = document.createElement("article");
musicList.className = "songSelector";

player.append(fileSelectorLabel);
player.append(fileSelector);
player.append(musicList);
audioPlayer.append(audioElement);
audioPlayer.appendChild(player);

// Canvas/Visualizer:
const canvas = document.createElement("canvas");
audioPlayer.appendChild(canvas);

// Waveform Options:
const colorOptions = document.createElement("select");
colorOptions.className = "dropdownOptions";
const colorOptionsLabel = document.createElement("label");
colorOptionsLabel.innerHTML = "Select a Theme:"

const waveformOptions = document.createElement("select");
waveformOptions.className = "dropdownOptions";
const waveformOptionsLabel = document.createElement("label");
waveformOptionsLabel.innerHTML = "Select a Waveform:"

const sizeOptions = document.createElement("select");
sizeOptions.className = "dropdownOptions";
const sizeOptionsLabel = document.createElement("label");
sizeOptionsLabel.innerHTML = "Select a datapoint count:"

loadWaveformColorOptions(colorOptions, waveformOptions, sizeOptions);

const options = document.createElement("section");
options.append(colorOptionsLabel);
options.append(colorOptions);
options.append(waveformOptionsLabel);
options.append(waveformOptions);
options.append(sizeOptionsLabel);
options.append(sizeOptions);
audioPlayer.appendChild(options);

// Cover art:
const art = document.createElement("img");
art.src = "./assets/no-artwork.png";
options.append(art);

// Visualizer:
const createVisualiser = () => {
    audioContext = new AudioContext();
    const src = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();
    const ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerHeight - 10;
    ctx.canvas.height = window.innerHeight - 10;
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

            if (waveformConfig === "Static") ctx.fillRect(bar, canvas.height - barHeight, barWidth, barWidth); 
            else ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
            bar += barWidth;
        }
    }
    const drawCircularVisualiser = () => {
        requestAnimationFrame(renderFrame);
        let radius = 150;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0 , 2 * Math.PI);
        ctx.stroke();
        analyser.getByteFrequencyData(dataArray);
        
        for (let i = 0; i < bufferLength; i++) {
            const radians = (Math.PI * 2) / bufferLength;
            const bar_height = (dataArray[i] * 0.75);
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
    }
    renderFrame();
}

// Loading/Playing/Pausing songs:
fileSelector.addEventListener("change", () => {
    const song = document.createElement("a");
    const url = window.URL.createObjectURL(fileSelector.files[0]);
    let base64 = null;
    song.href = url;
    song.classList.add("songListItem");
    musicList.append(song);






    // Clean this up!!!
    jsmediatags.read(fileSelector.files[0], {
        onSuccess: (songInfo) => {
            song.innerHTML = `${songInfo.tags.title}, by ${songInfo.tags.artist}`;
            const image = songInfo.tags.picture;

            if (image) {
                let base64String = "";
                for (let i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
                art.setAttribute('src',base64);
            } else art.src = "./assets/no-artwork.png";
        }
    });





    if (song.innerHTML.length === 0) song.innerHTML = fileSelector.files[0].name;

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

        if (art.src !== base64) art.src = base64;
    });
    if (!audioContext) createVisualiser();
    audioElement.src = song.href;
    audioElement.play();
});

// Changing options:
colorOptions.addEventListener("change", (e) => colorConfig = e.target.value);
waveformOptions.addEventListener("change", (e) => waveformConfig = e.target.value);
sizeOptions.addEventListener("change", (e) => sizeConfig = e.target.value);

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