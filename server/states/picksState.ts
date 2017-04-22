import {Client} from "colyseus";
import {SelectionLobbyStatus} from '../../client/js/ui/picks/SelectionLobbyStatus';
import {PlayerSelectionsModel} from '../rooms/picks/PlayerSelectionsModel';
import Heroes from '../rooms/picks/heroes';
import Turn from "../rooms/picks/Turn";
import {TurnStatus} from "../rooms/picks/Turn";
import ServerGameState from "./IGameState";
import {ServerGameStates} from "./IGameState";
import {IHeroPortrait} from "../../game/IHeroPortrait";

export default class PicksState extends ServerGameState {
    clients : Array<Client>;
    status : number;
    pickOrder : Array<number>;
    turns: Array<Turn>;
    activeTurn : Turn;
    selections : Array<PlayerSelectionsModel>;
    available : Array<IHeroPortrait>;
    completeCallback : Function;

    constructor() {
        super(ServerGameStates.PICKS);

        this.clients = Array<Client>();
        this.turns = Array<Turn>();
        this.status = SelectionLobbyStatus.INIT;
        this.pickOrder = [0,1,1,0,1,0,1,0,1,0];
        this.selections = Array<PlayerSelectionsModel>();
        this.available = Heroes.get();
        this.completeTurn = this.completeTurn.bind(this);
    }

    update(delta: number) {
        if(this.status == SelectionLobbyStatus.PICKS_COMPLETE) {
            this.completeCallback(this.selections);
            return;
        }

        if(this.activeTurn == undefined) return;

        if(this.isCompleteTurn()) {
            this.startTurn(this.activeTurn.next());
        }
        
        this.activeTurn.update(delta);
    }

    onMessage(client: Client, data) {
        if(client != this.activeTurn.activeClient)
            return;

        if(data.message = 'client_selection') {
            this.handleSelection(client, data);
        }
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
        this.startTurn(0);
    }

    makeTurn(pos : number, client : Client, other : Client) : Turn {
        let turn = new Turn(pos, client, other);
        turn.doOnComplete(this.completeTurn);

        return turn;
    }

    completeTurn(turn : Turn) {
        if(turn.status == TurnStatus.OUT_OF_TIME) {
            this.selectRandom(turn.activeClient);
        }
    }
    
    isCompleteTurn() {
        return this.activeTurn.status == TurnStatus.COMPLETE
            || this.activeTurn.status == TurnStatus.OUT_OF_TIME;
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

    toJSON() : {} {
        return {
            id : this.id,
            status : this.status,
            selections : this.selections,
            available : this.available,
            activeTurn : this.activeTurn
        }
    }

    addSelection(client : Client, selection : IHeroPortrait) {
        this.selections.find(s => s.getClientId() == client.id)
            .addSelection(selection);

        selection.available = false;
    }

    getSelection(id) : IHeroPortrait {
        return this.available.find(s => s.id == id);
    }
    
    handleSelection(client, data) {
        let selection = this.getSelection(data.selection.id);
        
        if(selection.available == false || this.activeTurn.activeClient != client)
            return;
        
        this.addSelection(client, selection);
        this.activeTurn.complete();
    }

    onComplete(cb : Function) {
        this.completeCallback = cb;
    }
}