import * as React from 'react';
import SelectionLobbyState from "./SelectionLobbyState";
import PlayerSelections from "./PlayerSelections";
import AvailableSelections from "./AvailableSelections";
import {SelectionLobbyInterface} from "./SelectionLobbyInterface";
import LoadingOverlay from '../LoadingOverlay';
import {SelectionLobbyStatus} from './SelectionLobbyStatus';
import {PlayerSelectionsModel} from "../data/PlayerSelectionsModel";

export default class SelectionLobby extends React.Component<SelectionLobbyInterface, SelectionLobbyState> {
    constructor(props,context) {
        super(props,context);

        this.state = new SelectionLobbyState();

        let room = this.props.colyseus.room;
        let client = this.props.colyseus.client;

        room.onJoin.add(() => {
            this.setState({
                clientId : client.id,
                status : SelectionLobbyStatus.WAITING,
                overlayMessage : 'Waiting for player 2'
            });
        })

        room.onData.add((data) => {
            if(data.status == SelectionLobbyStatus.ACTIVE) {
                this.setState((previousState) => {
                    data.selections.forEach((s) => {
                        let exists = previousState.selections.find(e => e.getClientId() == s.clientId);

                        if(!exists)
                            previousState.selections.push(new PlayerSelectionsModel(s.clientId));

                        previousState.available = data.available;
                        previousState.showOverlay = data.false;
                        previousState.status = data.status;
                    });

                    return previousState;
                });
            }

            if(data.status == SelectionLobbyStatus.PICKING ||
                data.status == SelectionLobbyStatus.OPPONENT_PICKING) {
                this.setState({status : data.status});
            }
        })

        room.onUpdate.add((serverState) => {

        });
    }

    render () {
        if(this.state.status == SelectionLobbyStatus.INIT ||
            this.state.status == SelectionLobbyStatus.WAITING) {
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
                <PlayerSelections selections={this.getSelectionsForCurrent()}
                                  current_user={true} />

                <div id="main" className="panel">
                    <AvailableSelections heroes={this.state.available}
                                         status={this.state.status} />
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
}