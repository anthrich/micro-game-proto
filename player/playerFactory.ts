"use strict";

import {Player} from '../../gremmage/src/js/example-app/player';

export class PlayerFactory {

    playerCount : number;

    constructor() {
        this.playerCount = 0;
    }

    /**
     * @param clientId
     * @param props
     * @param updateGameState
     * @returns {Player}
     */
    make(clientId : string, updateGameState : Function) : Player
    {
        var player = new Player(this.playerCount, clientId);

        this.playerCount ++;

        updateGameState(player);

        return player;
    }
}
