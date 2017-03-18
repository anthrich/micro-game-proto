export interface HeroPortraitInterface {
    id : number;
    name : string;
    url : string;
    available : boolean;
}

export default class HeroPortrait {
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