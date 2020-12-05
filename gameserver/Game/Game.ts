import {GameBoard} from "./GameBoard/GameBoard";
import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {GameStates} from "./GameStates";
import {CARDS} from "./GameBoard/Cards/Cards";
import {Fold} from "./Fold/Fold";

export class Game {
    private gameBoard;
    private state;
    private roomNumber;
    private fold;
    private rowWinner = "";
    private playerTurn;
    private players;

    public constructor(players: Array<string> ,trumpColor: CARD_COLOR, roomNumber: number) {
        this.gameBoard = new GameBoard(trumpColor, players);
        this.state = GameStates.CREATED;
        this.roomNumber = roomNumber;
        this.fold = new Fold(trumpColor);
        this.playerTurn = 0;
        this.players = players;
    }

    public getGameBoard() {
        return this.gameBoard;
    }

    public getState() {
        return this.state;
    }

    public setState(state: GameStates){
        this.state = state;
    }

    public getRoomNumber() {
        return this.roomNumber;
    }

    public getRowWinner() {
        return this.rowWinner;
    }

    public getPlayerTurn() {
        return this.playerTurn;
    }

    public nextPlayerTurn() {
        this.playerTurn = (this.playerTurn + 1) % this.players.length;
        console.log("turn to player n°"+ this.playerTurn);
    }

    public playCard(playerName: string, card: CARDS) {
        this.gameBoard.getPlayerByName(playerName).play(card);
        this.gameBoard.putPlayedCard(card);
        this.fold.playCard(playerName, card);
        this.rowWinner = this.fold.getWinner();
    }
}