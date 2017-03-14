"use strict";
import GameObject from "../../../game-engine/game-object";
import Circle from "../circle";

export class Player {
    id : number;
    color : string;
    clientId : string;
    name : string;
    gameObjects : GameObject[];
    selectedGameObjects : GameObject[];

    /**
     * @param clientId
     * @param name
     */
    constructor(id: number, color:string, clientId: string) {
        this.id = id;
        this.color = color;
        this.clientId = clientId;
        this.gameObjects = Array<GameObject>();
        this.selectedGameObjects = Array<GameObject>();
    }

    /**
     * @param obj GameObject
     */
    addObject(obj : GameObject)
    {
        this.gameObjects.push(obj);

        if(this.gameObjects.length == 1) {
            this.selectedGameObjects.push(obj);
        }
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
