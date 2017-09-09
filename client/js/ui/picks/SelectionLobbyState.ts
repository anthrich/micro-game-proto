import Heroes from '../../../../server/rooms/picks/heroes';
import {SelectionLobbyStatus} from "./SelectionLobbyStatus";
import UiPlayerSelectionsModel from "../models/UiPlayerSelectionsModel";
import {IHeroPortrait} from "../../../../game/IHeroPortrait";

export  default class SelectionLobbyState {
    selections : Array<UiPlayerSelectionsModel>;
    available : Array<IHeroPortrait>;
    clientId : string;
    showOverlay : boolean;
    status : number;
    turnTime : number;
    turnElapsed : number;
    isActiveClient : boolean;

    constructor(clientId : string) {
        this.available = Heroes.get();
        this.selections = Array<UiPlayerSelectionsModel>();
        this.showOverlay = true;
        this.status = SelectionLobbyStatus.INIT;
        this.turnElapsed = 0;
        this.turnTime = 0;
        this.isActiveClient = false;
        this.clientId = clientId;
    }
}