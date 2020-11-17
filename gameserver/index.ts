import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {Deck} from "./GameBoard/Cards/Deck";
import {CARDS} from "./GameBoard/Cards/Cards";
import {CARD_VALUE} from "./GameBoard/Cards/CardValue";
import {GameBoard} from "./GameBoard/GameBoard";
import {getScore} from "./GameBoard/Cards/CardScore";

function print(str: any) {
    console.log(str);
}


let game = new GameBoard(CARD_COLOR.CLUBS);

let players = game.getPlayers();


// pli region
print(players)
let card1 = players[0].play(CARDS.ACE_HEARTH);
let card2 = players[1].play(CARDS.SIX_DIAMOND);
let card3 = players[2].play(CARDS.JACK_CLUBS);
let card4 = players[3].play(CARDS.ACE_SPADES);

game.getTeam1().setScore(getScore(card1, game.getTrumpCard()));
game.getTeam1().setScore(getScore(card3, game.getTrumpCard()));
game.getTeam2().setScore(getScore(card2, game.getTrumpCard()));
game.getTeam2().setScore(getScore(card4, game.getTrumpCard()));

game.printScore();

