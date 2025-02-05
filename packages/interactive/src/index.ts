import { scaleLinear, scaleThreshold } from "d3-scale";

import "lenis/dist/lenis.css";

import { SmoothScroll } from "./SmoothScroll";

// Constants.
const frameCount = 250;

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
  return `${import.meta.env.BASE_URL}${path}${index.toString().padStart(3, "0")}.webp`;
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

/**
 * Preload the remaining frames of the image sequence.
 *
 * @param src – The path to the image sequence files.
 * @param frameCount – The total number of frames in the image sequence.
 */
function preloadImages(src: string, frameCount: number) {
  for (let i = 1; i < frameCount; i++) {
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
      path: "Plastic_Desktop_2x/Plastic_Desktop_2x",
      dimensions: {
        width: 2800,
        height: 1620,
      },
    };
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    return {
      path: "Plastic_Tablet_Tall_2x/Plastic_Tablet_Tall_2x",
      dimensions: {
        width: 1668,
        height: 2388,
      },
    };
  } else {
    return {
      path: "Plastic_Mobile_Tall_3x/Plastic_Mobile_Tall_3x",
      dimensions: {
        width: 1179,
        height: 2556,
      },
    };
  }
}

// Scales for annotation animation.
const annotationTextScale = scaleThreshold<number, string>()
  .domain([0.25, 0.5, 0.75])
  .range([
    "The conventional recycling process degrades the microscopic fibers that make up plastic bottles.",
    "Because of this, bottles are often turned into products that don't require high-quality plastic fibers, like polyester for carpets, jackets, or shoes.",
    "These polyester threads can be mixed with glues, dyes, and fibers like cotton or elastic, degrading the plastic's purity even further.",
    "This makes the shoes difficult to recycle, so most end up being discarded.",
  ]);
const annotationOpacityScale = scaleLinear()
  .domain([
    0, 0.15, 0.2, 0.275, 0.35, 0.475, 0.5, 0.525, 0.725, 0.75, 0.775, 0.975, 1,
  ])
  .range([1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]);

/**
 * Update the annotation text and opacity based on the progress of the scroll.
 *
 * @param annotation – The annotation element to update.
 * @param progress – The progress of the scroll.
 */
function updateAnnotation(annotation: HTMLSpanElement, progress: number) {
  annotation.textContent = annotationTextScale(progress);
  annotation.style.opacity = annotationOpacityScale(progress).toString();
}

/**
 * The top-level main function.
 *
 * This function initializes the canvas element,
 * sets the dimensions of the canvas, and loads the first frame of the image se-
 * quence. In addition, we preload the remaining frames of the image sequence
 * and set up the Lenis scroll event handler.
 */
function main() {
  const canvas = document.getElementById("scrolly-canvas") as HTMLCanvasElement;
  const annotation = document.getElementById(
    "scrolly-annotation",
  ) as HTMLSpanElement;

  const ctx = canvas.getContext("2d");
  const {
    path,
    dimensions: { width, height },
  } = deriveImageParams();
  canvas.width = width;
  canvas.height = height;

  const img = new Image();
  img.src = getCurrentFrame(path, 0);
  img.onload = () => {
    if (!ctx) {
      return;
    }

    ctx.drawImage(img, 0, 0);
  };

  preloadImages(path, frameCount);

  document.addEventListener("DOMContentLoaded", () => {
    new SmoothScroll((progress) => {
      if (!ctx) {
        return;
      }

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * frameCount),
      );

      updateImage(img, path, frameIndex);
      updateAnnotation(annotation, progress);
    });
  });
}

main();
