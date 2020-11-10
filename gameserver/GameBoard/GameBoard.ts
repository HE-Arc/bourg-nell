import {Deck} from "./Cards/Deck";

class GameBoard {
    private deck = new Deck();
    private score = {"team1": 0, "team2":0};

    public constructor() {
        this.init();
    }

    public getDeck(){
        return this.deck;
    }

    public getScore(){
        return this.score;
    }

    public setScore(team1Score: number, team2Score: number) {
        this.score["team1"] = team1Score;
        this.score["team2"] = team2Score;
    }

    public init() {
        this.setScore(0,0);
        this.deck.shuffleDeck();
    }
}