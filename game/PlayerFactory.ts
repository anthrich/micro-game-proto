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
	private startingZoneOrigin: Vector2;
	private startingZoneRadius: number;

    constructor() {
        this.playerCount = 0;
        this.colors = Array<string>();
        this.colors.push('#ff69be');
        this.colors.push('#e6a04d');
	    this.startingZoneOrigin = new Vector2(0,0);
    }
	
	setStartingZone(origin: Vector2, size: number) {
		this.startingZoneOrigin = origin;
		this.startingZoneRadius = size;
	}

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
    protected createGameObjects(player, playerSelections: Array<Hero>)
    {
        var self = this;
        let payload = Array<ServerGameObject>();
        playerSelections.forEach((s) => {
            var gameObject = new ServerGameObject(player.id, uuid());
            gameObject.setPosition(self.getRandomStartingPosition());
            payload.push(gameObject);
        });

        return payload;
    }
	
	private getRandomStartingPosition() : Vector2 {
		const startingVector = new Vector2(1, 0);
		const distanceFromOrigin = Math.random() * this.startingZoneRadius;
		const randomRadian = Math.random() * Math.PI * 2;
		const cosine = Math.cos(randomRadian);
		const sine = Math.sin(randomRadian);
		let startAngle = new Vector2(
			startingVector.x * cosine - startingVector.y * sine,
			startingVector.x * sine + startingVector.y * cosine
		)
		startAngle = Vector2.scale(distanceFromOrigin, startAngle);
		return Vector2.sum(startAngle, this.startingZoneOrigin);
	}
}
