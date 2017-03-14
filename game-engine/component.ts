import GameObject from "./game-object";

abstract class Component {
  
  gameObjectGetter: () => GameObject;

  registerGameObject(gameObjectGetter: () => GameObject) {
    this.gameObjectGetter = gameObjectGetter;
  }

  abstract update(delta: number);
}

export default Component;
