const video = document.getElementById('candleVideo');

// Load the initial looping section
video.currentTime = 0;
video.play();

const loopStart = 5; // Start time of the loop in seconds
const loopEnd = 10;   // End time of the loop in seconds
let blowing = false;

// Keep looping the initial part
video.addEventListener('timeupdate', () => {
  if (!blowing && video.currentTime >= loopEnd) {
    video.currentTime = loopStart;
  }
});

// Audio setup for capturing microphone input
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  analyser.fftSize = 256;
  microphone.connect(analyser);

  function detectBlow() {
    analyser.getByteFrequencyData(dataArray);

    const maxVolume = Math.max(...dataArray);
    if (maxVolume > 100) {
      blowing = true;
      video.loop = false; // Stop looping
      video.playbackRate = maxVolume / 128; // Adjust speed based on blow strength
      video.muted = false; // Unmute if needed
    } else {
      video.playbackRate = 1; // Reset speed if no blowing detected
    }

    if (blowing && video.currentTime >= video.duration) {
      // Stop animation if video ends
      video.pause();
    }

    requestAnimationFrame(detectBlow);
  }

  detectBlow();
}).catch(error => {
  console.error('Microphone access denied!', error);
  alert('Please allow microphone access to enjoy the experience!');
});
