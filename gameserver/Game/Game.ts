import {GameBoard} from "./GameBoard/GameBoard";
import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {GameStates} from "./GameStates";

export class Game {
    private gameBoard;
    private state;

    public constructor(trumpColor: CARD_COLOR) {
        this.gameBoard = new GameBoard(trumpColor);
        this.state = GameStates.IN_PROGRESS;
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
}