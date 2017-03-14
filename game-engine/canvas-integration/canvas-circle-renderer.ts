import CircleRenderer from "../circle-renderer";
import Vector2 from "../vector2";

class CanvasCircleRenderer implements CircleRenderer {

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private radius : number;
  private color : string;
  private outlineColor : string;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  setRadius(radius: number) {
    this.radius = radius;
  }

  setColor(color: string) {
    this.color = color;
  }

  setOutlineColour (color: string) {
    this.outlineColor = color;
  }

  draw(position: Vector2) {
    if(this.outlineColor)
      this.drawCircle(position, 1.15, this.outlineColor);

    this.drawCircle(position, 1, this.color);
  }

  /**
   * Draws a circle based on
   * parameters.
   *
   * @param position
   * @param sizeModifier
   * @param color
   */
  drawCircle(position: Vector2, sizeModifier : number, color : string) {
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, this.radius * sizeModifier, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

}

export default CanvasCircleRenderer;
