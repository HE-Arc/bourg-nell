<template>
    <div class="player-passed card" card-elevation="1">
        <font-awesome-icon v-if="isTop" icon="arrow-down"/>
        <font-awesome-icon v-if="isBottom" icon="arrow-up"/>
        <font-awesome-icon v-if="isLeft" icon="arrow-right"/>
        <font-awesome-icon v-if="isRight" icon="arrow-left"/>
    </div>
</template>

<script>
    import {CARD_COLOR} from "../../cards/CardColor";
    export default {
        name: "PlayerPassed",
        props: {
            direction: {
                type: String,
                required: true
            }
        },
        computed: { 
            isTop(){return this.direction == "top";},
            isBottom(){return this.direction == "bottom";},
            isRight(){return this.direction == "right";},
            isLeft(){return this.direction == "left";},
        }
    }
</script>