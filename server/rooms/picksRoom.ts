import {Room} from "colyseus";
import PicksState from "../states/picksState";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';
import {TurnStatus} from "./picks/Turn";

export class PicksRoom extends Room<any> {
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

		this.broadcast(this.state.toJSON());

		if (this.state.status  == SelectionLobbyStatus.ACTIVE) {
			this.startTurn(0);
		}
	}

	onLeave(client) {
		this.state.onLeave(client);
	}
	
	onMessage(client, data) {
	}

	onDispose() {
		console.log("Dispose ChatRoom");
	}
	
	tick() {
		if(this.state.status == SelectionLobbyStatus.PICKS_COMPLETE)
			return;

		if(this.haveTurn() && this.turnComplete()) {
			this.startTurn(this.state.activeTurn.next());
		}

		this.state.update(this.delta);
	}

	startTurn(turn) {
		this.state.startTurn(turn);

		this.send(this.state.activeTurn.activeClient, {status: SelectionLobbyStatus.PICKING})
		this.send(this.state.activeTurn.waitingClient, {status: SelectionLobbyStatus.OPPONENT_PICKING})
	}

	haveTurn() {
		return <boolean><Boolean> this.state.activeTurn;
	}

	turnComplete() {
		return this.state.activeTurn.status == TurnStatus.COMPLETE;
	}
}
