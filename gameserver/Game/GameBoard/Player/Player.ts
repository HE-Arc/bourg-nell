import {CARDS} from "../Cards/Cards";
import {CARD_COLOR} from "../Cards/CardColor";
import {CARD_VALUE} from "../Cards/CardValue";
import {Deck} from "../Cards/Deck";

export class Player {
    private name: string;
    private cards = new Array<CARDS>();
    
    public constructor(name: string) {
        this.name = name;
    }

    public setCards(cards: CARDS[]) {
        this.cards = cards;
    }

    public getName() {
        return this.name;
    }

    public toString() {
        let res = "";
        res = this.name + " [";
        this.cards.forEach(card => {
            res += CARD_VALUE[Deck.findCardValue(card)] + "_" + CARD_COLOR[Deck.findCardColor(card)] + " ";
        });
        res += "]";
        return res;
    }

    public getCards() {
        return this.cards;
    }

    public play(card: CARDS) {
        let index = this.cards.indexOf(card);
        let result = null;
        if(index > -1) {
            result = this.cards[index];
            this.cards.splice(index, 1);
        } else {
            throw new Error(card + " doesn't exist in this player deck");
        }
        console.log(this.name + " played: " + CARD_VALUE[Deck.findCardValue(card)] + "_" + CARD_COLOR[Deck.findCardColor(card)]);
        return result;
    }
}