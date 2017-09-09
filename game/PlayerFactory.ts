"use strict";

import {Player} from './Player';
import {PlayerSelectionsModel} from "../server/rooms/picks/PlayerSelectionsModel";
import {ServerGameObject} from "../server/game-objects/ServerGameObject";
import {Hero} from './Hero';
import Vector2 from "../game-engine/vector2";

var uuid = require('uuid/v1');

export class PlayerFactory {

    playerCount : number;
    colors : Array<string>;

    constructor() {
        this.playerCount = 0;
        this.colors = Array<string>();
        this.colors.push('#ff69be');
        this.colors.push('#e6a04d');
    }

    make(clientId : string, playerSelections : PlayerSelectionsModel) : Player
    {
        var player = new Player(this.playerCount, this.colors[this.playerCount], clientId);
        player.setStartingZone(new Vector2(this.playerCount * 300 + 200, 400), 200);

        this.playerCount ++;

        let objects  = this.createGameObjects(player, playerSelections.getSelections());

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
    protected createGameObjects(player, playerSelections: Array<Hero>)
    {
        let payload = Array<ServerGameObject>();

        playerSelections.forEach((s) => {
            payload.push(new ServerGameObject(player.id, uuid()));
        });

        return payload;
    }
}
