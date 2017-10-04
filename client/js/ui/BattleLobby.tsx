import * as React from 'react';
import ExampleGameState from "../game";
import CanvasGameStateIntegration from "../../../game-engine/canvas-integration/canvas-game-state-integration";
import IColyseusLobby from "./ColyseusLobbyInterface";

export default class BattleLobby extends React.Component<IColyseusLobby, any> {
   
    componentDidMount() {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let gameState = new ExampleGameState(this.props.client, this.props.colyseus.room);
        let gameStateIntegration = new CanvasGameStateIntegration(canvas, gameState, window);
        gameStateIntegration.initialize();
    }

    render () {
        return (
            <canvas id="canvas" tabIndex={1}></canvas>
        );
    }
}