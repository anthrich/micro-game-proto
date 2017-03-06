import {Room} from "colyseus";
import MovementComponent from '../../gremmage/src/js/game-engine/movement-component';
import {PlayerFactory} from "../player/playerFactory";
import {PlayerSelections} from "../player/playerSelections";

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
		let player = this.playerFactory.make(client.id, this.getPlayerSelections());
		this.addPlayerToState(player);
	}
	
	onLeave(client) {
		console.log(client.id, "left on GameRoom");

		this.gameState.players = this.gameState.players
            .filter(pl => pl.clientId != client.id);

		this.gameState.gameObjects = this.gameState.gameObjects
			.filter(go => go.id != client.id);
	}
	
	onMessage(client, data) {
		let currentPlayer = this.getPlayerByClientId(client.id);

		data.selected.forEach((s) =>{
			let playerObject = currentPlayer.gameObjects
                .find(go => go.id = s.id);

			if(!playerObject) return;

			playerObject.components
				.filter(c => c instanceof MovementComponent)
                .forEach((c) => {
					let mc = c as MovementComponent;
					mc.targetPosition.x = data.x;
					mc.targetPosition.y = data.y;
				})
		});
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
	 * @param player
	 */
	addPlayerToState = (player) => {
		this.gameState.players.push(player);

		player.gameObjects.forEach(go => this.gameState.gameObjects.push(go));
	}

	/**
	 * Temp code until 'selection/picks' game state
	 * is available.
	 *
	 * @returns {PlayerSelections}
	 */
	getPlayerSelections() : PlayerSelections {
		let playerSelections = new PlayerSelections();

		playerSelections.addSelection('ServerGameObject');
		playerSelections.addSelection('ServerGameObject');

		return playerSelections;
	}

	/**
	 * @param clientId
	 * @returns {Player|undefined}
	 */
	getPlayerByClientId(clientId) {
		return this.gameState.players
            .find(pl => pl.clientId === clientId);
	}
}
