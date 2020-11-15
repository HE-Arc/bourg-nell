import {CARD_VALUE} from "./CardValue";
import {CARDS} from "./Cards";
import {Deck} from "./Deck"
import {GameBoard} from "../GameBoard";
import { CARD_COLOR } from "./CardColor";

let basicScore = [
    [CARD_VALUE.SIX, 0],
    [CARD_VALUE.SEVEN, 0],
    [CARD_VALUE.HEIGHT, 0],
    [CARD_VALUE.NINE, 0],
    [CARD_VALUE.TEN, 10],
    [CARD_VALUE.JACK, 2],
    [CARD_VALUE.QUEEN, 3],
    [CARD_VALUE.KING, 4],
    [CARD_VALUE.ACE, 11]
];

let trumpScore = [
    [CARD_VALUE.NINE, 14],
    [CARD_VALUE.JACK, 20]    
];

export function getScore(card: CARDS, trump: CARD_COLOR) {
    let value = Deck.findCardValue(card);
    if ((value === CARD_VALUE.NINE || value === CARD_VALUE.JACK) && Deck.findCardColor(card) === trump) {
        return value === 3 ? trumpScore[0][1] : trumpScore[1][1] ;
    }
    return basicScore[value][1];
}