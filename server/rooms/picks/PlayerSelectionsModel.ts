import {Hero} from "../../../game/Hero";

export class PlayerSelectionsModel {
    protected clientId:string;
    protected selections : Array<Hero>;
    protected maxSelections: number;

    constructor(clientId) {
        this.clientId = clientId;
        this.selections = [];
        this.maxSelections = 5;
    }

    addSelection(selection : Hero) {
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