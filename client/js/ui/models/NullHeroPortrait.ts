import {IHeroPortrait} from "../../../../game/IHeroPortrait";

export default class NullHeroPortrait implements IHeroPortrait {
    id: number;
    name: string;
    url: string;
    available: boolean;
    
    constructor() {
        this.id = null;
        this.name = '';
        this.url = '';
        this.available = false;
    }
}