import {CARD_COLOR} from "../GameBoard/Cards/CardColor";
import {CARDS} from "../GameBoard/Cards/Cards";
import {CARD_VALUE} from "../GameBoard/Cards/CardValue";
import {Deck} from "../GameBoard/Cards/Deck";

const MAX_INBOARD_CARDS = 4;

export class Fold {
    private fold = Array<CARDS>();
    private valueScoreMultiplier = {
        [CARD_VALUE.SIX] : 1,
        [CARD_VALUE.SEVEN] : 2,
        [CARD_VALUE.EIGHT] : 3,
        [CARD_VALUE.NINE] : 4,
        [CARD_VALUE.TEN] : 5,
        [CARD_VALUE.JACK] : 6,
        [CARD_VALUE.QUEEN] : 7,
        [CARD_VALUE.KING] : 8,
        [CARD_VALUE.ACE] : 9,
    };
    private colorScoreMultiplier = {
        [CARD_COLOR.CLUBS]:1,
        [CARD_COLOR.DIAMOND]:1,
        [CARD_COLOR.HEARTH]:1,
        [CARD_COLOR.SPADES]:1
    };
    
    private trumpColor: CARD_COLOR;
    private cardPlayed = new Map();
    private winner: string = "";

    constructor(trumpColor: CARD_COLOR) {
        this.fold = new Array<CARDS>();
        this.trumpColor = trumpColor;
    }

    public playCard(playerName: string, card: CARDS) {
        this.fold.push(card);
        this.cardPlayed.set(card, playerName);
        
        if (this.fold.length === MAX_INBOARD_CARDS) {
            this.winner = this.cardPlayed.get(this.findWinner());
        }
    }
    
    private findWinner() {
        let winnerColor = Deck.findCardColor(this.fold[0]); // the winner color is the first card that was played
        this.colorScoreMultiplier[winnerColor] = 10; // set the multiplicative score by 10.
        this.colorScoreMultiplier[this.trumpColor] = 100; // the trumpColor is always superior to the others, and if the winnerColor is the trumps, it will just be erased

        let finalScores = new Map();
        let scores = new Array();

        this.fold.forEach(card => {
            let valueScore = this.valueScoreMultiplier[Deck.findCardValue(card)];
            let colorScore = this.colorScoreMultiplier[Deck.findCardColor(card)];
            let score = valueScore * colorScore;
            if(Deck.findCardColor(card) === this.trumpColor) {
                if (Deck.findCardValue(card) === CARD_VALUE.JACK) {
                    score *= 10; // if the card is the Jack of trump card, only the nine can beat it, so we multiply the score
                }
                if (Deck.findCardValue(card) === CARD_VALUE.NINE) {
                    score *= 100; // if the card is the Nine of trump card, it is the best card in game, so we multiply the score by 100
                }
            }
            finalScores.set(card, score);
            scores.push(score);
        });

        scores = scores.sort((n1, n2) => n2-n1); // sort like this: [300, 200, 4, 2]

        let winner: CARDS = CARDS.ACE_CLUBS;
        finalScores.forEach((value: number, key: CARDS) => {
            if(value == scores[0]) { // we took score[0] because now the array is sorted, so the first index is the higher
                winner = key;
            }    
        })
        console.log(this.cardPlayed.get(winner) + " won the fold");
        return winner;
    }

    public getWinner() {
        return this.winner;
    }

    public getPlayedCard() {
        return this.cardPlayed;
    }
}