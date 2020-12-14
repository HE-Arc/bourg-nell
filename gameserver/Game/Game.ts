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
    private trumpColor;

    public constructor(players: Array<string>, roomNumber: number, trumpColor = CARD_COLOR.SPADES) {
        this.state = GameStates.CREATED;
        this.roomNumber = roomNumber;
        this.playerTurn = 0;
        this.players = players;
        this.gameBoard = new GameBoard(trumpColor, this.players);
        this.fold = new Fold(trumpColor);
        this.trumpColor = trumpColor;
    }

    public getFold() {
        return this.fold;
    }

    // public setTrumpColor(trumpColor: CARD_COLOR) {
    //     this.trumpColor = trumpColor;
    // }

    public getGameBoard() {
        return this.gameBoard;
    }

    public setState(state: GameStates){
        this.state = state;
    }

    public getRoomNumber() {
        return this.roomNumber;
    }

    public getPlayerTurn() {
        return this.playerTurn;
    }

    public nextPlayerTurn() {
        this.playerTurn = (this.playerTurn + 1) % this.players.length;
    }

    public playCard(playerName: string, card: CARDS) {
        this.gameBoard.getPlayerByName(playerName).play(card);
        this.gameBoard.putPlayedCard(card);
        this.fold.playCard(playerName, card);
        this.rowWinner = this.fold.getWinner();
        if (!(this.rowWinner === ""))
        {
            this.playerTurn = this.players.indexOf(this.rowWinner);
            this.gameBoard.setScore(this.fold.getPlayedCard(), this.rowWinner);
            this.fold = new Fold(this.trumpColor);
        }
    }
}