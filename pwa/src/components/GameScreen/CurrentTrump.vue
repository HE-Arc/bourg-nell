<template>
    <div class="current-trump card" card-elevation="1">
        <img v-if="isHearts" src="/img/hearts.png" alt="">
        <img v-if="isSpades" src="/img/spades.png" alt="">
        <img v-if="isDiamonds" src="/img/diamonds.png" alt="">
        <img v-if="isClubs" src="/img/clubs.png" alt="">
    </div>
</template>

<script>
    import {CARD_COLOR} from "../../cards/CardColor";
    export default {
        name: "CurrentTrump",
        props: {
            currentTrump: {
                type: Number,
                required: true
            }
        },
        computed: { 
            isHearts(){return this.currentTrump == CARD_COLOR.HEARTS;},
            isSpades(){return this.currentTrump == CARD_COLOR.SPADES;},
            isDiamonds(){return this.currentTrump == CARD_COLOR.DIAMONDS;},
            isClubs(){return this.currentTrump == CARD_COLOR.CLUBS;},
        }
    }
</script>