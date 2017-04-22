"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("../game-engine/game-object");
class Hero extends game_object_1.default {
    constructor(id, name, url) {
        super(id);
        this.name = name;
        this.url = url;
        this.available = true;
    }
}
exports.Hero = Hero;
