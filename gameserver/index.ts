import {Game} from "./Game/Game";
import * as Socketio  from "socket.io";
import {CARDS} from "./Game/GameBoard/Cards/Cards";
import { GameStates} from "./Game/GameStates";
import {Deck} from "./Game/GameBoard/Cards/Deck";

function nextTurn() {
    let nextPlayerName = game.getGameBoard().getPlayers()[game.getPlayerTurn()].getName();
    io.to(playerMap.get(nextPlayerName)).emit("turn", "it's your turn to play a card");
    game.nextPlayerTurn();
}

function checkPossibleMove(cardPlayed: CARDS, playerName: string) {
    let mainColor = Deck.findCardColor(playedCard[0]);
    let cardColor = Deck.findCardColor(cardPlayed);
    if (cardColor === mainColor) {
        playedCard.push(cardPlayed)
        return true;
    } else {
        let moveIsPossible = false;
        game.getGameBoard().getPlayerByName(playerName).getCards().forEach(card => {
            if (Deck.findCardColor(card) === (mainColor || game.getTrumpColor())) {
                return false
            } else {
                moveIsPossible = true;
            }
        })
        return moveIsPossible;
    }
}

const MAX_SCORE = 1000;
const MAX_GAME_PLAYERS = 4;
const io = require("socket.io")();

let players = Array<string>();
let gameList = Array<Game>();
let game: Game;
let playerMap = new Map();
let roomNumber = 0;
let playedCard = Array<CARDS>();

io.on("connect", (socket: Socketio.Socket) => {
    let rowFinished= 0;
    console.log("A connection occur ! ")


    socket.on("playerJoin", async (playerName: string) => {
        playerMap.set(playerName, socket.id);

        console.log("Player: " + playerName + " join");
        players.push(playerName);
        socket.join("room" + roomNumber);

        io.in("room"+roomNumber).emit("announcement", playerName + " join!")

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
        
    socket.on("playCard", async (card: CARDS) => {
        let playerName = "";
        playerMap.forEach((sock, name) => {
            if (socket.id === sock) {
                playerName = name;
            }
        })
        console.log(playerName);
        console.log(card);
        let playStatement = false;
        if (checkPossibleMove(card, playerName)) {
            console.log("move possible")
            playedCard.push(card)
            game.playCard(playerName, card);
            playStatement = true;
            io.in("room"+game.getRoomNumber()).emit("cardPlayed", {playerName, card})
        } else {
            console.log(game.getGameBoard().getPlayerByName(playerName).getCards())
            console.log(game.getGameBoard().getPlayers())
            console.log("impossible move")
            playStatement = false;
        }
        io.to(playerMap.get(game.getGameBoard().getPlayerByName(playerName)))
            .emit("possibleMove", playStatement, card)
    });

    socket.on("nextTurn", () => {
        nextTurn();
    })

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
                playedCard = [];
                nextTurn();
            }
        } else {
            nextTurn();
        }
        
    });
});

io.listen(3000);