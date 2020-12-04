import {GameBoard} from "./GameBoard/GameBoard";
import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {GameStates} from "./GameStates";
import {CARDS} from "./GameBoard/Cards/Cards";
import {Deck} from "./GameBoard/Cards/Deck";
import { Fold } from "./Fold/Fold";

export class Game {
    private gameBoard;
    private state;
    private roomNumber;
    private fold;

    public constructor(players: Array<string> ,trumpColor: CARD_COLOR, roomNumber: number) {
        this.gameBoard = new GameBoard(trumpColor, players);
        this.state = GameStates.CREATED;
        this.roomNumber = roomNumber;
        this.fold = new Fold(trumpColor);
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

    public playCard(playerName: string, card: CARDS) {
        this.fold.playCard(card);
        this.getGameBoard().getPlayerByName(playerName).play(card);
    }
}