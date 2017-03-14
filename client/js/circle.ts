import GameObject from '../../game-engine/game-object';
import CircleRenderer from "../../game-engine/circle-renderer";

export default class Circle extends GameObject {

  _circleRenderer: CircleRenderer;
  radius: number;
  color: string;

  constructor(id: string, radius: number, color: string, circleRenderer: CircleRenderer) {
    super(id);
    this.radius = radius;
    this.color = color;
    this._circleRenderer = circleRenderer;
    this._circleRenderer.setColor(this.color);
    this._circleRenderer.setRadius(this.radius);
    this.addDrawable(this._circleRenderer);
  }

  setOutlineColor(color : string) {
    this._circleRenderer.setOutlineColour(color);
  }
}
