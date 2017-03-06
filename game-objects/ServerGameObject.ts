import GameObject from '../../gremmage/src/js/game-engine/game-object';
import MovementComponent from '../../gremmage/src/js/game-engine/movement-component';

export class ServerGameObject extends GameObject {
    playerId : number;

    constructor(playerId: number, gameObjectId : string) {
        super(gameObjectId);
        this.addComponent(new MovementComponent());
        this.playerId = playerId;
    }
}