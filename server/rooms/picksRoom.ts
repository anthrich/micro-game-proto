import {Room} from "colyseus";
import PicksState from "../states/picksState";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';
import {TurnStatus} from "./picks/Turn";
import BattleState from "../states/battleState";

export class PicksRoom extends Room<any> {
	delta: number;

	constructor(options) {
		super(options)

		this.setPatchRate(1000 / 20)
		this.delta = 1000 / 60;
		this.setState(new PicksState());
		this.setSimulationInterval(this.tick.bind(this), this.delta);
	}
	
	requestJoin(options) {
		return this.clients.length < 2;
	}
	
	onJoin(client) {
		this.state.onJoin(client);
	}

	onLeave(client) {
		this.state.onLeave(client);
	}
	
	onMessage(client, data) {
		if(client != this.state.activeTurn.activeClient)
			return;

		if(data.message = 'client_selection') {
			this.state.handleSelection(client, data);
		}
	}

	onDispose() {
		this.state.reset();
	}
	
	tick() {
		this.state.update(this.delta);
	}
}
