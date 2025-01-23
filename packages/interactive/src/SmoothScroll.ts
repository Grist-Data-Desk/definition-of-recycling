import Lenis from "lenis";
import { scroll } from "motion";

/**
 * Creates a smooth scroll manager using Lenis.
 *
 * @property lenis - The active Lenis instance.
 * @property onScroll - The callback function to be run on scroll.
 * @property prevIntersectionRatio - The previous intersection ratio of the canvas.
 */
export class SmoothScroll {
  private lenis: Lenis | null = null;
  private onScroll: (progress: number) => void;
  private prevIntersectionRatio = 0;
  private scrollRegion: HTMLDivElement;

  /**
   * Creates an instance of SmoothScroll. As part of this process, we create a
   * new Lenis instance, create an IntersectionObserver to observe the canvas
   * element for intersection changes, and initialize the scroll event handler.
   *
   * @param onScroll - The callback function to be run on scroll.
   */
  constructor(onScroll: (progress: number) => void) {
    this.onScroll = onScroll;

    this.scrollRegion = document.getElementById(
      "scrolly-content",
    )! as HTMLDivElement;
    scroll(this.onScroll, { target: this.scrollRegion });

    const canvas = document.getElementById(
      "scrolly-canvas",
    )! as HTMLCanvasElement;
    const observer = new IntersectionObserver(this.init.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0.95,
    });
    observer.observe(canvas);
  }

  /**
   * Initializes the Lenis instance if the user has scrolled into the area of
   * the page where the canvas is visible. If the user is scrolling away from
   * the canvas, destroy the Lenis instance.
   *
   * @param entries - The IntersectionObserverEntry array.
   */
  private init(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (
        entry.intersectionRatio > this.prevIntersectionRatio &&
        entry.isIntersecting
      ) {
        this.lenis = new Lenis({
          autoRaf: true,
        });
      } else if (this.lenis) {
        this.lenis.destroy();
        this.lenis = null;
      }

      this.prevIntersectionRatio = entry.intersectionRatio;
    });
  }
}
