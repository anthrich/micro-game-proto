import {PlayerSelectionsModel} from "../../../../server/rooms/picks/PlayerSelectionsModel";
import HeroPortrait from "../models/HeroPortrait";
import Heroes from '../../../../server/rooms/picks/heroes';
import {SelectionLobbyStatus} from "./SelectionLobbyStatus";

export  default class SelectionLobbyState {
    selections : Array<PlayerSelectionsModel>;
    available : Array<HeroPortrait>;
    clientId : string;
    overlayMessage : string;
    showOverlay : boolean;
    status : number;

    constructor() {
        this.available = Heroes;
        this.selections = Array<PlayerSelectionsModel>();
        this.overlayMessage = 'Connecting to server';
        this.showOverlay = true;
        this.status = SelectionLobbyStatus.INIT;
    }
}