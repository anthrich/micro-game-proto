import MovementComponent from '../../game-engine/movement-component';
import GameState from '../../game-engine/game-state';
import Circle from './circle';
import CanvasGameStateIntegration from "../../game-engine/canvas-integration/canvas-game-state-integration";
import { Client, Room } from 'colyseus.js';
import {Player} from "./player/player";

class ExampleGameState extends GameState {

  player: Player;
  playerMovementComponent: MovementComponent;
  client : Client;
  room : Room<Object>;
  players : Array<Player>;

  constructor() {
    super();
  }

  onGameStateReady() {
    let self = this;
    this.client = new Client('ws://localhost:3553');
    this.room = this.client.join("game_room");
    this.players = Array<Player>();

    this.room.onUpdate.add(function(state) {
      console.log(state);
      state.gameObjects.forEach(newGo => {
        let currentGo = self.gameObjects.find(eGo => eGo.id === newGo.id);
        if(!currentGo) currentGo = addNewGameObject(newGo);
        currentGo.setPosition(newGo.position);
      });

      state.players.forEach(newPl => {
        let currentPlayer = self.players.find(ePl => ePl.id === newPl.id);
        if(!currentPlayer) addNewPlayer(newPl);
      });
    });

    this.room.onData.add(function(data) {
      console.log(data);
    });

    this.room.onLeave.add(function(a) {});

    /**
     * @param newObject
     * @returns {Circle}
     */
    let addNewGameObject = (newObject) => {
      let newGo = new Circle(newObject.id, 20, '#3b87b1', self.drawableFactory.getCircleRenderer());
      self.gameObjects.push(newGo);

      return newGo;
    };

    /**
     * @param serverPlayer
     * @returns {Player}
     */
    let addNewPlayer = (serverPlayer) => {
      let localPlayer = new Player(serverPlayer.id, serverPlayer.color, serverPlayer.clientId);
      self.players.push(localPlayer);

      if(localPlayer.clientId == self.client.id) self.player = localPlayer;

      serverPlayer.gameObjects.forEach(sGo => {
        let localGo = self.gameObjects.find(eGo => eGo.id === sGo.id);
        if(localGo) localPlayer.addObject(localGo);
      });

      localPlayer.stylizeObjects();

      return localPlayer;
    };
  }

  onMouseDown(x: number, y: number) {
    let selectedObjects = this.players
        .find(pl => pl.clientId == this.client.id)
        .selectedGameObjects;

    if(!selectedObjects) return;

    this.room.send({
      "selected" : selectedObjects,
      "x": x,
      "y": y
    });
  }
}

(() => {
  let canvas = <HTMLCanvasElement>document.getElementById("canvas");
  let gameState = new ExampleGameState();
  let gameStateIntegration = new CanvasGameStateIntegration(canvas, gameState, window);
  gameStateIntegration.initialize();
})();
