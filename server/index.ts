import * as path from 'path';
import * as express from 'express';
import { createServer } from 'http';
import { Server } from 'colyseus';

// Require ChatRoom handler
import {PicksRoom} from "./rooms/picksRoom";

const port = process.env.PORT || 3553;
const app = express();

// Create HTTP Server
const httpServer = createServer(app);

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({ server: httpServer });

// Register ChatRoom as "chat"
gameServer.register("picks_room", PicksRoom);

httpServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);
