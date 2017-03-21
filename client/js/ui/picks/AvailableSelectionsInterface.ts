import HeroPortrait from "../models/HeroPortrait";

export interface AvailableSelectionsInterface {
    heroes : Array<HeroPortrait>,
    isActive : boolean,
    onSelect : Function
}