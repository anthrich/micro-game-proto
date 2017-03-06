export class PlayerSelections {
    protected selections : Array<string>;
    protected maxSelections: number;

    constructor() {
        this.selections = Array<string>();
        this.maxSelections = 4;
    }

    addSelection(selection : string) {
        if(this.selections.length >= this.maxSelections) {
            throw new Error('A player cannot have more than ' + this.maxSelections + ' selections');
        }

        this.selections.push(selection);
    }

    getSelections() {
        return this.selections
    }
}