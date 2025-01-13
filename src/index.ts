import { scroll, frame } from "motion";

/**
 * Get the current frame from the image sequence based on the index derived from
 * the progress of the scroll.
 *
 * @param path — The path to the image sequence files.
 * @param index — The index of the current frame, based on the progress of the
 * scroll.
 * @returns The path to the current frame.
 */
function getCurrentFrame(path: string, index: number): string {
  return `${path}${index.toString().padStart(3, "0")}.webp`;
}

/**
 * Update the src attribute of the image element with the current frame in the
 * image sequence.
 *
 * @param img – The image element to update.
 * @param src – The path to the image sequence files.
 * @param index – The index of the current frame, based on the progress of the
 * scroll.
 */
function updateImage(img: HTMLImageElement, src: string, index: number): void {
  img.src = getCurrentFrame(src, index);
}

function preloadImages(src: string, frameCount: number) {
  for (let i = 2; i <= frameCount; i++) {
    const img = new Image();
    img.src = getCurrentFrame(src, i);
  }
}

/**
 * Derive parameters for the image sequence based on the viewport width.
 */
function deriveImageParams() {
  if (window.matchMedia("(min-width: 1024px)").matches) {
    return {
      path: "/Plastic_Desktop_2x/Plastic_Desktop_2x",
      dimensions: {
        width: 2800,
        height: 1620,
      },
    };
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    return {
      path: "/Plastic_Tablet_Tall_2x/Plastic_Tablet_Tall_2x",
      dimensions: {
        width: 1668,
        height: 2388,
      },
    };
  } else {
    return {
      path: "/Plastic_Mobile_Tall_3x/Plastic_Mobile_Tall_3x",
      dimensions: {
        width: 1179,
        height: 2556,
      },
    };
  }
}

function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const {
    path,
    dimensions: { width, height },
  } = deriveImageParams();

  canvas.width = width;
  canvas.height = height;
  const frameCount = 250;

  const img = new Image();
  img.src = getCurrentFrame(path, 1);
  img.onload = () => {
    if (!ctx) {
      return;
    }

    ctx.drawImage(img, 0, 0);
  };

  preloadImages(path, frameCount);

  scroll((progress: number) => {
    if (!ctx) {
      return;
    }

    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(progress * frameCount)
    );

    frame.render(() => {
      updateImage(img, path, frameIndex);
    });
  });
}

main();
