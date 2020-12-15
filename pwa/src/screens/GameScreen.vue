<template>
    <div id="root" class="game screen">
        <!-- Player cards -->
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

        <!-- Played Cards -->
        <div class="playing-mat">
            <PlayingCard v-if="playerLeftPlayedCard !== null" :card="playerLeftPlayedCard" playedDirection="left" :fold="fold"/>
            <PlayingCard v-if="playerRightPlayedCard !== null" :card="playerRightPlayedCard" playedDirection="right" :fold="fold"/>
            <PlayingCard v-if="playerTopPlayedCard !== null" :card="playerTopPlayedCard" playedDirection="top" :fold="fold"/>
            <PlayingCard v-if="playedCard !== null" :card="playedCard" playedDirection="bottom" :fold="fold"/>
        </div>

        <!-- Other players -->
        <Player :playing="player1Playing" :name="playerRightName || ''" imgPath="78d172c9cbb993794d2e9021fce57d68" pos="right"/>
        <Player :playing="player2Playing" :name="playerTopName || ''" imgPath="78d172c9cbb993794d2e9021fce57d68" pos="top"/>
        <Player :playing="player3Playing" :name="playerLeftName || ''" imgPath="78d172c9cbb993794d2e9021fce57d68" pos="left"/>

        <!-- Current trump -->
        <CurrentTrump v-if="currentTrump" :currentTrump="currentTrump"/>

        <!-- Score -->
        <Score 
            :partnerName="playerTopName || ''" 
            :opponentPlayer1Name="playerRightName || ''" 
            :opponentPlayer2Name="playerLeftName || ''" 
            :myTeamScore="myTeamScore"
            :theirTeamScore="theirTeamScore"
        />

        <!-- Trump selection modal -->
        <ChooseTrumpModal 
            v-if="showTrumpModal" 

            @hearts="trumpHearts"
            @spades="trumpSpades"
            @diamonds="trumpDiamonds"
            @clubs="trumpClubs"
            @pass="pass"

            :allowPass="allowPass"
        /> 

        <!-- Loading Modal -->
        <LoadingModal v-if="!connected || !gameStarted"/>
    </div>
</template>

<script>

import io from "socket.io-client";
import PlayingCard from "../components/GameScreen/PlayingCard";
import Player from "../components/GameScreen/Player";
import ChooseTrumpModal from "../components/GameScreen/ChooseTrumpModal";
import LoadingModal from "../components/GameScreen/LoadingModal";
import CurrentTrump from "../components/GameScreen/CurrentTrump";
import Score from "../components/GameScreen/Score";
import {CARD_COLOR} from "../cards/CardColor";

