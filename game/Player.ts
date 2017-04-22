"use strict";
import GameObject from "../game-engine/game-object";
import Circle from "../client/js/circle";
import Vector2 from "../game-engine/vector2";

export class Player {
    id : number;
    color : string;
    clientId : string;
    name : string;
    gameObjects : GameObject[];
    selectedGameObjects : string[];
    private startingZoneOrigin: Vector2;
    private startingZoneRadius: number;

    /**
     * @param clientId
     * @param name
     */
    constructor(id: number, color:string, clientId: string) {
        this.id = id;
        this.color = color;
        this.clientId = clientId;
        this.gameObjects = Array<GameObject>();
        this.selectedGameObjects = Array<string>();
        this.startingZoneOrigin = new Vector2(0,0);
    }

    setStartingZone(origin: Vector2, size: number) {
        this.startingZoneOrigin = origin;
        this.startingZoneRadius = size;
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

    /**
     * @param obj GameObject
     */
    addObject(obj : GameObject)
    {
        obj.setPosition(this.getRandomStartingPosition());
        this.gameObjects.push(obj);
    }

    /**
     * @param objs GameObject[]
     */
    addObjects(objs : GameObject[])
    {
        for(let i in objs) {
            this.addObject(objs[i]);
        }
    }

    stylizeObjects()
    {
        this.gameObjects.filter(go => go instanceof Circle)
            .forEach(go => {
                let cGo = go as Circle;
                cGo.setOutlineColor(this.color);
            });
    }
}
