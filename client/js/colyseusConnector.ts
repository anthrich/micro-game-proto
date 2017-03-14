import {Client, Room} from "colyseus.js";

export default class ColyseusConnector {
    public client : Client;
    public room : Room<any>;

    constructor(roomName) {
        this.client = new Client('ws://localhost:3553');
        this.room = this.client.join(roomName);
    }
}