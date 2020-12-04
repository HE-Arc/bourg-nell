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

    constructor(trumpColor: CARD_COLOR) {
        this.fold = new Array<CARDS>();
        this.trumpColor = trumpColor;
    }

    public playCard(card: CARDS) {
        this.fold.push(card);
        if (this.fold.length === MAX_INBOARD_CARDS) {
            this.findWinner();
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
            finalScores.set(card, valueScore * colorScore);
            scores.push(valueScore * colorScore);
        });

        scores = scores.sort((n1, n2) => n1-n2);
        console.log(scores);

        //finalScores.forEach((value, key) => {
        //    
        //})
        

    }

}