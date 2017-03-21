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
                clientId : client.id,
                status : SelectionLobbyStatus.WAITING,
                overlayMessage : 'Waiting for player 2',
            });
        })

        this.room.onData.add((data) => {
            if(this.isPickingState(data.status))
                this.handlePicksMessage(data);

            if(data.status == SelectionLobbyStatus.ACTIVE)
                this.handleActiveMessage(data);
        });

        this.room.onUpdate.add((serverState) => {
            if(serverState.activeTurn != null) {
                this.setState({
                    turnTime : serverState.activeTurn.duration,
                    turnElapsed : serverState.activeTurn.elapsed
                });
            }
        });
    }

    render () {
        if(this.isLoadingState(this.state.status)) {
            return this.renderNotice();
        }

        return this.renderPicks();
    }

    renderNotice() {
        return (
            <LoadingOverlay show={this.state.showOverlay} message={this.state.overlayMessage}/>
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
                                         status={this.state.status}
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

    handlePicksMessage(data) {
        this.setState((previousState) => {
            previousState.status = data.status;

            if(data.status  == SelectionLobbyStatus.PICKS_COMPLETE) {
                previousState.overlayMessage = 'Loading game, please wait';
                previousState.showOverlay = true;
            }

            return previousState;
        });
    }

    handleActiveMessage(data) {
        this.setState((previousState) => {
            data.selections.forEach((s) => {
                this.updateSelections(previousState, s);
                previousState.available = data.available;
                previousState.showOverlay = data.false;
                previousState.status = data.status;
            });

            return previousState;
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

    isPickingState(status : number) {
        return status == SelectionLobbyStatus.PICKING ||
        status == SelectionLobbyStatus.OPPONENT_PICKING ||
        status == SelectionLobbyStatus.PICKS_COMPLETE
    }
}