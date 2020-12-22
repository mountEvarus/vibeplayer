import AudioPlayer from "./AudioPlayer.js";

const audioPlayer = new AudioPlayer(".audioPlayer", [
    { url: "./assets/songs/back_n_forth.mp3", name: "Back 'n Forth"},
    { url: "./assets/songs/i_kill_for_fun.mp3", name: "I Kill For Fun"},
    { url: "./assets/songs/crawl.flac", name: "Crawl"},
    { url: "./assets/songs/crack_rock.mp3", name: "Crack Rock"},
    { url: "./assets/songs/chapter_6.mp3", name: "Chapter Six"}
]);