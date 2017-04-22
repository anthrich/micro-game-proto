import {PlayerSelectionsModel} from "../../../../server/rooms/picks/PlayerSelectionsModel";
import NullHeroPortrait from "./NullHeroPortrait";
import {IHeroPortrait} from "../../../../game/IHeroPortrait";
import {Hero} from "../../../../game/Hero";

export default class UiPlayerSelectionsModel extends PlayerSelectionsModel {

    constructor(clientId) {
        super(clientId);

        for(let a = 0; a < this.getMaxSelections(); a++) {
            this.addSelection(new NullHeroPortrait());
        }
    }

    sync(selections : Array<IHeroPortrait>) {
        selections.forEach((item,index) => {
            this.addSelectionAt(index, item);
        });
    }

    addSelectionAt(index, item : IHeroPortrait) {
        if(this.selections[index] && this.selections[index].id == item.id)
            return;

        if(index >= this.maxSelections) {
            throw new Error('Out of bounds. A player can only have ' + this.maxSelections + ' selections');
        }

        this.selections[index] = new Hero(item.id, item['name'], item['url']);
    }
}