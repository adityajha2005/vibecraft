import cv from '@techstark/opencv-js';

export class OpenCVWorker {
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private processing: boolean = false;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.videoElement = video;
    this.canvasElement = canvas;
  }

  public startProcessing() {
    this.processing = true;
    this.processFrame();
  }

  public stopProcessing() {
    this.processing = false;
  }

  private processFrame() {
    if (!this.processing || !this.videoElement || !this.canvasElement) return;

    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

    const imageData = ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
    
    const src = cv.matFromImageData(imageData);
    const dst = new cv.Mat();

    // OpenCV processing
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.Canny(dst, dst, 50, 150, 3, false);

    
    cv.imshow(this.canvasElement, dst); //showing resul

    src.delete();  //memory free for next frame
    dst.delete();

    //loop for next frame
    requestAnimationFrame(() => this.processFrame());
  }
}
