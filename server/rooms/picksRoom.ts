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
		return this.clients.length < 2;
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
		if(client != this.state.activeTurn.activeClient)
			return;

		if(data.message = 'client_selection') {
			this.handleSelection(client, data);
		}
	}

	onDispose() {
		this.state.reset();
	}
	
	tick() {
		if(this.state.status == SelectionLobbyStatus.PICKS_COMPLETE) {
			this.broadcast({status: this.state.status});
			return;
		}

		if(this.haveTurn() && this.turnComplete()) {
			this.sendSelections();
			this.startTurn(this.state.activeTurn.next());
		}

		this.state.update(this.delta);
	}

	startTurn(turn) {
		this.state.startTurn(turn);
		this.sendPickState();
	}

	sendPickState() {
		this.send(this.state.activeTurn.activeClient, {status: SelectionLobbyStatus.PICKING})
		this.send(this.state.activeTurn.waitingClient, {status: SelectionLobbyStatus.OPPONENT_PICKING})
	}

	sendSelections() {
		this.broadcast(this.state.toJSON());
	}

	haveTurn() {
		return <boolean><Boolean> this.state.activeTurn;
	}

	turnComplete() {
		let activeStatus = this.state.activeTurn.status;
		return activeStatus == TurnStatus.COMPLETE || activeStatus == TurnStatus.OUT_OF_TIME;
	}

	handleSelection(client, data) {
		let selection = this.state.getSelection(data.selection.id);

		if(selection.available == false || this.state.activeTurn.activeClient != client)
			return;

		this.state.addSelection(client, selection);
		this.state.activeTurn.complete();
	}
}
