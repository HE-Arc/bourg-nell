//import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";
import {Game} from "./New/Game";
import {Player} from "./New/Player";

const io = require("socket.io")();

let newPlayers = new Array<Player>();

io.on("connect", (socket: Socketio.Socket) => {
    console.log("A connection occur ! ")

    // new
    socket.on("playerJoin", (playerName) => {
        newPlayers.push(new Player(socket, playerName));

        //todo: checkToken

        if(newPlayers.length == 4)
        {
            const game = new Game(newPlayers);
            game.playGame();
            newPlayers = [];
        }
    });
});

io.listen(3000);