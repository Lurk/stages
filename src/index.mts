import { initFullScreenCanvas, path } from "./canvas.mjs";
import { constant, slider, wave } from "./stages.mjs";

const ctx = initFullScreenCanvas({
  id: "canvas",
  backgroundCollor: "#403f3f",
});
const max = 500;
const time = wave({
  min: constant(400),
  max: constant(600),
  raise: constant(3000),
  fall: constant(3000),
});
const time2 = wave({
  min: constant(100),
  max: constant(400),
  raise: constant(3000),
  fall: constant(3000),
});

const distance = wave({
  min: constant(-150),
  max: constant(-50),
  raise: constant(50000),
  fall: constant(50000),
});

const speed = wave({
  min: constant(1),
  max: slider({ id: "speed", min: 1, max: 50, value: 1 }),
  raise: constant(50000),
  fall: constant(50000),
});

const w = wave({
  max: wave({
    min: wave({
      min: constant(0),
      max: constant(max),
      raise: constant(3000),
      fall: constant(3000),
    }),
    max: constant(max),
    raise: time2,
    fall: time2,
  }),
  min: wave({
    min: constant(max),
    max: wave({
      min: constant(0),
      max: constant(max),
      raise: constant(30),
      fall: constant(30),
    }),
    raise: time,
    fall: time,
  }),
  raise: time,
  fall: time,
});

const buffer = createBuffer(Math.round(ctx.canvas.width));

function createBuffer(initialSize: number): {
  iter: () => number[];
  push: (val: number) => void;
  resize: (newSize: number) => void;
} {
  const storage: Array<number> = [];
  let size = initialSize;
  return {
    push(val: number) {
      storage.push(val);
      if (storage.length >= size) {
        // TODO: Moving every array element on each push sounds wasteful. The alternative would be two pointers
        // solution or a linked list. Both of them would require iterators or rebuilding arrays for consumption. Since
        // push and consuming is happening at the same rate, I do not see a clear winner without setting up benchmarks.
        storage.shift();
      }
    },
    iter() {
      return storage;
    },
    resize(newSize: number) {
      size = newSize;
    },
  };
}

function a() {
  requestAnimationFrame((now) => {
    buffer.resize(ctx.canvas.width);
    const vHalf = ctx.canvas.height / 2;
    buffer.push(w.get(now));
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * speed.get(now),
      y: (y) => vHalf - max / 2 + y - 250 - distance.get(now),
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * (3 + speed.get(now)),
      y: (y) => vHalf - max / 2 + y,
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * (2 + speed.get(now)),
      y: (y) => vHalf - max / 2 + y + 250 + distance.get(now),
    });

    path({
      buffer: buffer.iter(),
      ctx,
      x: (x) => x * (1 + speed.get(now)),
      y: (y) => vHalf - max / 2 + y + distance.get(now),
    });

    a();
  });
}

a();
