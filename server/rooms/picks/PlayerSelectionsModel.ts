import {HeroPortraitInterface} from "../../../client/js/ui/models/HeroPortrait";

export class PlayerSelectionsModel {
    protected clientId:string;
    protected selections : Array<HeroPortraitInterface>;
    protected maxSelections: number;

    constructor(clientId) {
        this.clientId = clientId;
        this.selections = [];
        this.maxSelections = 5;
    }

    addSelection(selection : HeroPortraitInterface) {
        if(this.selections.length >= this.maxSelections) {
            throw new Error('A player cannot have more than ' + this.maxSelections + ' selections');
        }

        this.selections.push(selection);
    }

    getSelections() {
        return this.selections
    }

    getMaxSelections() {
        return this.maxSelections;
    }

    getClientId() {
        return this.clientId;
    }
}