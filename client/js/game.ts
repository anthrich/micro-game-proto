import MovementComponent from '../../game-engine/movement-component';
import GameState from '../../game-engine/game-state';
import Circle from './circle';
import CanvasGameStateIntegration from "../../game-engine/canvas-integration/canvas-game-state-integration";
import { Client, Room } from 'colyseus.js';
import {Player} from "../../game/Player";
import Keyboard from "../../game-engine/input/Keyboard";
import GameObject from "../../game-engine/game-object";
import {Hero} from "../../game/Hero";

export default class ClientGameState extends GameState {

  player: Player;
  client : Client;
  room : Room<Object>;
  players : Array<Player>;
  keyboard : Keyboard;

  constructor(client : Client, room : Room<Object>) {
    super();

    this.client = client;
    this.room = room;
    this.keyboard = new Keyboard();
  }

  onGameStateReady() {
    let self = this;
    this.players = Array<Player>();

    this.room.onUpdate.add(function(state) {

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
      let newGo = new Hero(newObject.id, newObject.name, newObject.url);
      newGo.addDrawable(this.drawableFactory.getImageRenderer("/img/mychar.png"));
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
    let selectedObjects = this.getCurrentPlayer()
        .selectedGameObjects;

    if(!selectedObjects) return;

    this.room.send({
      "selected" : selectedObjects,
      "x": x,
      "y": y
    });
  }

  onKeyUp(e : KeyboardEvent) {
    this.keyboard.registerKeysUp(e);

    this.keyboard.up('tab', function() {
      console.log('TAB key released');
    });
  }

  onKeyDown(e : KeyboardEvent) {
    this.keyboard.registerKeysDown(e);
    let player = this.getCurrentPlayer();

    this.keyboard.down(['any number'], () => {
      let objIndex = this.keyboard.lastKey() - 1;

      if(objIndex > player.gameObjects.length) return;

      player.selectedGameObjects = [player.gameObjects[objIndex].id];
    })
  }

  getCurrentPlayer() {
    return this.players
        .find(pl => pl.clientId == this.client.id)
  }
}
