export function createBuffer(initialSize: number): {
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
