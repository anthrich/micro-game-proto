import {IHeroPortrait} from "./IHeroPortrait";
import GameObject from "../game-engine/game-object";
import IDrawable from "../game-engine/drawable";

export class Hero extends GameObject implements IHeroPortrait {
    id: string;
    name : string;
    url : string;
    available : boolean;

    constructor(id, name, url) {
        super(id);
        this.name = name;
        this.url = url;
        this.available = true;
    }
}