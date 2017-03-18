import {Client} from "colyseus";

export enum TurnStatus {
    PENDING,
    ACTIVE,
    COMPLETE,
    OUT_OF_TIME
}

export default class Turn {
    pos : number;
    activeClient : Client;
    waitingClient: Client;
    duration : number;
    elapsed : number;
    status : number;
    completeCb : Function;

    constructor(pos, client, otherClient) {
        this.pos = pos;
        this.activeClient = client;
        this.waitingClient = otherClient;
        this.duration = 4000;
        this.elapsed = 0;
        this.status = TurnStatus.PENDING;
    }

    begin() {
        this.status = TurnStatus.ACTIVE;
    }

    update(delta) {
        if(this.status != TurnStatus.ACTIVE)
            return;

        if(this.isOutOfTime()) {
            this.outOfTime();
            return;
        }

        this.elapsed += delta;
    }

    outOfTime() {
        this.status = TurnStatus.OUT_OF_TIME;
        this.onComplete();
    }

    complete() {
        this.status = TurnStatus.COMPLETE;
        this.onComplete();
    }

    onComplete() {
        if(typeof this.completeCb == 'function') {
            this.completeCb(this);
        }
    }

    isOutOfTime() {
        return this.elapsed >= this.duration;
    }

    next() {
        return this.pos + 1;
    }

    doOnComplete(cb : Function) {
        this.completeCb = cb;
    }
}