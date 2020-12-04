import {CARD_COLOR} from "./Game/GameBoard/Cards/CardColor";
import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";
import {CARDS} from "./Game/GameBoard/Cards/Cards";
import { GameStates } from "./Game/GameStates";

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
        playerMap.set(playerName, socket.id);

        console.log("Player: " + playerName + " join");
        players.push(playerName);
        socket.join("room" + roomNumber);

        if(players.length === MAX_GAME_PLAYERS) {
            console.log("game is starting in room n°" + roomNumber);
            game = new Game(players, trumpColor, roomNumber);
            gameList.push(game);

            console.log("Player " + players + " are playing together");
            console.log("creating a new game...");
            game.setState(GameStates.PLAYING);

            io.in("room" + game.getRoomNumber()).emit("announcement", "the game is starting");

            let playerList = game.getGameBoard().getPlayers();
            playerList.forEach(player => {
                io.to(playerMap.get(player.getName()))
                    .emit("cards", player.getCards());
                    //console.log(player);
                    //console.log(playerMap.get(player.getName()))
                    /**
                     * Maybe it will be modified in the futur, has we're testing
                     * in localhost, all socket's id are the same, so, we don't know
                     * if this really work or no
                     */
            });
            
            players = new Array<string>();
            roomNumber++;
        }
    });
        
    socket.on("playCard", (playerName: string, card: CARDS) => {
        game.playCard(playerName, card);
    });
   
    
});

io.listen(3000);