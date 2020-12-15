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

    static findCardPower(card: CARDS, currentFoldColor: CARD_COLOR, currentTrump: CARD_COLOR)
    {
        let currentCardColor = Deck.findCardColor(card);
        let currentCardValue = Deck.findCardValue(card);
        
        if(currentCardColor === currentTrump)
        {
            if(currentCardValue == CARD_VALUE.NINE || currentCardValue == CARD_VALUE.JACK) currentCardValue += 0b00100000;
            return 0b01000000 + currentCardValue;
        }
        if(currentCardColor === currentFoldColor) return 0b00010000 + currentCardValue;
        return currentCardValue
    }
}