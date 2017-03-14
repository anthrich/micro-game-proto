import GameObject from "./game-object";
import IDrawableFactory from "./drawable-factory";
abstract class GameState {

  gameObjects: Array<GameObject>;

  protected drawableFactory : IDrawableFactory;

  constructor() {
    this.gameObjects = [];
  }

  setDrawableFactory(drawableFactory: IDrawableFactory) {
    this.drawableFactory = drawableFactory;
  }

  update(delta: number) {
    this.gameObjects.forEach((go) => {
      go.update(delta);
    });
  }

  draw() {
    this.gameObjects.forEach((go) => {
      go.draw();
    });
  }

  abstract onGameStateReady();
  abstract onMouseDown(x: number, y: number);
}

export default GameState;
