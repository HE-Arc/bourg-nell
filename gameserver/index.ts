//import {Game} from "./Game/Game";
import * as SocketIO  from "socket.io";
import {Game} from "./New/Game";
import {Player} from "./New/Player";
import { State } from "./New/State";

const io = require("socket.io")();

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


        if(newPlayers.length == 4)
        {
            const game = new Game(newPlayers);

            game.patchData(State.Created);
            game.playGame();
            newPlayers = [];
        }
    });
});

io.listen(3000);