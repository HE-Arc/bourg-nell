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
    io.send("Connected !");

    socket.on("PlayerJoin", (playerName: string) => {
        console.log("Player: " + playerName + " join");
        players.push(playerName);
        if(players.length === MAX_GAME_PLAYERS) {
            game = new Game(players, trumpColor);
            console.log("player " + players + " are playing together")
            console.log("creating a new game...");
            players = new Array<string>();
            console.log(game.getGameBoard());
        }
    });
        
    socket.on("playCard", (playerName: string, card: CARDS) => {
        game.getGameBoard().getPlayerByName(playerName).play(card);
    });
   
    
});

io.listen(3000);