import { createDecipheriv } from "crypto";
import { CARD_COLOR } from "./Cards/CardColor";
import {CardGame} from "./Cards/CardGame";
import {CARDS} from "./Cards/Cards";
import { CARD_VALUE } from "./Cards/CardValue";

let cardGame = new CardGame();
console.log(cardGame.getDeck());
cardGame.shuffleDeck();
console.log(cardGame.getDeck());

let card = cardGame.getDeck()[0];
console.log(card);
console.log(CARDS[card])

console.log(CardGame.findCardValue(card));
console.log("Value of the card: " + CARD_VALUE[CardGame.findCardValue(card)]);
console.log(CardGame.findCardColor(card));
console.log("Color of the card: " + CARD_COLOR[CardGame.findCardColor(card)]);