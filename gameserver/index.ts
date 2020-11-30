import {CARD_COLOR} from "./Game/GameBoard/Cards/CardColor";
import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";

function chooseTrumpColor(){
    return CARD_COLOR.HEARTH // TO CHANGE
}

const io = require("socket.io")();

io.on("connect", (socket: Socketio.Socket) => {
    console.log("a connection happened");
    //let game: Game;
    //let trumpColor = chooseTrumpColor();

    //socket.on("api/games", () => {
    //    game = new Game(trumpColor);
    //    console.log("creating a game..");
    //});

});

io.listen(3000);