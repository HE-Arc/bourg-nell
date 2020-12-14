import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";
import {CARDS} from "./Game/GameBoard/Cards/Cards";
import { GameStates} from "./Game/GameStates";

function nextTurn() {
    let nextPlayerName = game.getGameBoard().getPlayers()[game.getPlayerTurn()].getName();
    io.to(playerMap.get(nextPlayerName)).emit("turn", "it's your turn to play a card");
    game.nextPlayerTurn();
}

const MAX_SCORE = 1000;
const MAX_GAME_PLAYERS = 4;
const io = require("socket.io")();

let players = Array<string>();
let gameList = Array<Game>();
let game: Game;
let playerMap = new Map();
let roomNumber = 0;

io.on("connect", (socket: Socketio.Socket) => {
    let rowFinished= 0;

    socket.on("PlayerJoin", async (playerName: string) => {
        playerMap.set(playerName, socket.id);

        console.log("Player: " + playerName + " join");
        players.push(playerName);
        socket.join("room" + roomNumber);

        if(players.length === MAX_GAME_PLAYERS) {
            console.log("game is starting in room n°" + roomNumber);
            game = new Game(players, roomNumber);
            gameList.push(game);

            console.log("Player " + players + " are playing together");
            console.log("creating a new game...");
            game.setState(GameStates.PLAYING);

            io.in("room" + game.getRoomNumber()).emit("announcement", "the game is starting");

            let playerList = game.getGameBoard().getPlayers();
            playerList.forEach(player => {
                io.to(playerMap.get(player.getName()))
                    .emit("cards", player.getCards());
                console.log(player.getCards());
            });
            nextTurn();
            players = new Array<string>();
            roomNumber++;
        }
    });
        
    socket.on("playCard", async (playerName: string, card: CARDS) => {
        game.playCard(playerName, card);
        nextTurn();
        });


    socket.on("emptyDeck", async () => {
        rowFinished++;
        if (rowFinished === MAX_GAME_PLAYERS) {
            let teams = game.getGameBoard().getTeams();
            let team1Score = teams[0].getScore();
            let team2Score = teams[1].getScore();
            if(team1Score >= MAX_SCORE || team2Score >= MAX_SCORE) {
                io.in("room"+game.getRoomNumber()).emit("announcement", "game is finished!");
                let victoryMessage = "";
                if (team1Score >= MAX_SCORE) {
                    victoryMessage = teams[0].getPlayers().forEach(player => player.getName() + " ") + " won the game!";
                    game.setState(GameStates.WON_TEAM1);
                } else {
                    victoryMessage = teams[1].getPlayers().forEach(player => player.getName() + " ") + " won the game!";
                    game.setState(GameStates.WON_TEAM2);
                }
                io.in("room"+game.getRoomNumber()).emit("announcement", victoryMessage);
            } else {
                io.in("room" + game.getRoomNumber()).emit("announcement", "new row in comming, cards will be distributed");
                io.in("room" + game.getRoomNumber()).emit("scores", [team1Score, team2Score]);
                game.getGameBoard().getDeck().provideNewDeck();
                game.getGameBoard().giveCards();
                game.getGameBoard().getPlayers().forEach(player => {
                io.to(playerMap.get(player.getName()))
                    .emit("cards", player.getCards());
                console.log(player.getCards());
                });
                rowFinished = 0;
                nextTurn();
            }
        } else {
            nextTurn();
        }
        
    });
});

io.listen(3000);