import * as React from 'react';
import SelectionLobby from './picks/SelectionLobby';

export default class App extends React.Component<any, any> {
    constructor(props,context) {
        super(props,context);
    }

    render () {
        return <SelectionLobby colyseus={this.props.colyseus}/>;
    }
}