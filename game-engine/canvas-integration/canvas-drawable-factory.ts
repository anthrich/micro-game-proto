import IDrawableFactory from "../drawable-factory";
import CanvasCircleRenderer from "./canvas-circle-renderer";
import ICircleRenderer from "../circle-renderer";
import IDrawable from "../drawable";
import {CanvasImageRenderer} from "./canvas-image-renderer";

class CanvasDrawableFactory implements IDrawableFactory {

  private canvas : HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getCircleRenderer(): ICircleRenderer {
    return new CanvasCircleRenderer(this.canvas);
  }
  
  getImageRenderer(imgUrl: string): IDrawable {
    return new CanvasImageRenderer(imgUrl, this.canvas);
  }
}

export default CanvasDrawableFactory;
