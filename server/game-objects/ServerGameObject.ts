import GameObject from '../../game-engine/game-object';
import MovementComponent from '../../game-engine/movement-component';

export class ServerGameObject extends GameObject {
    playerId : number;

    constructor(playerId: number, gameObjectId : string) {
        super(gameObjectId);
        this.addComponent(new MovementComponent());
        this.playerId = playerId;
    }
}