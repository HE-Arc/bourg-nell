import * as SocketIO  from "socket.io";
import {Game} from "./New/Game";
import {Player} from "./New/Player";
import {State} from "./New/State";
import { CONFIG } from "./config";

const io = require("socket.io")();
const MAX_PLAYER_IN_GAME = 4;

let newPlayers = new Array<Player>();

io.on("connect", (socket: SocketIO.Socket) => {
    console.log("A connection occur ! ");

    // new
    socket.on("playerJoin", async (token) => {
        const player = new Player(socket, token);

        try
        {
            await player.fetchInfo();
            socket.emit("authSuccess");
            newPlayers.push(player);
        }
        catch(err) {
            console.log(`Token ${token} for socket ${socket.id} is invalid`);
            socket.emit("authFailure");
        }


        if(newPlayers.length == MAX_PLAYER_IN_GAME)
        {
            const game = new Game(newPlayers);

            game.patchData(State.Created);
            game.playGame();
            newPlayers = [];
        }
    });
});

console.log(`listening on port: ${CONFIG.port}`);
io.listen(CONFIG.port)