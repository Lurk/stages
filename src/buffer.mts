export type CapedLIFO = {
  iter: () => number[];
  push: (val: number) => void;
  resize: (newSize: number) => void;
};

export function createCapedLIFO(initialSize: number): CapedLIFO {
  const storage: Array<number> = [];
  let size = initialSize;
  return {
    push(val: number) {
      storage.unshift(val);
      if (storage.length >= size) {
        // TODO: Moving every array element on each push sounds wasteful. The alternative would be two pointers
        // solution or a linked list. Both of them would require iterators or rebuilding arrays for consumption. Since
        // push and consuming is happening at the same rate, I do not see a clear winner without setting up benchmarks.
        storage.pop();
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
