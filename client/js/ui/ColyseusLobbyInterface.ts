import ColyseusConnector from "../colyseusConnector";
import {Client} from "colyseus.js";

export default interface IColyseusLobby {
    colyseus : ColyseusConnector;
    client : Client
}