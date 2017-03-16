import {PlayerSelectionsModel} from "../../../../server/rooms/picks/PlayerSelectionsModel";

export interface PlayerSelectionsInterface {
    current_user : boolean;
    selections : PlayerSelectionsModel
}