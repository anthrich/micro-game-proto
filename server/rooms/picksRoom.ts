import {Room} from "colyseus";
import PicksState from "../states/picksState";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';

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
			this.begin();
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
		this.state.update(this.delta);
	}

	begin() {
		this.state.newPick();

		this.send(this.state.activeClient, {status: SelectionLobbyStatus.PICKING})
		this.send(this.state.waitingClient, {status: SelectionLobbyStatus.OPPONENT_PICKING})
	}
}