export default {
    // Todo : Load games from server
    name: 'GameScreen',
    components: {
        Player,
        PlayingCard,
        ChooseTrumpModal,
        CurrentTrump,
        LoadingModal,
        Score
    },
    data()
    {
        return {
            myId: 0,
            ownCards: [],
            playedCard: null,

            currentPlayerPlaying: 0,
            currentTrump: null,

            playerRightPlayedCard: null,
            playerRightName: null,
            playerLeftPlayedCard: null,
            playerLeftName: null,
            playerTopPlayedCard: null,
            playerTopName: null,

            lang: "fr",

            folding: false,
            fold: null,

            myTeamScore: 0,
            theirTeamScore: 0,

            socket: null,
            connected: false,
            gameStarted: false,

            showTrumpModal: false,
            allowPass: true
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

        this.socket.on("gameStart", () => {this.gameStarted = true});

        this.socket.on("id", this.onId);
        this.socket.on("player", this.onPlayer);
        this.socket.on("cards", this.onCards);

        this.socket.on("chooseTrump", this.onChooseTrump);
        this.socket.on("currentTrump", this.onCurrentTrump);
        this.socket.on("playerPassed", this.onPlayerPassed);
        this.socket.on("passed", this.onPassed);

        this.socket.on("scoreTeam1", this.onScoreTeam1);
        this.socket.on("scoreTeam2", this.onScoreTeam2);

        this.socket.on("playCard", this.onPlayCard);
        this.socket.on("playerPlaying", (id) => {this.currentPlayerPlaying = id});
        this.socket.on("fold", this.onFoldCards)
    },
    computed: {
        player1Playing() {return this.relativeIndex(this.currentPlayerPlaying) == 1},
        player2Playing() {return this.relativeIndex(this.currentPlayerPlaying) == 2},
        player3Playing() {return this.relativeIndex(this.currentPlayerPlaying) == 3},
    },
    methods: {
        relativeIndex(index)
        {
            return (4 + index - this.myId ) % 4;
        },
        getCardHandPosition(card)
        {
            let index = this.ownCards.indexOf(card);
            return 9 - this.ownCards.length + (index * 2);
        },

        // You playe a card
        playCard(card) { this.socket.emit("turnCard", card); },

        // Trump selection
        pass() { this.socket.emit("pass"); },
        trumpHearts() { this.socket.emit("trump", CARD_COLOR.HEARTS); },
        trumpSpades() { this.socket.emit("trump", CARD_COLOR.SPADES); },
        trumpDiamonds() { this.socket.emit("trump", CARD_COLOR.DIAMONDS); },
        trumpClubs() { this.socket.emit("trump", CARD_COLOR.CLUBS); },

        // Your id
        onId(id) { this.myId = id; },

        // Player joined the game
        onPlayer(index, name)
        {
            let relativeIndex = this.relativeIndex(index);

            if(relativeIndex == 1) { this.playerRightName = name; }
            else if(relativeIndex == 2) { this.playerTopName = name; }
            else if(relativeIndex == 3) { this.playerLeftName = name; }
        },

        // You receive your cards
        onCards(cards) { this.ownCards = cards.sort(); this.currentTrump = null; },

        // You have to choose trump
        onChooseTrump() { this.allowPass = true; this.showTrumpModal = true; },

        // Trump has been selected
        onCurrentTrump(trump) {
            this.currentTrump = trump;
            this.showTrumpModal = false;
        },

        // A player passed to his mate
        onPlayerPassed(index)
        {
            let relativeIndex = this.relativeIndex(index);
            if(relativeIndex == 0)
            {
                this.showTrumpModal = false;
            }
        },

        // Your mate passed to you
        onPassed()
        {
            this.allowPass = false;
            this.showTrumpModal = true;
        },

        // Scores updates
        onScoreTeam1(score) {if(this.myId % 2 == 0) this.myTeamScore = score; else this.theirTeamScore = score},
        onScoreTeam2(score) {if(this.myId % 2 != 0) this.myTeamScore = score; else this.theirTeamScore = score},

        // 4 cards on the board, best card fold to the player
        onFoldCards(playerWinning)
        {
            this.folding = true;
            let relativePlayerWinning = this.relativeIndex(playerWinning);
            if(relativePlayerWinning == 0) { this.fold = "bottom"; }
            else if(relativePlayerWinning == 1) { this.fold = "right"; }
            else if(relativePlayerWinning == 2) { this.fold = "top"; }
            else if(relativePlayerWinning == 3) { this.fold = "left"; }

            // Wait animation end
            setTimeout(() => {
                this.playerRightPlayedCard = null;
                this.playerLeftPlayedCard = null;
                this.playerTopPlayedCard = null;
                this.playedCard = null;
                this.fold = null;
                this.folding = false;
            }, 1000)
        },

        // A card has been played
        onPlayCard(playerIndex, card) {
            let relativeIndex = this.relativeIndex(playerIndex);
            if(relativeIndex == 0)
            {
                this.ownCards.splice(this.ownCards.indexOf(card), 1);
                this.playedCard = card;
            }
            else if(relativeIndex == 1)
            {
                this.playerRightPlayedCard = card;
            }
            else if(relativeIndex == 2)
            {
                this.playerTopPlayedCard = card;
            }
            else if(relativeIndex == 3)
            {
                this.playerLeftPlayedCard = card;
            }
        }
    }
}
</script>