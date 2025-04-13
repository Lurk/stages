import { box, Canvas, circle, path } from "./canvas.mjs";
import { Output } from "./output.mjs";
import { getOneNumber } from "./value.mjs";

export type AnimationArgs = {
  canvas: Canvas;
  outputs: Map<string, Output>;
};

type OnFrameCb = (now: number) => void;
export type Animation = {
  onFrameSubscribe: (cb: OnFrameCb) => void;
  onFrameUnsubscribe: (cb: OnFrameCb) => void;
  isPlaying: () => boolean;
  getNow: () => number;
  play: () => void;
  pause: () => void;
  forward: () => void;
  backward: () => void;
};

export function animation(args: AnimationArgs): Animation {
  const onFrameCallbacks: OnFrameCb[] = [];
  const frameLength = 1000 / 60;
  const state = {
    isPlaying: true,
    now: 0,
    pausedAt: 0,
    offset: 0,
  };

  const play = () => {
    requestAnimationFrame((now) => {
      if (!state.isPlaying) {
        return;
      }
      if (state.pausedAt) {
        state.offset = state.now + state.offset - now;
        state.pausedAt = 0;
      }
      state.now = now;
      frame({ ...args, now: now + state.offset });
      onFrameCallbacks.forEach((cb) => cb(now + state.offset));
      play();
    });
  };

  return {
    play() {
      state.isPlaying = true;
      play();
    },
    pause: () => {
      state.pausedAt = state.now;
      state.isPlaying = false;
    },
    forward: () => {
      state.offset += frameLength;
      frame({ ...args, now: state.now + state.offset });
      onFrameCallbacks.forEach((cb) => cb(state.now + state.offset));
    },
    backward: () => {
      state.offset =
        Math.abs(state.offset - frameLength) < state.now
          ? state.offset - frameLength
          : -state.now;
      frame({ ...args, now: state.now + state.offset });
      onFrameCallbacks.forEach((cb) => cb(state.now + state.offset));
    },
    isPlaying: () => state.isPlaying,
    getNow: () => state.now,
    onFrameSubscribe: (cb) => {
      onFrameCallbacks.push(cb);
    },
    onFrameUnsubscribe: (cb) => {
      const index = onFrameCallbacks.indexOf(cb);
      if (index > -1) {
        onFrameCallbacks.splice(index, 1);
      }
    },
  };
}

export type FrameArgs = {
  canvas: Canvas;
  outputs: Map<string, Output>;
  now: number;
};

export function frame({ canvas, outputs, now }: FrameArgs) {
  canvas.ctx.fillStyle = "#2b2a2a";
  canvas.ctx.fillRect(0, 0, canvas.ctx.canvas.width, canvas.ctx.canvas.height);
  for (const output of outputs.values()) {
    switch (output.kind) {
      case "line":
        path({
          ctx: canvas.ctx,
          now,
          len: getOneNumber(output.value.vertices(now, 0)),
          sampleRate: getOneNumber(output.value.sr(now, 0)),
          x: output.value.x,
          y: output.value.y,
          color: output.value.color,
        });
        break;
      case "box":
        box({
          ctx: canvas.ctx,
          now,
          len: getOneNumber(output.value.amount(now, 0)),
          sampleRate: getOneNumber(output.value.sr(now, 0)),
          x: output.value.x,
          y: output.value.y,
          width: output.value.width,
          height: output.value.height,
          color: output.value.color,
        });
        break;
      case "circle":
        circle({
          ctx: canvas.ctx,
          now,
          len: getOneNumber(output.value.amount(now, 0)),
          sampleRate: getOneNumber(output.value.sr(now, 0)),
          x: output.value.x,
          y: output.value.y,
          radius: output.value.radius,
          color: output.value.color,
        });
        break;
      default:
        //@ts-expect-error
        throw new Error(`Unknown output kind: ${output.kind}`);
    }
  }
}
