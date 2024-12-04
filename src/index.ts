import { scroll } from "motion";

console.log("Hello, world!");

const video = document.getElementById(
  "glass-master"
) as HTMLVideoElement | null;

if (video) {
  video.onloadedmetadata = () => {
    scroll((progress: number) => {
      console.log(progress);
      video.currentTime = progress * video.duration;
    });
  };
}
