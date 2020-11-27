import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {Deck} from "./GameBoard/Cards/Deck";
import {CARDS} from "./GameBoard/Cards/Cards";
import {CARD_VALUE} from "./GameBoard/Cards/CardValue";
import {GameBoard} from "./GameBoard/GameBoard";
import {findCardScore} from "./GameBoard/Cards/CardScore";
import * as socketio from "socket.io";

const http = require("http")
const io = require("socket.io")(http)

io.on("connection", () => {
    // TODO
});

io.on("api/games", () => {

})

function print(str: any) {
    console.log(str);
}

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
})