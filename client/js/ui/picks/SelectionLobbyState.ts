import {PlayerSelectionsModel} from "../data/PlayerSelectionsModel";
import HeroPortrait from "../data/HeroPortrait";
import Heroes from '../data/heroes';
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