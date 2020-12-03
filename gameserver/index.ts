import {CARD_COLOR} from "./Game/GameBoard/Cards/CardColor";
import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";
import {CARDS} from "./Game/GameBoard/Cards/Cards";

function chooseTrumpColor(){
    return CARD_COLOR.HEARTH // TO CHANGE
}

const io = require("socket.io")();

io.on("connect", (socket: Socketio.Socket) => {
    console.log("a connection happened");
    socket.emit("Connected !");
    let players = Array<string>();
    let game: Game;
    let trumpColor = chooseTrumpColor();

    socket.on("PlayerJoin", (playerName: string) => {
        console.log("Player: " + playerName + " join");
        players.push(playerName);
        if(players.length === 4) {
            game = new Game(players, trumpColor);
            console.log("creating a new game...");
            players = new Array<string>();
        }
    });

    socket.on("message", (message) => {
        io.emit(message);
    })

    socket.on("playCard", (playerName: String, card: CARDS) => {
        console.log(playerName + " play " + CARDS[card]);
    });
});

io.listen(3000);