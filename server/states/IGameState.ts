import {Client} from "colyseus";

interface IGameState {
    update (delta: number);
    onMessage(client: Client, data: any);
    onLeave(client: Client);
    onJoin(client: Client, options?: any)
}

export default IGameState;

