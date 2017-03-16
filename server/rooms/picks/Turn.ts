import {Client} from "colyseus";

export enum TurnStatus {
    PENDING,
    ACTIVE,
    COMPLETE
}

export default class Turn {
    pos : number;
    activeClient : Client;
    waitingClient: Client;
    duration : number;
    elapsed : number;
    status : number

    constructor(pos, client, otherClient) {
        this.pos = pos;
        this.activeClient = client;
        this.waitingClient = otherClient;
        this.duration = 3000;
        this.elapsed = 0;
        this.status = TurnStatus.PENDING;
    }

    begin() {
        this.status = TurnStatus.ACTIVE;
    }

    update(delta) {
        if(this.status != TurnStatus.ACTIVE)
            return;

        if(this.outOfTime()) {
            this.status = TurnStatus.COMPLETE;
            return;
        }

        this.elapsed += delta;
    }

    outOfTime() {
        return this.elapsed >= this.duration;
    }

    next() {
        return this.pos + 1;
    }
}