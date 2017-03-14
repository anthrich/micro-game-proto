"use strict";

import {Player} from '../../client/js/player/player';
import {PlayerSelectionsModel} from "../../client/js/ui/data/PlayerSelectionsModel";
import {ServerGameObject} from "../game-objects/ServerGameObject";
import HeroPortrait from '../../client/js/ui/data/HeroPortrait';

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

    /**
     * @param clientId
     * @param playerSelections
     * @param updateGameState
     * @returns {Player}
     */
    make(clientId : string, playerSelections : PlayerSelectionsModel) : Player
    {
        var player = new Player(this.playerCount, this.colors[this.playerCount], clientId);

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
    protected createGameObjects(player, playerSelections: Array<HeroPortrait>)
    {
        let payload = Array<ServerGameObject>();

        playerSelections.forEach((s) => {
            payload.push(new ServerGameObject(player.id, uuid()));
        });

        return payload;
    }
}
