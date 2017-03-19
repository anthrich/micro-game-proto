import IGameState from "./IGameState";
import {Client} from "colyseus";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';
import {PlayerSelectionsModel} from '../rooms/picks/PlayerSelectionsModel';
import HeroPortrait from '../../client/js/ui/models/HeroPortrait'
import Heroes from '../rooms/picks/heroes';
import Turn from "../rooms/picks/Turn";
import {TurnStatus} from "../rooms/picks/Turn";

export default class PicksState implements IGameState {
    clients : Array<Client>;
    status : number;
    pickOrder : Array<number>;
    turns: Array<Turn>;
    activeTurn : Turn;
    selections : Array<PlayerSelectionsModel>;
    available : Array<HeroPortrait>;

    constructor() {
        this.clients = Array<Client>();
        this.turns = Array<Turn>();
        this.status = SelectionLobbyStatus.INIT;
        this.pickOrder = [0,1,1,0,1,0,1,0,1,0];
        this.selections = Array<PlayerSelectionsModel>();
        this.available = Heroes.get();
        this.turnComplete = this.turnComplete.bind(this);
    }

    update(delta: number) {
        if(this.activeTurn == undefined) return;

        this.activeTurn.update(delta);
    }

    onMessage(client: Client, data) {
        console.log(client + "sent message");
    }

    onJoin(client: Client) {
        this.clients.push(client);
        this.selections.push(new PlayerSelectionsModel(client.id));

        if(this.clients.length == 1) {
            this.status = SelectionLobbyStatus.WAITING;
            return;
        }

        this.init();
    }

    onLeave(client) {
        console.log(client + "dropped");
    }

    init() {
        this.pickOrder.forEach((client_index, pos) => {
            let client = this.clients[client_index];
            let other = this.otherClient(client);
            let turn = this.makeTurn(pos, client, other);

            this.turns.push(turn);
        });

        this.status = SelectionLobbyStatus.ACTIVE;
    }

    makeTurn(pos : number, client : Client, other : Client) : Turn {
        let turn = new Turn(pos, client, other);
        turn.doOnComplete(this.turnComplete);

        return turn;
    }

    turnComplete(turn : Turn) {
        if(turn.status == TurnStatus.OUT_OF_TIME) {
            this.selectRandom(turn.activeClient);
        }
    }

    startTurn(pos) {
        let turn = this.turns.find(t => t.pos == pos);

        if(turn) {
            this.activeTurn = turn;
            this.activeTurn.begin();
        } else {
            this.status = SelectionLobbyStatus.PICKS_COMPLETE;
            console.log(this.status);
        }
    }

    selectRandom(client) {
        let avail = this.available.filter(p => p.available == true);
        let rand = Math.floor(Math.random() * (avail.length));
        let selection = avail[rand];

        if(!selection) return;

        this.addSelection(client, selection);

        selection.available = false;
    }

    otherClient(client) : Client {
        if(client.id == this.clients[0].id) {
            return this.clients[1];
        } else {
            return this.clients[0];
        }
    }

    reset() {
        this.clients = Array<Client>();
        this.turns = Array<Turn>();
        this.status = SelectionLobbyStatus.INIT;
        this.selections = Array<PlayerSelectionsModel>();
        this.available = Heroes.get();
    }

    toJSON() : {} {
        return {
            status : this.status,
            selections : this.selections,
            available : this.available,
            activeTurn : this.activeTurn
        }
    }

    addSelection(client : Client, selection : HeroPortrait) {
        this.selections.find(s => s.getClientId() == client.id)
            .addSelection(selection);

        selection.available = false;
    }

    getSelection(id) : HeroPortrait {
        return this.available.find(s => s.id == id);
    }
}