import GameState from "../game-state";
import CanvasDrawableFactory from "./canvas-drawable-factory";
import Keyboard from "../input/Keyboard";
class CanvasGameStateIntegration {

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState : GameState;
  private window: Window;
  protected keyboard;

  constructor(canvas: HTMLCanvasElement, gameState: GameState, window: Window) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState;
    this.window = window;
  }

  initialize() {
    let drawableFactory = new CanvasDrawableFactory(this.canvas);
    this.gameState.setDrawableFactory(drawableFactory);

    this.canvas.addEventListener('mousedown', (e) => {
      this.gameState.onMouseDown(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('keydown', (e) => {
      this.gameState.onKeyDown(e);
    });

    this.canvas.addEventListener('keyup', (e) => {
      this.gameState.onKeyUp(e);
    });

    let drawLoop = () => {
      this.canvas.width = this.window.innerWidth;
      this.canvas.height = this.window.innerHeight;
      this.gameState.draw();
      window.requestAnimationFrame(drawLoop);
    }

    let updateLoop = () => {
      this.gameState.update(20);
    };

    this.gameState.onGameStateReady();
    drawLoop();
    setInterval(updateLoop, 20);
  }
}

export default CanvasGameStateIntegration;
