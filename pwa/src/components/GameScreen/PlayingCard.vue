<template>
    <div @click="emitPlayed" :class="displayClass"><img :src="imgName" alt=""></div>
</template>

<script>
    import * as Cards from "../../cards/Cards";
    import {CARD_COLOR } from "../../cards/CardColor";
    import {CARD_VALUE} from "../../cards/CardValue";
   
    export default {
        name: "PlayingCard",
        props: {
            lang: {
                type: String,
                required: false
            },
            card: {
                type: Number,
                required: true
            },
            fold: {
                type: String,
                required: false
            },
            playedDirection: {
                type: String,
                required: false
            },
            handPosition: {
                type: Number,
                required: false
            }
        },
        computed: { 
            imgName() {
                let cardColor = CARD_COLOR[Cards.findCardColor(this.card)].toLowerCase();
                let cardValue = CARD_VALUE[Cards.findCardValue(this.card)].toLowerCase();
                let cardLang = this.lang || "fr";
                return `/img/cards_${cardLang}/${cardColor}/${cardValue}.png`;
            },
            displayClass() {
                return `playing-card ${this.playedDirection || ""} ${this.foldDirection()} ${this.indexPosition()}`;
            } 
        },
        methods: {
            foldDirection()
            {
                return this.fold ? `fold-${this.fold}` : "";
            },
            indexPosition()
            {
                if(this.handPosition === undefined) return "";

                return `index-${this.handPosition}`;
            },
            emitPlayed()
            {
                console.log("clicked");
                this.$emit("played", this.card);
            }
        }
    }
</script>