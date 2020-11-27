import {CARD_COLOR} from "./Game/GameBoard/Cards/CardColor";
import {Game} from "./Game/Game";
import {Socket} from "socket.io";

function chooseTrumpColor(){
    return CARD_COLOR.HEARTH
}

const http = require("http")
const io = require("socket.io")(http)

io.on("connection", (socket: Socket) => {
    let game: Game;
    let trumpColor = chooseTrumpColor();

    socket.on("api/games", () => {
        game = new Game(trumpColor);
    });

});

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
})