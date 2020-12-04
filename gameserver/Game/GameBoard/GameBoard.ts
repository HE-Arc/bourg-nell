import {CARD_COLOR} from "./Cards/CardColor";
import { CARDS } from "./Cards/Cards";
import {Deck} from "./Cards/Deck";
import {Player} from "./Player/Player";
import {Team} from "./Team/Team";

const MAXSCORE = 157;

export class GameBoard {
    private deck = new Deck();
    private playedCards = Array<CARDS>();

    private trumpCardColor;
    private players = new Array<Player>();
    
    private team1: Team;
    private team2: Team;

    public constructor(trumpCard: CARD_COLOR, players: Array<string>) {
        //this.deck.shuffleDeck();
        players.forEach(player => {
            this.players.push(new Player(player));
        });
        this.team1 = new Team(this.players[0], this.players[2]);
        this.team2 = new Team(this.players[1], this.players[3]);
        this.setScore(0,0);
        this.giveCards();
        this.trumpCardColor = trumpCard;   
    }

    public getDeck(){
        return this.deck;
    }

    public getTeam1(){
        return this.team1;
    }

    public getTeam2(){
        return this.team2;
    }

    public setScore(team1Score: number, team2Score: number) {
        this.team1.setScore(team1Score)
        this.team2.setScore(team2Score)

        if (this.team1.getScore() + this.team2.getScore() >= MAXSCORE) {
            throw new Error("The total score cannot be superior to the game max score");
        }
    }

    public printScore() {
        console.log("Team1: " + this.team1.getScore() + " | Team2: " + this.team2.getScore()); 
    }

    public giveCards() {
        let cardNumber = this.deck.getDeck().length / this.players.length;
        this.players.forEach(player => {
            player.setCards(this.deck.getDeck().splice(0,cardNumber));
        });
    }

    public setTrumpCardColor(color: CARD_COLOR) {
        this.trumpCardColor = color;
    }

    public getTrumpCard(){
        return this.trumpCardColor;
    }

    public getPlayers() {
        return this.players;
    }

    public getPlayerByName(name: string) {
        let returnPlayer = new Player("random");
        for (let player of this.players) {
            if (player.getName() === name){
                returnPlayer = this.players[this.players.indexOf(player)]
            }
        }
        return returnPlayer;
    }

    public putPlayedCard(card: CARDS) {
        this.playedCards.push(card);
    }

    public getPlayedCards() {
        return this.playedCards;
    }
}