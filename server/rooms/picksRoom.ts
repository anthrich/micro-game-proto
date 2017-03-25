import {Room} from "colyseus";
import PicksState from "../states/picksState";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';
import {TurnStatus} from "./picks/Turn";
import BattleState from "../states/battleState";
import {PlayerSelectionsModel} from "./picks/PlayerSelectionsModel";
import ServerGameState from "../states/IGameState";
import NewStateMessage from "./messages/NewStateMessage";

export class PicksRoom extends Room<any> {
	delta: number;

	constructor(options) {
		super(options)

		this.setPatchRate(1000 / 20)
		this.delta = 1000 / 60;
		let state = new PicksState();
		state.onComplete(this.onPicksComplete);
		this.setState(state);
		this.setSimulationInterval(this.tick.bind(this), this.delta);
	}
	
	requestJoin(options) {
		return this.clients.length < 2;
	}
	
	onJoin(client) {
		this.broadcast(new NewStateMessage(this.state));
		this.state.onJoin(client);
	}

	onLeave(client) {
		this.state.onLeave(client);
	}
	
	onMessage(client, data) {
		this.state.onMessage(client, data);
	}

	onDispose() {
		console.log('Disposed of room');
	}
	
	tick() {
		this.state.update(this.delta);
	}

	onPicksComplete = (selections : Array<PlayerSelectionsModel>) => {
		let state = new BattleState(selections);
		this.changeState(state);
	}

	changeState(state : ServerGameState) {
		this.setState(state);
		this.clients.forEach(c => state.onJoin(c));
		this.broadcast(new NewStateMessage(this.state));
	}
}
