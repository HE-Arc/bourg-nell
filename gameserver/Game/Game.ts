import {GameBoard} from "./GameBoard/GameBoard";
import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {GameStates} from "./GameStates";
import { CARDS } from "./GameBoard/Cards/Cards";

export class Game {
    private gameBoard;
    private state;
    private roomNumber;

    public constructor(players: Array<string> ,trumpColor: CARD_COLOR, roomNumber: number) {
        this.gameBoard = new GameBoard(trumpColor, players);
        this.state = GameStates.CREATED;
        this.roomNumber = roomNumber;
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
}