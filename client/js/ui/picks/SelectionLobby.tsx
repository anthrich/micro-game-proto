import * as React from 'react';
import SelectionLobbyState from "./SelectionLobbyState";
import PlayerSelections from "./PlayerSelections";
import AvailableSelections from "./AvailableSelections";
import {SelectionLobbyInterface} from "./SelectionLobbyInterface";
import LoadingOverlay from '../LoadingOverlay';
import {SelectionLobbyStatus} from './SelectionLobbyStatus';
import CountdownClock from "./../CountdownClock";
import UiPlayerSelectionsModel from "../models/UiPlayerSelectionsModel";
import {Room} from "colyseus.js";

export default class SelectionLobby extends React.Component<SelectionLobbyInterface, SelectionLobbyState> {
    room : Room<any>;

    constructor(props,context) {
        super(props,context);

        this.state = new SelectionLobbyState();

        this.room = this.props.colyseus.room;
        let client = this.props.colyseus.client;

        this.room.onJoin.add(() => {
            this.setState({
                clientId : client.id
            });
        });

        this.room.onUpdate.add((serverState) => {
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
        }

        return this.renderPicks();
    }

    renderNotice() {
        return (
            <LoadingOverlay message={this.state.overlayMessage}/>
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