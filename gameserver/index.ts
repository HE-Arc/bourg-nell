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
let gameList = Array<Game>();
let game: Game;
let trumpColor = chooseTrumpColor();
let playerMap = new Map();
let roomNumber = 0;

io.on("connect", async (socket: Socketio.Socket) => {
    io.send("Connected !");

    socket.on("PlayerJoin", (playerName: string) => {
        socket.join("room" + roomNumber);
        playerMap.set(playerName, socket.id);

        console.log("Player: " + playerName + " join");
        players.push(playerName);

        if(players.length === MAX_GAME_PLAYERS) {
            game = new Game(players, trumpColor, roomNumber);
            gameList.push(game);

            console.log("player " + players + " are playing together");
            console.log("creating a new game...");

            io.in("room" + game.getRoomNumber()).emit("announcement", "the game is started");

            let playerList = game.getGameBoard().getPlayers();
            playerList.forEach(player => {
                //console.log(playerMap.get(player.getName()));
                io.in("room" + game.getRoomNumber())
                    .to(playerMap.get(player.getName()))
                    .emit("cards", player.getCards());
            });
            
            players = new Array<string>();
            
            roomNumber++;
        }
    });
        
    socket.on("playCard", (playerName: string, card: CARDS) => {
        game.getGameBoard().getPlayerByName(playerName).play(card);
    });
   
    
});

io.listen(3000);