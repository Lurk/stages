export function createOscillator(hz: number) {
  const audioCtx = new AudioContext();
  const oscillator = new OscillatorNode(audioCtx, {
    frequency: hz,
    type: "sine",
  });
  const gainNode = new GainNode(audioCtx);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 32;
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  gainNode.gain.value = 0;

  // Main block for doing the audio recording
  const constraints = { audio: true };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      audioCtx.createMediaStreamSource(stream);
    })
    .catch(function (err) {
      console.error("The following gUM error occurred: " + err);
    });
  oscillator.connect(analyser).connect(gainNode).connect(audioCtx.destination);
  oscillator.start();

  const waveform = new Uint8Array(analyser.frequencyBinCount);

  return {
    get(): number {
      analyser.getByteTimeDomainData(waveform);

      return waveform.at(0) || 0;
    },
  };
}
