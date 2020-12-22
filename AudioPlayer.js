export default class AudioPlayer {
    constructor(selector = '.audioPlayer', audio = []) {
        this.playerElem = document.querySelector(selector);
        this.audio = audio;
        this.currentAudio = null;
        this.createPlayerElements();
        this.audioContext = null;
    }

    createVisualiser() {
        this.audioContext = new AudioContext();
        this.src = this.audioContext.createMediaElementSource(this.audioElem);
        const analyser = this.audioContext.createAnalyser();
        const canvas = this.visualiserElem;
        const ctx = canvas.getContext('2d');
        this.src.connect(analyser);
        analyser.connect(this.audioContext.destination);


        // 2048, 1024, 512, 256 or 128? 
        analyser.fftSize = 1024;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        
        function renderFrame() {
            requestAnimationFrame(renderFrame);

            let bar = 0;
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle= "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
            for (let i = 0; i < bufferLength; i++) {
                let barHeight = dataArray[i] - 125;
                const color = barHeight + (25 * (i/bufferLength));

                // DEFAULT
                // ctx.fillStyle = `rgb(${color}, 100, 50)`;

                // Violent Red
                ctx.fillStyle = `rgb(209, ${100-(color)}, ${100-(color)})`;

                // Jungle Green
                // ctx.fillStyle = `rgb(163, 240, ${color})`;

                // Ice Blue
                // ctx.fillStyle = `rgb(${color+30}, ${color+30}, 219)`;

                // Solid White
                // ctx.fillStyle = `white`;

                // Red Fade
                // ctx.fillStyle = `rgb(${color}, 0, 0)`;

                // Green Fade
                // ctx.fillStyle = `rgb(0, ${color}, 0)`;

                // Blue Fade
                // ctx.fillStyle = `rgb(0, 0, ${color})`;

                // Monochrome
                // ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;


                ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
                bar += barWidth + 2;
            }
        }

        renderFrame();
    }

    createPlayerElements() {
        this.audioElem = document.createElement('audio');
        const playListElem = document.createElement('div');
        playListElem.classList.add('playlist');
        const playElem = document.createElement('button');
        playElem.classList.add('play');
        this.visualiserElem = document.createElement('canvas');
        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playListElem);
        this.playerElem.appendChild(this.visualiserElem);

        this.createPlayListElements(playListElem);
    }

    createPlayListElements(playListElem) {
        this.audio.forEach(audio => {
            const audioItem = document.createElement('a');
            audioItem.href = audio.url;
            audioItem.innerHTML = `<i class="fa fa-play"></i>${audio.name}`;
            this.setEventListener(audioItem);
            playListElem.appendChild(audioItem);
        });
    }

    setEventListener(audioItem) {
        audioItem.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.audioContext) {
                this.createVisualiser();
            }
            const isCurrentAudio = audioItem.getAttribute('href') == (this.currentAudio && this.currentAudio.getAttribute('href'));

            if (isCurrentAudio && !this.audioElem.paused) {
                this.audioElem.pause();
            } else if (isCurrentAudio && this.audioElem.paused) {
                this.audioElem.play();
            } else {
                this.currentAudio = audioItem;
                this.audioElem.src = this.currentAudio.getAttribute('href');
                this.audioElem.play();
            }

        })
    }
}