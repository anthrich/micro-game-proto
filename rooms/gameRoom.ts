import {Room} from "colyseus";
import GameObject from '../../gremmage/src/js/game-engine/game-object';
import MovementComponent from '../../gremmage/src/js/game-engine/movement-component';
import {PlayerFactory} from "../player/playerFactory";

class ServerGameObject extends GameObject {
	playerId : number;

	constructor(playerId: number, gameObjectId : string) {
		super(gameObjectId);
		this.addComponent(new MovementComponent());
		this.playerId = playerId;
	}
}

export class GameRoom extends Room<any> {
	
	gameState: any;
	delta: number;
	playerFactory : PlayerFactory;
	
	constructor(options) {
		super(options)
		
		// Broadcast patched state to all connected clients at 20fps (50ms)
		this.setPatchRate(1000 / 20)
		// Call game simulation at 60fps (16.6ms)
		this.delta = 1000 / 60;
		this.setSimulationInterval(this.tick.bind(this), this.delta)
		
		// // Call this function if you intend to implement delay compensation
		// // techniques in your game
		// this.useTimeline()
		this.gameState = {
			players: [],
			gameObjects: []
		};
		this.setState(this.gameState);
		this.playerFactory = new PlayerFactory();
	}
	
	requestJoin(options) {
		// only allow 10 clients per room
		return this.clients.length < 10;
	}
	
	onJoin(client) {
		console.log(client.id, "joined game!");

		let newPlayer = this.playerFactory.make(client.id, this.addPlayerToState);

		let object = new ServerGameObject(newPlayer.id, client.id);

		newPlayer.addObject(object);

		this.gameState.gameObjects.push(object);
	}
	
	onLeave(client) {
		console.log(client.id, "left on GameRoom");

		this.gameState.players = this.gameState.players
            .filter(pl => pl.clientId != client.id);

		this.gameState.gameObjects = this.gameState.gameObjects
			.filter(go => go.id != client.id);
	}
	
	onMessage(client, data) {
		console.log(client.id, "sent message on GameRoom");
		var currentObject = this.gameState.gameObjects
			.find(go => go.id === client.id);
		currentObject.components
			.filter(c => c instanceof MovementComponent)
			.forEach((c) => {
				let mc = c as MovementComponent;
				mc.targetPosition.x = data.x;
				mc.targetPosition.y = data.y;
			})
	}
	
	onDispose() {
		console.log("Dispose ChatRoom");
	}
	
	tick() {
		this.gameState.gameObjects.forEach((go) => {
			go.update(this.delta);
		});
	}

	/**
	 * Adds player to gamestate.
	 *
	 * @param player
	 */
	addPlayerToState = (player) => {
		this.gameState.players.push(player);
	}
}
