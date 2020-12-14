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
                <h6>Luca &amp; Robin</h6>
                <div>{{myTeamScore}}</div>
            </div>
            <div>
                <h6>Luca &amp; Robin</h6>
                <div>{{theirTeamScore}}</div>
            </div>

        </div>

        <div v-if="showTrumpModal" class="trump-selection modal">
            <div class="choice-modal card" card-elevation="4">
                <h2>Choice trump</h2>
                <div class="choices">
                    <img src="cards_fr/hearts/ace.png" alt="">
                    <img src="cards_fr/spades/ace.png" alt="">
                    <img src="cards_fr/diamonds/ace.png" alt="">
                    <img src="cards_fr/clubs/ace.png" alt="">
                </div>
                <button class="pass-button">Pass</button>
            </div>
        </div>

        <div v-if="!connected && allPlayerJoined" class="loading modal">
            <img src="swisscross.png"/>
        </div>
    </div>
</template>

<script>

import io from "socket.io-client";
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
            player1: null,
            player2: null,
            player3: null,
            ownCards: [],
            playerRightPlayedCard: null,
            playerLeftPlayedCard: null,
            playerTopPlayedCard: null,
            playedCard: null,
            folding: false,
            lang: "fr",
            myTeamScore: 0,
            theirTeamScore: 0,
            fold: null,
            currentPlayerPlaying: 0,
            socket: null,
            connected: false,
            showTrumpModal: false,
        }
    },
    mounted() {
        this.socket = io("ws://localhost:3000");

        // Handle connection
        this.socket.on("connect", () => {
            this.connected = true
            this.socket.emit("playerJoin", String(Math.floor(Math.random() * 1000)));
        });
        this.socket.on("disconnect", () => {this.connected = false});
        this.socket.on("reconnect", () => {this.connected = true});
        this.socket.on("announcement", message => {console.log(message);});
        this.socket.on("cards", this.giveCards);
        this.socket.on("cardPlayed", this.cardPlayed);
        this.socket.on("possibleMove", this.popCard);
    },
    computed: {
        player1Playing() {return this.currentPlayerPlaying == 1},
        player2Playing() {return this.currentPlayerPlaying == 2},
        player3Playing() {return this.currentPlayerPlaying == 3},
        allPlayerJoined() {return true; return this.player1 && this.player2 && this.player3}
    },
    methods: {
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
        popCard(statement, card){
            if(statement){
                index = this.ownCards.indexOf(card)
                if(index > -1){
                    this.ownCards.splice(index, 1);
                    this.socket.emit("nextTurn")
                }
            } else {
                console.log("wrong card")
            }
        },
        giveCards(cards)
        {
            console.log("Cards");
            console.log(cards);
            this.ownCards = cards.sort();
        },
        cardPlayed(cardPlayedEvent)
        {
            let {playerName, card} = cardPlayedEvent;
            console.log(playerName + " played: " + card);
            this.playerRightPlayedCard = card;
        },
        getCardHandPosition(card)
        {
            let index = this.ownCards.indexOf(card);
            return 9 - this.ownCards.length + (index * 2);
        },
        playCard(card) {
            console.log(card);
            this.socket.emit("playCard", card);
            //if(this.currentPlayerPlaying == 0 && !this.folding && this.playedCard === null)
            //{
                //this.ownCards.splice(this.ownCards.indexOf(card), 1);
                //this.playedCard = card;

                //setTimeout(() => {
                    //this.playerRightPlayedCard = 39;
                    //this.currentPlayerPlaying = 2;
                //}, 1000)
                //setTimeout(() => {
                    //this.playerTopPlayedCard = 71;
                    //this.currentPlayerPlaying = 3;
                //}, 2000)
                //setTimeout(() => {
                    //this.playerLeftPlayedCard = 24;
                    //this.currentPlayerPlaying = 0;
                //}, 3000)
                //setTimeout(() => {
                    //this.foldCards("bottom");
                    //this.myTeamScore += 20;
                //}, 5000)
            //}
        }
        
    }
}
</script>