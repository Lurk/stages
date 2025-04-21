import { toISOTime } from "./utils.mjs";

type RecorderCallback = (state: RecordingState) => void;

export type Recorder = {
  state: () => RecordingState;
  subscribe: (cb: RecorderCallback) => void;
  unsubscribe: (cb: RecorderCallback) => void;
  start: () => void;
  stop: () => void;
};

export function recorder(ctx: CanvasRenderingContext2D): Recorder {
  const cbs: RecorderCallback[] = [];
  const stream = ctx.canvas.captureStream(60);

  let recordingInterval: NodeJS.Timeout | null = null;

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/mp4; codecs="avc1.4d002a"',
  });

  mediaRecorder.ondataavailable = (event) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    anchor.href = URL.createObjectURL(new Blob([event.data]));
    anchor.download = `stages ${toISOTime(new Date())}.ts`;
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(anchor.href);
  };

  mediaRecorder.onstop = () => {
    cbs.forEach((cb) => cb("inactive"));
  };

  return {
    state: () => mediaRecorder.state,
    subscribe: (cb) => cbs.push(cb),
    unsubscribe: (cb) => cbs.splice(cbs.indexOf(cb), 1),
    start: () => {
      mediaRecorder.start();
      cbs.forEach((cb) => cb("recording"));
      recordingInterval = setInterval(() => {
        mediaRecorder.requestData();
      }, 10000);
    },
    stop: () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
      }
      mediaRecorder.stop();
    },
  };
}
