import {Deck} from "./Cards/Deck";
import {Player} from "./Player/Player";

const playerNumber = 4;

export class GameBoard {
    private deck = new Deck();
    private score = {"team1": 0, "team2": 0};
    private players = new Array<Player>();

    public constructor() {
        this.setScore(0,0);
        //this.deck.shuffleDeck();
        for (let i =0; i<playerNumber ;++i) {
            this.players.push(new Player("Player" + i));
        }
        this.giveCards();
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

    public giveCards() {
        this.players.forEach(player => {
            player.setCards(this.deck.getDeck().splice(0,this.deck.getDeck().length / playerNumber));
        });
    }

    public getPlayers() {
        return this.players;
    } 
}