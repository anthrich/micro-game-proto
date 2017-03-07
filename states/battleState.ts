import {Player} from '../../gremmage/src/js/example-app/player';
import {ServerGameObject} from "../game-objects/ServerGameObject";
import IGameState from "./IGameState";
import {Client} from "colyseus";
import MovementComponent from '../../gremmage/src/js/game-engine/movement-component';
import {PlayerFactory} from "../player/playerFactory";
import {PlayerSelections} from "../player/playerSelections";

export default class BattleState implements IGameState {
    players : Array<Player>;
    gameObjects : Array<ServerGameObject>;
    private playerFactory : PlayerFactory;

    constructor() {
        this.players = Array<Player>();
        this.gameObjects = Array<ServerGameObject>();
        this.playerFactory = new PlayerFactory();
    }

    update(delta: number) {
        this.gameObjects.forEach((go) => {
            go.update(delta);
        });
    }

    onMessage(client: Client, data) {
        let currentPlayer = this.getPlayerByClientId(client.id);

        data.selected.forEach((s) =>{
            let playerObject = currentPlayer.gameObjects
                .find(go => go.id = s.id);

            if(!playerObject) return;

            this.moveObject(playerObject, data);
        });
    }

    onJoin(client: Client) {
        let player = this.playerFactory.make(client.id, this.getPlayerSelections());
        this.addPlayerToState(player);
    }

    onLeave(client) {
        this.players = this.players
            .filter(pl => pl.clientId != client.id);

        this.gameObjects = this.gameObjects
            .filter(go => go.id != client.id);
    }

    getPlayerByClientId(clientId) {
        return this.players
            .find(pl => pl.clientId === clientId);
    }

    addPlayerToState(player) {
        this.players.push(player);
        player.gameObjects.forEach(go => this.gameObjects.push(go));
    }

    /**
     * Temp code until 'selection/picks' game state
     * is available.
     *
     * @returns {PlayerSelections}
     */
    getPlayerSelections() : PlayerSelections {
        let playerSelections = new PlayerSelections();

        playerSelections.addSelection('ServerGameObject');
        playerSelections.addSelection('ServerGameObject');

        return playerSelections;
    }

    moveObject(obj, pos) {
        obj.components
            .filter(c => c instanceof MovementComponent)
            .forEach((c) => {
                let mc = c as MovementComponent;
                mc.targetPosition.x = pos.x;
                mc.targetPosition.y = pos.y;
            })
    }

    toJSON() {
        return {
            "players" : this.players,
            "gameObjects" : this.gameObjects
        }
    }
}