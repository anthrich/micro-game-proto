import {Player} from '../../client/js/player/player';
import {ServerGameObject} from "../game-objects/ServerGameObject";
import IGameState from "./IGameState";
import {Client} from "colyseus";
import MovementComponent from '../../game-engine/movement-component';
import {PlayerFactory} from "../player/playerFactory";
import {PlayerSelectionsModel} from '../rooms/picks/PlayerSelectionsModel';


export default class BattleState implements IGameState {
    players : Array<Player>;
    gameObjects : Array<ServerGameObject>;
    playerSelections : Array<PlayerSelectionsModel>;
    private playerFactory : PlayerFactory;
    completeCallback : Function;

    constructor(playerSelections : Array<PlayerSelectionsModel>) {
        this.players = Array<Player>();
        this.gameObjects = Array<ServerGameObject>();
        this.playerFactory = new PlayerFactory();
        this.playerSelections = playerSelections;
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
        let playerSel = this.playerSelections.find(s => s.getClientId() == client.id);
        let player = this.playerFactory.make(client.id, playerSel);
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

    moveObject(obj, pos) {
        obj.components
            .filter(c => c instanceof MovementComponent)
            .forEach((c) => {
                let mc = c as MovementComponent;
                mc.targetPosition.x = pos.x;
                mc.targetPosition.y = pos.y;
            })
    }

    onComplete(cb : Function) {
        this.completeCallback = cb;
    }

    toJSON() {
        return {
            "players" : this.players,
            "gameObjects" : this.gameObjects
        }
    }
}