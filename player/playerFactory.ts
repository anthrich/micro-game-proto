"use strict";

import {Player} from '../../gremmage/src/js/example-app/player';

export class PlayerFactory {

    playerCount : number;
    colors : Array<string>;

    constructor() {
        this.playerCount = 0;

        this.colors = Array<string>();
        this.colors.push('blue');
        this.colors.push('yellow');
    }

    /**
     * @param clientId
     * @param props
     * @param updateGameState
     * @returns {Player}
     */
    make(clientId : string, updateGameState : Function) : Player
    {
        var player = new Player(this.playerCount, this.colors[this.playerCount], clientId);

        this.playerCount ++;

        updateGameState(player);

        return player;
    }
}
