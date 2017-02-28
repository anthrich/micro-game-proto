import {Room} from "colyseus";
import GameObject from '../../gremmage/src/js/game-engine/game-object';
import MovementComponent from '../../gremmage/src/js/game-engine/movement-component';

class ServerGameObject extends GameObject {
	
	constructor(clientId: string) {
		super(clientId);
		this.addComponent(new MovementComponent())
	}
}

export class GameRoom extends Room<any> {
	
	gameState: any;
	delta: number;
	
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
		this.gameState = {gameObjects: []};
		this.setState(this.gameState)
	}
	
	requestJoin(options) {
		// only allow 10 clients per room
		return this.clients.length < 10;
	}
	
	onJoin(client) {
		console.log(client.id, "joined game!");
		let newPlayer = new ServerGameObject(client.id);
		this.gameState.gameObjects.push(newPlayer);
	}
	
	onLeave(client) {
		this.gameState.gameObjects = this.gameState.gameObjects
			.filter(go => go.id != client.id);
	}
	
	onMessage(client, data) {
		console.log(client.id, "sent message on GameRoom")
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
		// This is your 'game loop'.
		// Inside function you'll have to run the simulation of your game.
		//
		// You should:
		// - move entities
		// - check for collisions
		// - update the state
		//
		
		// // Uncomment this line to see the simulation running and clients receiving the patched state
		// // In this example, the server simply adds the elapsedTime every 2 messages it receives
		// if ( this.state.messages.length % 3 == 0 ) {
		//   this.state.messages.push(`${ this.clock.elapsedTime }: even`)
		// }
	}
}
