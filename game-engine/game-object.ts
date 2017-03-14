import Vector2 from './vector2';
import Component from './component';
import Drawable from "./drawable";

abstract class GameObject {

  position: Vector2;
  drawPosition: Vector2;
  speed: number;
  components: Array<Component>;
  drawables: Array<Drawable>;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.position = new Vector2(0, 0);
    this.drawPosition = new Vector2(this.position.x, this.position.y);
    this.speed = 100;
    this.components = [];
    this.drawables = [];
  }
  
  setPosition(pos : Vector2) {
    this.position.x = pos.x;
    this.position.y = pos.y;
  }

  addComponent(component : Component) {
      var self = this;
      component.registerGameObject(() => {return self;});
      this.components.push(component);
  }

  addDrawable(drawable: Drawable) {
    this.drawables.push(drawable);
  }

  update(delta) {
    this.components.forEach((component) => {
      component.update(delta);
    });
  }

  draw() {
    this.drawPosition.x = this.position.x;
    this.drawPosition.y = this.position.y;
    this.drawables.forEach((drawable) => {
      drawable.draw(this.drawPosition);
    });
  };
}

export default GameObject;

