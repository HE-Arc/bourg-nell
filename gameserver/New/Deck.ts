import {CARD_VALUE} from "./CardValue";
import {CARD_COLOR} from "./CardColor";
import {CARDS} from "./Cards";

export class Deck{

    private deck = new Array<CARDS>();
    
    public constructor(){
        this.fillCardSet();
    }

    private fillCardSet(){
        for(let card in CARDS){
            if(parseInt(card))
                this.deck.push(parseInt(card));
        }
    }

    public getDeck(){
        return this.deck;
    }

    public provideNewDeck(){
        this.deck = new Array<CARDS>();
        this.fillCardSet();
        this.shuffleDeck();
    }

    public shuffleDeck(){
        let shuffledDeck = new Array<CARDS>();
        while(this.deck.length){
            shuffledDeck.push(this.deck.splice(Math.random() * this.deck.length, 1)[0]);
        }
        this.deck = shuffledDeck;
    }

    static findCardColor(card: CARDS): CARD_COLOR {
        return card & 0b11110000;
    }

    static findCardValue(card: CARDS): CARD_VALUE {
        return card & 0b00001111;
    }
}