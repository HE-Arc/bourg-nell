import {CARD_COLOR} from "./Cards/CardColor";
import {Deck} from "./Cards/Deck";
import {Player} from "./Player/Player";
import {Team} from "./Team/Team";

const PLAYERNUMBER = 4;

export class GameBoard {
    private deck = new Deck();
    private players = new Array<Player>();
    private trumpCardColor;
    
    private team1: Team;
    private team2: Team;

    public constructor(trumpCard: CARD_COLOR) {
        //this.deck.shuffleDeck();
        for (let i =0; i<PLAYERNUMBER ;++i) {
            this.players.push(new Player("Player" + i));
        }
        this.team1 = new Team(this.players[0], this.players[2]);
        this.team2 = new Team(this.players[1], this.players[3]); // line 18 to 22 will be changed for a more dynamic setting
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
    }

    public printScore() {
        console.log("Team1: " + this.team1.getScore() + " | Team2: " + this.team2.getScore()); 
    }

    public giveCards() {
        let cardNumber = this.deck.getDeck().length / PLAYERNUMBER;
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
}