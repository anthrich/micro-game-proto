import {PlayerSelectionsModel} from "../../../../server/rooms/picks/PlayerSelectionsModel";
import HeroPortrait from "../models/HeroPortrait";
import Heroes from '../../../../server/rooms/picks/heroes';
import {SelectionLobbyStatus} from "./SelectionLobbyStatus";
import UiPlayerSelectionsModel from "../models/UiPlayerSelectionsModel";

export  default class SelectionLobbyState {
    selections : Array<UiPlayerSelectionsModel>;
    available : Array<HeroPortrait>;
    clientId : string;
    overlayMessage : string;
    showOverlay : boolean;
    status : number;
    turnTime : number;
    turnElapsed : number;

    constructor() {
        this.available = Heroes.get();
        this.selections = Array<UiPlayerSelectionsModel>();
        this.overlayMessage = 'Connecting to server';
        this.showOverlay = true;
        this.status = SelectionLobbyStatus.INIT;
        this.turnElapsed = 0;
        this.turnTime = 0;
    }
}