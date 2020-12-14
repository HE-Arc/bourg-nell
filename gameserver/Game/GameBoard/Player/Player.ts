import {CARDS} from "../Cards/Cards";

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

    public getCards() {
        return this.cards;
    }

    public play(card: CARDS) {
        let index = this.cards.indexOf(card);
        let result = null;
        if(index > -1) {
            result = this.cards[index];
            this.cards.splice(index, 1); // delete the card from the card list
        } else {
            throw new Error(card + " doesn't exist in " + this.name +" deck");
        }
        console.log(this.name + " played: " + CARDS[card]);
        return result;
    }
}