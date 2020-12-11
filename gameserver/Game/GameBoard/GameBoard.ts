import {CARD_COLOR} from "./Cards/CardColor";
import {CARDS} from "./Cards/Cards";
import {findCardScore} from "./Cards/CardScore";
import {Deck} from "./Cards/Deck";
import {Player} from "./Player/Player";
import {Team} from "./Team/Team";

const MAXSCORE = 157;
const WINNERSCORE = 5;

export class GameBoard {
    private deck = new Deck();
    private playedCards = Array<string>();

    private trumpCardColor;
    private players = new Array<Player>();
    
    private team1: Team;
    private team2: Team;

    public constructor(trumpCard: CARD_COLOR, players: Array<string>) {
        this.deck.shuffleDeck();
        players.forEach(player => {
            this.players.push(new Player(player));
        });
        this.team1 = new Team(this.players[0], this.players[2]);
        this.team2 = new Team(this.players[1], this.players[3]);
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

    public setScore(cards: Map<CARDS, string>, winner: string) {
        cards.forEach((playerName: string, card:CARDS) => {
            let cardScore = findCardScore(card, this.trumpCardColor);
            // find return 'undefined' if nothing in found in the arrays, then, if the return statement is not undefined
            // it means that a player has been found in the team1 players, so we increment the score of team1
            if(this.team1.getPlayers().find(player => player.getName() === playerName) !== undefined) {
                this.team1.setScore(cardScore);
            } else {
                this.team2.setScore(cardScore);
            }

            
        });
        
        if(this.playedCards.length === 32) {
            console.log("winner is " + winner);
            if(this.team1.getPlayers().find(player => player.getName() === winner)) {
                this.team1.setScore(WINNERSCORE);
            } else {
                this.team2.setScore(WINNERSCORE);
            }
        }
    }

    public getScores() {
        return [this.team1.getScore(), this.team2.getScore()];
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
        this.playedCards.push(CARDS[card]);
    }

    public getPlayedCards() {
        return this.playedCards;
    }
}