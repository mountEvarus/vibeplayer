"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var myCanvas = document.getElementById("canvas");
var ctx = myCanvas.getContext("2d");
var freqs; // need a way of loading in the file, not just the microphone input of the laptop.

navigator.mediaDevices.enumerateDevices().then(function (devices) {
  devices.forEach(function (d, i) {
    return console.log(d.label, i);
  });
  navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: devices[9].deviceId
    }
  }).then(function (stream) {
    var context = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = context.createAnalyser();
    var source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(context.destination);
    freqs = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
      var radius = 75;
      var bars = 100; // Draw Background

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, myCanvas.width, myCanvas.height); // Draw circle

      ctx.beginPath();
      ctx.arc(myCanvas.width / 2, myCanvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.stroke();
      analyser.getByteFrequencyData(freqs); // Draw label

      ctx.font = "500 24px Helvetica Neue";
      var avg = _toConsumableArray(Array(255).keys()).reduce(function (acc, curr) {
        return acc + freqs[curr];
      }, 0) / 255;
      ctx.fillStyle = "rgb(" + 200 + ", " + (200 - avg) + ", " + avg + ")";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("SPACE", myCanvas.width / 2, myCanvas.height / 2 - 24);
      ctx.fillText("FORCE", myCanvas.width / 2, myCanvas.height / 2 + 6); // Draw bars

      for (var i = 0; i < bars; i++) {
        var radians = Math.PI * 2 / bars;
        var bar_height = freqs[i] * 0.5;
        var x = myCanvas.width / 2 + Math.cos(radians * i) * radius;
        var y = myCanvas.height / 2 + Math.sin(radians * i) * radius;
        var x_end = myCanvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
        var y_end = myCanvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
        var color = "rgb(" + 200 + ", " + (200 - freqs[i]) + ", " + freqs[i] + ")";
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x_end, y_end);
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  });
});