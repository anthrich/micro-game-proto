"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const ServerGameObject_1 = require("../server/game-objects/ServerGameObject");
const vector2_1 = require("../game-engine/vector2");
var uuid = require('uuid/v1');
class PlayerFactory {
    constructor() {
        this.playerCount = 0;
        this.colors = Array();
        this.colors.push('#ff69be');
        this.colors.push('#e6a04d');
    }
    make(clientId, playerSelections) {
        var player = new Player_1.Player(this.playerCount, this.colors[this.playerCount], clientId);
        player.setStartingZone(new vector2_1.default(this.playerCount * 300 + 200, 400), 200);
        this.playerCount++;
        let objects = this.createGameObjects(player, playerSelections.getSelections());
        objects.forEach(o => player.addObject(o));
        return player;
    }
    /**
     * Temp code: probably want a separate factory
     * for this, once we figure out how it's going
     * to work.
     *
     * @param player
     * @param playerSelections
     */
    createGameObjects(player, playerSelections) {
        let payload = Array();
        playerSelections.forEach((s) => {
            payload.push(new ServerGameObject_1.ServerGameObject(player.id, uuid()));
        });
        return payload;
    }
}
exports.PlayerFactory = PlayerFactory;
