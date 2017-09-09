import {Hero} from "../../../../game/Hero";

export default class NullHeroPortrait extends Hero {
    id: string;
    name: string;
    url: string;
    available: boolean;
    
    constructor() {
        super('', '', '')
        this.available = false;
    }
}