import {CARD_COLOR} from "./GameBoard/Cards/CardColor";
import {Deck} from "./GameBoard/Cards/Deck";
import {CARDS} from "./GameBoard/Cards/Cards";
import {CARD_VALUE} from "./GameBoard/Cards/CardValue";
import {GameBoard} from "./GameBoard/GameBoard";

let game = new GameBoard();

let players = game.getPlayers();
players.forEach(player => {
    console.log(player);
});

let card = players[3].play(CARDS["TEN_SPADES"]);
console.log(players[3].getName() + " played " + card);
console.log(players[3]);