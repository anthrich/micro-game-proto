import * as React from 'react';
import SelectionLobby from './picks/SelectionLobby';
import {ServerGameStates} from "../../../server/states/IGameState";
import BattleLobby from "./BattleLobby";
import {Client} from "colyseus.js";
import ColyseusConnector from "../colyseusConnector";

class AppState {
    game_state : number;
    client : Client;
}

interface AppProps {
    colyseus : ColyseusConnector;
}

export default class App extends React.Component<AppProps, AppState> {
   
    constructor(props, context) {
        super(props, context);

        this.state = new AppState();

        let client = this.props.colyseus.client;

        this.props.colyseus.room.onJoin.add(() => {
            this.setState({client : client});
        });

        this.props.colyseus.room.onData.add((message) => {
            if(message.type == 'new_state') {
                this.setState({game_state : message.data.id});
            }
        });
    }

    render () {
        if(this.state.game_state == undefined)
            return null;

        if(this.state.game_state == ServerGameStates.PICKS)
            return (<SelectionLobby colyseus={this.props.colyseus} client={this.state.client} />);

        if(this.state.game_state == ServerGameStates.BATTLE)
            return  <BattleLobby colyseus={this.props.colyseus} client={this.state.client} />
    }
}