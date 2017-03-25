import ServerGameState from "../../states/IGameState";
import RoomMessage from "./RoomMessage";

export default class NewStateMessage implements RoomMessage {
    type : string;
    data : any;

    constructor(state : ServerGameState) {
        this.type = 'new_state';
        this.data = state;
    }
}