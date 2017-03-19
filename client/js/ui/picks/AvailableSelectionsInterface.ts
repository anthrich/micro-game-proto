import HeroPortrait from "../models/HeroPortrait";

export interface AvailableSelectionsInterface {
    heroes : Array<HeroPortrait>,
    status : number,
    onSelect : Function
}