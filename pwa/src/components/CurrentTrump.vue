<template>
    <div class="current-trump card" card-elevation="1">
        <img v-if="isHearts" src="/hearts.png" alt="">
        <img v-if="isSpades" src="/spades.png" alt="">
        <img v-if="isDiamonds" src="/diamonds.png" alt="">
        <img v-if="isClubs" src="/clubs.png" alt="">
    </div>
</template>

<script>
    import {CARD_COLOR} from "../cards/CardColor";
    export default {
        name: "CurrentTrump",
        props: {
            currentTrump: {
                type: Number,
                required: true
            }
        },
        mounted() {
            console.log(this.isHearts());
            console.log(this.isSpades());
            console.log(this.isDiamonds());
            console.log(this.isClubs());
        },
        computed: { 
            isHearts(){return this.currentTrump == CARD_COLOR.HEARTS;},
            isSpades(){return this.currentTrump == CARD_COLOR.SPADES;},
            isDiamonds(){return this.currentTrump == CARD_COLOR.DIAMONDS;},
            isClubs(){return this.currentTrump == CARD_COLOR.CLUBS;},
        }
    }
</script>