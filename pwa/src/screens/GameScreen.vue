<template>
    <div id="root" class="game screen">
        <div class="player-cards">
            <PlayingCard 
                v-for="card in ownCards"
                @played="playCard($event)"
                :key="card"
                :card="card"
                :handPosition="getCardHandPosition(card)"
                :lang="lang"
            />
        </div>
        <div class="playing-mat">
            <PlayingCard v-if="playerLeftPlayedCard !== null" :card="playerLeftPlayedCard" playedDirection="left" :fold="fold"/>
            <PlayingCard v-if="playerRightPlayedCard !== null" :card="playerRightPlayedCard" playedDirection="right" :fold="fold"/>
            <PlayingCard v-if="playerTopPlayedCard !== null" :card="playerTopPlayedCard" playedDirection="top" :fold="fold"/>
            <PlayingCard v-if="playedCard !== null" :card="playedCard" playedDirection="bottom" :fold="fold"/>
        </div>
        <Player :playing="player1Playing" name="luca" imgPath="78d172c9cbb993794d2e9021fce57d68" pos="right"/>
        <Player :playing="player2Playing" name="ugo" imgPath="78d172c9cbb993794d2e9021fce57d68" pos="top"/>
        <Player :playing="player3Playing" name="robin" imgPath="78d172c9cbb993794d2e9021fce57d68" pos="left"/>
        <div class="score card" card-elvation="1">
            <h3>Score</h3>
            <div>
                <h6>Luca + Robin</h6>
                <div>{{myTeamScore}}</div>
            </div>
            <div>
                <h6>Luca + Robin</h6>
                <div>{{theirTeamScore}}</div>
            </div>

        </div>
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
            folding: false,
            lang: "fr",
            myTeamScore: 0,
            theirTeamScore: 0,
            fold: null,
            currentPlayerPlaying: 0
            //socket: io("ws://localhost:3000")
        }
    },
    mounted() {
        // Connect to server
        //socket.on("turn", this.onPlayCard)
        //socket.on("cards", this.getCards)
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
            this.folding = true;
            this.fold = direction;
            setTimeout(() => {
                this.playerRightPlayedCard = null;
                this.playerLeftPlayedCard = null;
                this.playerTopPlayedCard = null;
                this.playedCard = null;
                this.fold = null;
                this.folding = false;
            }, 1000)
        },
        getCardHandPosition(card)
        {
            let index = this.ownCards.indexOf(card);
            return 9 - this.ownCards.length + (index * 2);
        },
        playCard(card) {
            if(this.currentPlayerPlaying == 0 && !this.folding && this.playedCard === null)
            {
                this.ownCards.splice(this.ownCards.indexOf(card), 1);
                this.playedCard = card;

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
                    this.foldCards("bottom");
                    this.myTeamScore += 20;
                }, 5000)
            }
        }
        
    }
}
</script>