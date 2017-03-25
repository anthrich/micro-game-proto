import * as React from 'react';
import SelectionLobbyState from "./SelectionLobbyState";
import PlayerSelections from "./PlayerSelections";
import AvailableSelections from "./AvailableSelections";
import LoadingOverlay from '../LoadingOverlay';
import {SelectionLobbyStatus} from './SelectionLobbyStatus';
import CountdownClock from "./../CountdownClock";
import UiPlayerSelectionsModel from "../models/UiPlayerSelectionsModel";
import {Room} from "colyseus.js";
import {ServerGameStates} from "../../../../server/states/IGameState";
import {ColyseusLobbyInterface} from "../ColyseusLobbyInterface";

export default class SelectionLobby extends React.Component<ColyseusLobbyInterface, SelectionLobbyState> {
    room : Room<any>;

    constructor(props,context) {
        super(props,context);

        this.state = new SelectionLobbyState(this.props.client.id);
        this.room = this.props.colyseus.room;

        this.room.onUpdate.add((serverState) => {
            if(serverState.id != ServerGameStates.PICKS)
                return;

            this.setState((prevState) => {
                serverState.selections.forEach((s) => {
                    this.updateSelections(prevState, s);
                    prevState.available = serverState.available;
                    prevState.status = serverState.status;
                    prevState.isActiveClient = serverState.activeTurn &&
                        serverState.activeTurn.activeClient.id == prevState.clientId;
                    if(serverState.activeTurn) {
                        prevState.turnTime = serverState.activeTurn.duration;
                        prevState.turnElapsed = serverState.activeTurn.elapsed;
                    }
                });
                return prevState;
            });
        });
    }
    
    updateSelections(previousState, selectionObj) {
        let exists = previousState.selections.find(e => e.getClientId() == selectionObj.clientId);
        
        if(!exists) {
            previousState.selections.push(new UiPlayerSelectionsModel(selectionObj.clientId));
        } else {
            exists.sync(selectionObj.selections);
        }
    }

    render () {
        if(this.isLoadingState(this.state.status)) {
            return this.renderNotice();
        } else {
            return this.renderPicks();
        }
    }

    renderNotice() {
        let notice;

        switch (this.state.status) {
            case SelectionLobbyStatus.WAITING:
                notice = 'Waiting for player 2';
                break;
            case SelectionLobbyStatus.PAUSED:
                notice = 'Game paused. Please wait.';
                break;
            case SelectionLobbyStatus.PICKS_COMPLETE:
                notice = 'Loading game innit';
                break;
            default:
                notice = '';
        }

        return (
            <LoadingOverlay message={notice}/>
        );
    }

    renderPicks() {
        return (
            <div id="selection-lobby">
                <header>
                    <div className="header-clock">
                        <CountdownClock initialTime={this.state.turnTime}
                                        elapsedTime={this.state.turnElapsed}/>
                    </div>
                </header>

                <PlayerSelections selections={this.getSelectionsForCurrent()}
                                  current_user={true} />

                <div id="main" className="panel">
                    <AvailableSelections heroes={this.state.available}
                                         isActive={this.state.isActiveClient}
                                         onSelect={this.handleSelectHero} />
                </div>

                <PlayerSelections selections={this.getSelectionsForOther()}
                                  current_user={false} />
            </div>
        );
    }

    getSelectionsForCurrent() {
        return this.state.selections.find(
            s => s.getClientId() == this.state.clientId
        );
    }

    getSelectionsForOther() {
        return this.state.selections.find(
            s => s.getClientId() != this.state.clientId
        );
    }

    handleSelectHero = (selection) => {
        this.room.send({
            'message' : 'client_selection',
            'selection' : selection
        })
    }

    isLoadingState(status : number) {
        return status == SelectionLobbyStatus.INIT ||
            status == SelectionLobbyStatus.WAITING ||
            status == SelectionLobbyStatus.PICKS_COMPLETE;
    }
}