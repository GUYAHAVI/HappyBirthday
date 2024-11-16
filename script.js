const flame = document.getElementById('flame');
const glow = document.querySelector('.glow');
const message = document.getElementById('message');

// Audio setup for microphone input
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
      const blowStrength = Math.min(maxVolume / 128, 1); // Normalize to max of 1
      flame.style.opacity = 1 - blowStrength; // Shrink flame opacity
      glow.style.opacity = 1 - blowStrength; // Shrink glow
      if (blowStrength > 0.8) {
        flame.style.opacity = 0; // Extinguish flame
        glow.style.opacity = 0;
        message.style.visibility = 'visible'; // Show the romantic message
      }
    }

    requestAnimationFrame(detectBlow);
  }

  detectBlow();
}).catch(error => {
  console.error('Microphone access denied!', error);
  alert('Please allow microphone access to enjoy the experience!');
});
