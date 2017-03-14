import IGameState from "./IGameState";
import {Client} from "colyseus";
import {SelectionLobbyStatus} from '../../gremmage/src/js/example-app/ui/picks/SelectionLobbyStatus';
import {PlayerSelectionsModel} from '../../gremmage/src/js/example-app/ui/data/PlayerSelectionsModel';
import HeroPortrait from '../../gremmage/src/js/example-app/ui/data/HeroPortrait'
import Heroes from '../../gremmage/src/js/example-app/ui/data/heroes';

export default class PicksState implements IGameState {
    clients : Array<Client>;
    status : number;
    currentPick : number;
    pickOrder : Array<number>;
    pickDuration: number;
    activeClient : Client;
    waitingClient : Client;
    selections : Array<PlayerSelectionsModel>;
    available : Array<HeroPortrait>;

    constructor() {
        this.clients = Array<Client>();
        this.status = SelectionLobbyStatus.INIT;
        this.currentPick = 0;
        this.pickDuration = 3000;
        this.pickOrder = [0,1,1,0,1,0,1,0,1,0];
        this.selections = Array<PlayerSelectionsModel>();
        this.available = Heroes;
    }

    update(delta: number) {
 
    }

    onMessage(client: Client, data) {
        console.log(client + "sent message");
    }

    onJoin(client: Client) {
        this.clients.push(client);

        this.selections.push(new PlayerSelectionsModel(client.id));

        if(this.clients.length == 2) {
            this.status = SelectionLobbyStatus.ACTIVE;
            return;
        }

        this.status = SelectionLobbyStatus.WAITING;
    }

    onLeave(client) {
        console.log(client + "dropped");
    }

    newPick() {
        this.assignClients();

        //start timer?

        this.currentPick ++;
    }

    assignClients() {
        let pickId = this.pickOrder[this.currentPick];

        this.clients.forEach((c,index) => {
            if(index == pickId) {
                this.activeClient = this.clients[index];
            } else {
                this.waitingClient = this.clients[index];
            }
        })

        return this.clients[pickId];
    }

    toJSON() {
        return {
            status : this.status,
            selections : this.selections,
            available : this.available
        }
    }
}