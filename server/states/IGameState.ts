import {Client} from "colyseus";

export enum ServerGameStates {
    PICKS,
    BATTLE
}

abstract class ServerGameState {
    id : number;

    constructor(id : number) {
        this.id = id;
    }

    abstract update (delta: number);
    abstract onMessage(client: Client, data: any);
    abstract onLeave(client: Client);
    abstract onJoin(client: Client, options?: any);
    abstract onComplete(cb : Function);
}

export default ServerGameState;

