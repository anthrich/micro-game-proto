import Component from './component';
import Vector2 from './vector2';
import GameObject from "./game-object";

export default class MovementComponent extends Component {

  targetPosition: Vector2;

  constructor() {
    super();
    this.targetPosition = null;
  }
  
  setTargetPosition(position : Vector2) {
    this.targetPosition = new Vector2(0,0);
    this.targetPosition.x = position.x;
    this.targetPosition.y = position.y;
  }

  registerGameObject(gameObjectGetter: () => GameObject) {
    super.registerGameObject(gameObjectGetter);
  }

  update(delta: number) {
    if(!this.targetPosition) return;
    let gameObject = this.gameObjectGetter();
    let distance = Vector2.distance(gameObject.position, this.targetPosition);
    let movementThisUpdate = gameObject.speed / 1000 * delta;

    if(distance < movementThisUpdate) {
      gameObject.position.x = this.targetPosition.x;
      gameObject.position.y = this.targetPosition.y;
      this.targetPosition = null;
      return;
    }

    let subtract = Vector2.subtract(this.targetPosition, gameObject.position);
    let direction = Vector2.normalise(subtract);
    gameObject.position = Vector2.sum(gameObject.position, Vector2.scale(movementThisUpdate, direction));
  }
}
