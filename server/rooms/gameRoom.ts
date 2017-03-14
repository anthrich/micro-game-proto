import {Room} from "colyseus";
import BattleState from "../states/battleState";
import PicksState from "../states/picksState";

export class GameRoom extends Room<any> {
	delta: number;

	constructor(options) {
		super(options)

		this.setPatchRate(1000 / 20)
		this.delta = 1000 / 60;
		this.setState(new PicksState());
		this.setSimulationInterval(this.tick.bind(this), this.delta)
	}
	
	requestJoin(options) {
		return this.clients.length <= 2;
	}
	
	onJoin(client) {
		this.state.onJoin(client);
	}

	onLeave(client) {
		this.state.onLeave(client);
	}
	
	onMessage(client, data) {
		this.state.onMessage(client, data);
	}

	onDispose() {
		console.log("Dispose ChatRoom");
	}
	
	tick() {
		this.state.update(this.delta);
	}
}
