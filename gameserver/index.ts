import * as SocketIO  from "socket.io";
import {Game} from "./New/Game";
import {Player} from "./New/Player";
import {State} from "./New/State";
import { CONFIG } from "./config";

const io = require("socket.io")();
const MAX_PLAYER_IN_GAME = 4;

let newPlayers = new Array<Player>();

function checkGameCreation()
{
    if(newPlayers.length == MAX_PLAYER_IN_GAME)
    {
        const game = new Game(newPlayers, CONFIG.maxscore);

        game.patchData(State.Created);
        game.playGame();
        newPlayers = [];
    }
}

io.on("connect", (socket: SocketIO.Socket) => {
    console.log("A connection occur ! ");

    // new
    socket.on("playerJoin", async (token) => {
        const player = new Player(socket, token);

        const playerRemoveCb = () => {
            newPlayers.splice(newPlayers.indexOf(player));
        };

        try
        {
            await player.fetchInfo();
            socket.emit("authSuccess");
            newPlayers.push(player);
            checkGameCreation();
        }
        catch(err) {
            console.log(`Token ${token} for socket ${socket.id} is invalid`);
            socket.emit("authFailure");
        }
    });
});

console.log(`listening on port: ${CONFIG.port}`);
io.listen(CONFIG.port)