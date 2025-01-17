import Lenis from "lenis";

/**
 * Creates a smooth scroll manager using Lenis.
 *
 * @property lenis - The active Lenis instance.
 * @property onScroll - The callback function to be run on scroll.
 * @property prevProgress - The previous value of the scroll progress, ranges from 0 to 1.
 * @property prevDirection - The previous direction of the scroll, either 1 or -1.
 * @property prevIntersectionRatio - The previous intersection ratio of the canvas.
 */
export class SmoothScroll {
  private lenis: Lenis;
  private onScroll: (e: Lenis) => void;
  private prevProgress: number = 0;
  private prevDirection: number = 0;
  private prevIntersectionRatio: number = 1;

  /**
   * Creates an instance of SmoothScroll. As part of this process, we create a
   * new Lenis instance, create an IntersectionObserver to observe the canvas
   * element for intersection changes, and initialize the scroll event handler.
   *
   * @param onScroll - The callback function to be run on scroll.
   */
  constructor(onScroll: (e: Lenis) => void) {
    const lenisContent = document.getElementById("lenis-content")!;
    this.lenis = new Lenis({
      autoRaf: true,
      content: lenisContent,
    });
    this.onScroll = onScroll;

    const lenisCanvas = document.getElementById("lenis-canvas")!;
    const observer = new IntersectionObserver(this.reinit.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: [0.95, 1],
    });
    observer.observe(lenisCanvas);

    this.init();
  }

  /**
   * Initializes the Lenis scroll event handler.
   */
  private init() {
    this.lenis.on("scroll", this.handleScroll.bind(this));
  }

  /**
   * Handles the scroll event by running the supplied callback function. If the
   * user has scrolled to the end of the content, destroy the Lenis instance.
   *
   * @param e - The active Lenis instance.
   */
  private handleScroll(e: Lenis) {
    this.onScroll(e);
    this.prevProgress = e.progress;
    this.prevDirection = e.direction;

    if (e.progress === 1 && e.direction === 1) {
      this.lenis.destroy();
    }
  }

  /**
   * Reinitializes the Lenis instance if the user has scrolled to the end of the
   * content and then scrolls back up.
   *
   * @param entries - The IntersectionObserverEntry array.
   */
  private reinit(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (
        this.prevProgress === 1 &&
        this.prevDirection === 1 &&
        entry.intersectionRatio > this.prevIntersectionRatio
      ) {
        this.lenis = new Lenis({
          autoRaf: true,
          content: document.getElementById("lenis-content") as HTMLElement,
        });

        this.init();
      }

      this.prevIntersectionRatio = entry.intersectionRatio;
    });
  }
}
