"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../client/js/circle");
const vector2_1 = require("../game-engine/vector2");
class Player {
    /**
     * @param clientId
     * @param name
     */
    constructor(id, color, clientId) {
        this.id = id;
        this.color = color;
        this.clientId = clientId;
        this.gameObjects = Array();
        this.selectedGameObjects = Array();
        this.startingZoneOrigin = new vector2_1.default(0, 0);
    }
    setStartingZone(origin, size) {
        this.startingZoneOrigin = origin;
        this.startingZoneRadius = size;
    }
    getRandomStartingPosition() {
        const startingVector = new vector2_1.default(1, 0);
        const distanceFromOrigin = Math.random() * this.startingZoneRadius;
        const randomRadian = Math.random() * Math.PI * 2;
        const cosine = Math.cos(randomRadian);
        const sine = Math.sin(randomRadian);
        let startAngle = new vector2_1.default(startingVector.x * cosine - startingVector.y * sine, startingVector.x * sine + startingVector.y * cosine);
        startAngle = vector2_1.default.scale(distanceFromOrigin, startAngle);
        return vector2_1.default.sum(startAngle, this.startingZoneOrigin);
    }
    /**
     * @param obj GameObject
     */
    addObject(obj) {
        obj.setPosition(this.getRandomStartingPosition());
        this.gameObjects.push(obj);
    }
    /**
     * @param objs GameObject[]
     */
    addObjects(objs) {
        for (let i in objs) {
            this.addObject(objs[i]);
        }
    }
    stylizeObjects() {
        this.gameObjects.filter(go => go instanceof circle_1.default)
            .forEach(go => {
            let cGo = go;
            cGo.setOutlineColor(this.color);
        });
    }
}
exports.Player = Player;
