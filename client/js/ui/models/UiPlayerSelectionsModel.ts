import {PlayerSelectionsModel} from "../../../../server/rooms/picks/PlayerSelectionsModel";
import {HeroPortraitInterface, default as HeroPortrait} from "./HeroPortrait";
import NullHeroPortrait from "./NullHeroPortrait";

export default class UiPlayerSelectionsModel extends PlayerSelectionsModel {

    constructor(clientId) {
        super(clientId);

        for(let a = 0; a < this.getMaxSelections(); a++) {
            this.addSelection(new NullHeroPortrait());
        }
    }

    sync(selections : Array<HeroPortraitInterface>) {
        selections.forEach((item,index) => {
            this.addSelectionAt(index, item);
        });
    }

    addSelectionAt(index, item : HeroPortraitInterface) {
        if(this.selections[index] && this.selections[index].id == item.id)
            return;

        if(index >= this.maxSelections) {
            throw new Error('Out of bounds. A player can only have ' + this.maxSelections + ' selections');
        }

        this.selections[index] = new HeroPortrait(item.id, item['name'], item['url']);
    }
}