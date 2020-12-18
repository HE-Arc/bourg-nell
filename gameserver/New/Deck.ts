import {CARD_VALUE} from "./CardValue";
import {CARD_COLOR} from "./CardColor";
import {CARDS} from "./Cards";

/**
 * @class Deck
 * Represent a deck of cards
 */
export class Deck{

    private deck = new Array<CARDS>();
    
    public constructor(){
        this.fillCardSet();
    }

    /**
     * @function fillCardSet
     * fill the deck with all number representation of cards
     */
    private fillCardSet(){
        for(let card in CARDS){
            if(parseInt(card))
                this.deck.push(parseInt(card));
        }
    }

    /**
     * @function getDeck
     * @returns return an array containing all the deck
     */
    public getDeck(){
        return this.deck;
    }

    /**
     * @function provideNewDeck
     * create a new deck with all cards inside
     */
    public provideNewDeck(){
        this.deck = new Array<CARDS>();
        this.fillCardSet();
        this.shuffleDeck();
    }

    /**
     * @function shuffledDeck
     * shuffle the cards in deck
     */
    public shuffleDeck(){
        let shuffledDeck = new Array<CARDS>();
        while(this.deck.length){
            shuffledDeck.push(this.deck.splice(Math.random() * this.deck.length, 1)[0]);
        }
        this.deck = shuffledDeck;
    }

    /**
     * @function findCardColor
     * @param card current card
     * @returns return the color of a given card doing by logical and
     */
    static findCardColor(card: CARDS): CARD_COLOR {
        return card & 0b11110000;
    }

    /**
     * @function findCardValue
     * @param card current card
     * @returns return the value of a given card doing by logical and
     */
    static findCardValue(card: CARDS): CARD_VALUE {
        return card & 0b00001111;
    }

    /**
     * @function findCardPower
     * @param card current card
     * @param currentFoldColor represent the first card in the current fold
     * @param currentTrump current trump card
     * @returns return the power of a given card in a fold
     */
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