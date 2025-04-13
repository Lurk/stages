import { Canvas } from "../../canvas.mjs";
import { Animation } from "../../animation.mjs";
import { recorder } from "../../recorder.mjs";
import { button } from "../common/button.mjs";
import { spanWithText } from "../common/span.mjs";
import { divider } from "../common/divider.mjs";
import { toISOTime } from "../../utils.mjs";

export type PlaybackArgs = {
  canvas: Canvas;
  animation: Animation;
  container: HTMLDivElement;
};

export function playback({ canvas, container, animation }: PlaybackArgs) {
  const rec = recorder(canvas.ctx);
  const now = spanWithText(container, "0");

  animation.onFrameSubscribe((time) => {
    now(time.toFixed(0));
  });

  divider({ container });

  const backButton = button({
    text: "◀◀",
    container,
    disabled: true,
    onHold: () => {
      animation.backward();
    },
  });

  const playButton = button({
    text: animation.isPlaying() ? "⏸" : "▶",
    container,
    onClick: () => {
      if (animation.isPlaying()) {
        playButton.setText("▶");
        animation.pause();
        recButton.toggleDisabled(true);
        backButton.toggleDisabled(false);
        forwardButton.toggleDisabled(false);
      } else {
        backButton.toggleDisabled(true);
        recButton.toggleDisabled(false);
        forwardButton.toggleDisabled(true);
        playButton.setText("⏸");
        animation.play();
      }
    },
  });

  const forwardButton = button({
    text: "▶▶",
    container,
    disabled: true,
    onHold: () => {
      animation.forward();
    },
  });

  const recButton = button({
    text: rec.state() === "inactive" ? "●" : "◼",
    container,
    onClick: () => {
      if (rec.state() === "inactive") {
        playButton.toggleDisabled(true);
        backButton.toggleDisabled(true);
        forwardButton.toggleDisabled(true);
        screenshotButton.toggleDisabled(true);
        rec.start();
      } else {
        backButton.toggleDisabled(false);
        playButton.toggleDisabled(false);
        forwardButton.toggleDisabled(false);
        screenshotButton.toggleDisabled(false);
        rec.stop();
      }
    },
  });

  const screenshotButton = button({
    text: "✴",
    container,
    onClick: () => {
      const data = canvas.ctx.canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = data;
      a.download = `stages ${toISOTime(new Date())}.png`;
      a.click();
      URL.revokeObjectURL(data);
    },
  });
  rec.subscribe((state) =>
    recButton.setText(state === "inactive" ? "●" : "◼"),
  );
}
