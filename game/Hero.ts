import {IHeroPortrait} from "./IHeroPortrait";
export class Hero implements IHeroPortrait  {
    id : number;
    name : string;
    url : string;
    available : boolean;

    constructor(id, name, url) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.available = true;
    }
}