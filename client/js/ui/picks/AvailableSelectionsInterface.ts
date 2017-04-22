import {IHeroPortrait} from "../../../../game/IHeroPortrait";

export interface AvailableSelectionsInterface {
    heroes : Array<IHeroPortrait>,
    isActive : boolean,
    onSelect : Function
}