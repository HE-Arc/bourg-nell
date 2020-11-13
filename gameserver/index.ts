import { createDecipheriv } from "crypto";
import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {Deck} from "./GameBoard/Cards/Deck";
import {CARDS} from "./GameBoard/Cards/Cards";
import {CARD_VALUE} from "./GameBoard/Cards/CardValue";

let deck = new Deck();
console.log(deck.getDeck());
deck.shuffleDeck();
console.log(deck.getDeck());

let card = deck.getDeck()[0];
console.log(card);
console.log(CARDS[card])

console.log(Deck.findCardValue(card));
console.log("Value of the card: " + CARD_VALUE[Deck.findCardValue(card)]);
console.log(Deck.findCardColor(card));
console.log("Color of the card: " + CARD_COLOR[Deck.findCardColor(card)]);