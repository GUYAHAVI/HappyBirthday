const flame = document.getElementById('flame');

// Audio setup for detecting microphone input
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
      // Simulate flame shrinking based on blowing strength
      const blowStrength = Math.min(maxVolume / 128, 1); // Normalize to a maximum of 1
      flame.style.opacity = 1 - blowStrength; // Reduce opacity
      flame.style.transform = `translateX(-50%) scale(${1 - blowStrength})`;

      // If strong enough, "extinguish" the flame
      if (blowStrength > 0.8) {
        flame.style.opacity = 0;
      }
    } else {
      // Reset flame when there's no blowing
      flame.style.opacity = 1;
      flame.style.transform = 'translateX(-50%) scale(1)';
    }

    requestAnimationFrame(detectBlow);
  }

  detectBlow();
}).catch(error => {
  console.error('Microphone access denied!', error);
  alert('Please allow microphone access to enjoy the experience!');
});
