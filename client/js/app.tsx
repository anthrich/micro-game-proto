import "../css/main.scss";
import "../css/circle.scss";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from "./ui/app";
import ColyseusConnector from "./colyseusConnector";

var colyseus = new ColyseusConnector('picks_room');

ReactDOM.render(<App colyseus={colyseus}/>, document.getElementById('app'));