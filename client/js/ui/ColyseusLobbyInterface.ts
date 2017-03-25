import ColyseusConnector from "../colyseusConnector";
import {Client} from "colyseus.js";

export interface ColyseusLobbyInterface {
    colyseus : ColyseusConnector;
    client : Client
}