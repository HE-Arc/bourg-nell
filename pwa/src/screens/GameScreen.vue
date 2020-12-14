<template>
    <div id="root" class="game screen">
        <div class="player-cards">
            <PlayingCard 
                v-for="card in ownCards"
                :key="card"
                :card="card"
                :handPosition="getCardHandPosition(card)"
            />
        </div>
        <div class="playing-mat">
            <PlayingCard v-if="playerLeftPlayedCard !== null" :card="playerLeftPlayedCard" playedDirection="left" :fold="fold"/>
            <PlayingCard v-if="playerRightPlayedCard !== null" :card="playerRightPlayedCard" playedDirection="right" :fold="fold"/>
            <PlayingCard v-if="playerTopPlayedCard !== null" :card="playerTopPlayedCard" playedDirection="top" :fold="fold"/>
            <PlayingCard v-if="playedCard !== null" :card="playedCard" playedDirection="bottom" :fold="fold"/>
        </div>
        <Player :playing="player1Playing" pos="right"/>
        <Player :playing="player2Playing" pos="top"/>
        <Player :playing="player3Playing" pos="left"/>
    </div>
</template>

<script>

import {io} from "socket.io-client";
import PlayingCard from "../components/PlayingCard";
import Player from "../components/Player";

export default {
    // Todo : Load games from server
    name: 'GameScreen',
    components: {
        Player,
        PlayingCard
    },
    data()
    {
        return {
            ownCards: [24,39,71, 72, 69],
            playerRightPlayedCard: null,
            playerLeftPlayedCard: null,
            playerTopPlayedCard: null,
            playedCard: null,

            fold: null,
            currentPlayerPlaying: 1
            //socket: io("ws://localhost:3000")
        }
    },
    mounted() {
        // Connect to server
        //socket.on("turn", this.onPlayCard)
        //socket.on("cards", this.getCards)
        setTimeout(() => {
            this.playerRightPlayedCard = 39;
            this.currentPlayerPlaying = 2;
        }, 1000)
        setTimeout(() => {
            this.playerTopPlayedCard = 71;
            this.currentPlayerPlaying = 3;
        }, 2000)
        setTimeout(() => {
            this.playerLeftPlayedCard = 24;
            this.currentPlayerPlaying = 0;
        }, 3000)
        setTimeout(() => {
            this.playCard(39);
        }, 4000)
        setTimeout(() => {
            this.foldCards("top");
        }, 5000)
    },
    computed: {
        player1Playing() {return this.currentPlayerPlaying == 1},
        player2Playing() {return this.currentPlayerPlaying == 2},
        player3Playing() {return this.currentPlayerPlaying == 3},
    },
    methods: {
        onPlayCard(card)
        {
            if(!(this.ownCards.lenght === 0)) {
                let index = this.ownCards.indexOf(card)
                if (index > -1) {
                    playedCard = this.ownCards[index]
                    this.ownCards.splice(index, 1)
                    // socket.emit("playCard", playedCard)
                }
            } else {
                    // socket.emit("emptyDeck")
            }
        },
        getCards(cards) {
            this.ownCards = [];
            cards.forEach(card => {
                this.ownCards.push(card)
            });
        },
        printScores(scores) {
            scores.forEach(score => {
                //TODO: afficher les scores sur le menu
            })
        },
        foldCards(direction)
        {
            this.fold = direction;
            setTimeout(() => {
                this.playerRightPlayedCard = null;
                this.playerLeftPlayedCard = null;
                this.playerTopPlayedCard = null;
                this.playedCard = null;
                this.fold = null;
            }, 800)
        },
        getCardHandPosition(card)
        {
            let index = this.ownCards.indexOf(card);
            return 9 - this.ownCards.length + (index * 2);
        },
        playCard(card) {
            this.ownCards.splice(this.ownCards.indexOf(card), 1);
            this.playedCard = card;
        }
        
    }
}
</script>