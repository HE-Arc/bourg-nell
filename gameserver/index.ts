import {CARD_COLOR} from "./Game/GameBoard/Cards/CardColor";
import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";
import {CARDS} from "./Game/GameBoard/Cards/Cards";

function chooseTrumpColor(){
    return CARD_COLOR.HEARTH // TO CHANGE
}

const MAX_GAME_PLAYERS = 4;
const io = require("socket.io")();

let players = Array<string>();
let game: Game;
let trumpColor = chooseTrumpColor();

io.on("connect", (socket: Socketio.Socket) => {
    console.log("a connection happened");
    io.send("Connected !");

    socket.on("message", (message) => {
        io.emit(message);
    })

    socket.on("PlayerJoin", (playerName: string) => {
        console.log("Player: " + playerName + " join");
        players.push(playerName);
        if(players.length === MAX_GAME_PLAYERS) {
            game = new Game(players, trumpColor);
            console.log("player " + players + " are player together")
            console.log("creating a new game...");
            players = new Array<string>();
        }
    });
        
    socket.on("playCard", (playerName: String, card: CARDS) => {
        console.log(playerName + " play " + CARDS[card]);
    });

    console.log(players.length + " === " + MAX_GAME_PLAYERS);
    
    
});




io.listen(3000);