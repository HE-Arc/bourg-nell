import {CARD_COLOR} from "./CardColor";
import {CARDS} from "./Cards";
import {CARD_VALUE} from "./CardValue";
import {Deck} from "./Deck"

let basicScore = {} as any;
basicScore[CARD_VALUE.SIX] = 0;
basicScore[CARD_VALUE.SEVEN] = 0;
basicScore[CARD_VALUE.EIGHT] = 0;
basicScore[CARD_VALUE.NINE] = 0;
basicScore[CARD_VALUE.TEN] = 10;
basicScore[CARD_VALUE.JACK] = 2;
basicScore[CARD_VALUE.QUEEN] = 3;
basicScore[CARD_VALUE.KING] = 4;
basicScore[CARD_VALUE.ACE] = 11;

let trumpScore = {...basicScore}
trumpScore[CARD_VALUE.NINE] = 14;
trumpScore[CARD_VALUE.JACK] = 20;

export function findCardScore(card: CARDS, trump: CARD_COLOR) {
   return (Deck.findCardColor(card) === trump ? trumpScore : basicScore )[Deck.findCardValue(card)];
}