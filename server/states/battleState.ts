import {Player} from '../../client/js/player/player';
import {ServerGameObject} from "../game-objects/ServerGameObject";
import {Client} from "colyseus";
import MovementComponent from '../../game-engine/movement-component';
import {PlayerFactory} from "../player/playerFactory";
import {PlayerSelectionsModel} from '../rooms/picks/PlayerSelectionsModel';
import ServerGameState from "./IGameState";
import {ServerGameStates} from "./IGameState";
import Vector2 from "../../game-engine/vector2";

export default class BattleState extends ServerGameState{
    players : Array<Player>;
    gameObjects : Array<ServerGameObject>;
    playerSelections : Array<PlayerSelectionsModel>;
    private playerFactory : PlayerFactory;
    completeCallback : Function;

    constructor(playerSelections : Array<PlayerSelectionsModel>) {
        super(ServerGameStates.BATTLE);

        this.players = Array<Player>();
        this.gameObjects = Array<ServerGameObject>();
        this.playerFactory = new PlayerFactory();
        this.playerSelections = playerSelections;
    }

    update(delta: number) {
        this.gameObjects.forEach((go) => {
            go.update(delta);
            this.gameObjects.filter(cgo => Vector2.distance(go.position, cgo.position) < 40)
		        .forEach(cgo => {
                    let diff = Vector2.subtract(go.position, cgo.position);
                    let diffDirection = Vector2.normalise(diff);
                    go.position = Vector2.sum(go.position, Vector2.scale(go.speed / 1000 * delta * 2, diffDirection));
                    cgo.position = Vector2.subtract(cgo.position, Vector2.scale(cgo.speed / 1000 * delta * 2, diffDirection));
                });
        });
    }

    onMessage(client: Client, data) {
        let currentPlayer = this.getPlayerByClientId(client.id);

        data.selected.forEach((s) =>{
            let playerObject = currentPlayer.gameObjects
                .find(go => go.id = s);

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
                mc.setTargetPosition(pos);
            })
    }

    onComplete(cb : Function) {
        this.completeCallback = cb;
    }

    toJSON() {
        return {
            id : this.id,
            players : this.players,
            gameObjects : this.gameObjects
        }
    }
}