import IGameState from "./IGameState";
import {Client} from "colyseus";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';
import {PlayerSelectionsModel} from '../rooms/picks/PlayerSelectionsModel';
import HeroPortrait from '../../client/js/ui/models/HeroPortrait'
import Heroes from '../rooms/picks/heroes';
import Turn from "../rooms/picks/Turn";

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
        this.available = Heroes;
    }

    update(delta: number) {
        if(this.activeTurn == undefined) return;

        this.activeTurn.update(delta);
    }

    onMessage(client: Client, data) {
        console.log(client + "sent message");
    }

    onJoin(client: Client) {
        if(this.clients.length >= 2) return;

        this.clients.push(client);
        this.selections.push(new PlayerSelectionsModel(client.id));

        this.init();
    }

    onLeave(client) {
        console.log(client + "dropped");
    }

    init() {
        if(this.clients.length == 1) {
            this.status = SelectionLobbyStatus.WAITING;
            return;
        }

        this.pickOrder.forEach((index, pos) => {
            let client = this.clients[index];
            let other = this.otherClient(client);

            this.turns.push(new Turn(pos, client, other));
        });

        this.status = SelectionLobbyStatus.ACTIVE;
    }

    startTurn(pos) {
        let turn = this.turns.find(t => t.pos == pos);

        if(turn) {
            this.activeTurn = turn;
            this.activeTurn.begin();
        } else {
            this.status = SelectionLobbyStatus.PICKS_COMPLETE;
        }
    }

    otherClient(client) {
        if(client.id == this.clients[0].id) {
            return this.clients[1];
        } else {
            return this.clients[0];
        }
    }

    toJSON() {
        return {
            status : this.status,
            selections : this.selections,
            available : this.available,
            activeTurn : this.activeTurn
        }
    }
}