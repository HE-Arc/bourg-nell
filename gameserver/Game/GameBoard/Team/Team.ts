import {Player} from "../Player/Player";

export class Team {
    private player1;
    private player2;
    private score;

    public constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.score = 0;
    }

    public getScore() {
        return this.score;
    }

    public setScore(score: number) {
        this.score += score;
    }

}