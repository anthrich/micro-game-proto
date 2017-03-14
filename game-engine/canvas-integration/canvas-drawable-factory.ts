import IDrawableFactory from "../drawable-factory";
import CanvasCircleRenderer from "./canvas-circle-renderer";
import ICircleRenderer from "../circle-renderer";

class CanvasDrawableFactory implements IDrawableFactory {

  private canvas : HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getCircleRenderer(): ICircleRenderer {
    return new CanvasCircleRenderer(this.canvas);
  }
}

export default CanvasDrawableFactory;
