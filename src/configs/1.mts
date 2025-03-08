import { CreatorArgs } from "../controls/controlCreator.mjs";

export const initial: CreatorArgs[] = [
  {
    type: "slider",
    args: {
      name: "x_t",
      min: 0.0001,
      max: 1,
      value: 0.4706,
    },
  },
  {
    type: "oscillator",
    args: { name: "x", min: "zero", max: "width", raise: "x_t", fall: "x_t" },
  },
  {
    type: "slider",
    args: {
      name: "lfo_min",
      max: 0.7499,
      min: 0.7494,
      value: 0.7499,
    },
  },
  {
    type: "slider",
    args: {
      name: "lfo_max",
      max: 0.75,
      min: 0.7499,
      value: 0.74997,
    },
  },
  {
    type: "slider",
    args: {
      name: "lfo_t",
      max: 100_000,
      min: 2,
      value: 100_000,
    },
  },
  {
    type: "oscillator",
    args: {
      name: "lfo",
      min: "lfo_min",
      max: "lfo_max",
      raise: "lfo_t",
      fall: "lfo_t",
    },
  },
  {
    type: "oscillator",
    args: {
      name: "y",
      max: "height",
      min: "zero",
      raise: "lfo",
      fall: "lfo",
    },
  },
  {
    type: "slider",
    args: { name: "sr", max: 2, min: 0.001, value: 1 },
  },
  {
    type: "slider",
    args: {
      name: "vertices",
      max: 2000,
      min: 100,
      value: 650,
    },
  },
  {
    type: "output",
    args: {
      name: "first",
      x: "x",
      y: "y",
      sr: "sr",
      vertices: "vertices",
    },
  },
];
