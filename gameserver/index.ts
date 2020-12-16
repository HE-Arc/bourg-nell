//import {Game} from "./Game/Game";
import * as SocketIO  from "socket.io";
import {Game} from "./New/Game";
import {Player} from "./New/Player";
import { State } from "./New/State";
import fetch from "node-fetch";

async function authentification() {
    let res = await fetch('https://bourgnell.srvz-webapp.he-arc.ch/users/login', {
        method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": "robin",
                "password": "test"
            }),
    });    

    if(!res.ok) throw Error("Bad user");
    const body = await res.json();
    return body.token;
}

const io = require("socket.io")();

let newPlayers = new Array<Player>();

let serverToken = "";

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

authentification().then((tok) => {
    serverToken = tok;
    io.listen(3000);
    console.log("Listening on port 3000")
}).catch((error) => {
    console.log(error);
})