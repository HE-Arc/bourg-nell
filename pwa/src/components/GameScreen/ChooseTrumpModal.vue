<template>
    <div class="trump-selection modal">
        <div class="choice-modal card" card-elevation="4">
            <h2 v-if="allowPass">Choose trump</h2>
            <h2 v-else>Passed ! Choose trump</h2>
            <div class="choices">
                <img @click="emitHearts" src="../../assets/hearts_ace.png" alt="">
                <img @click="emitSpades" src="../../assets/spades_ace.png" alt="">
                <img @click="emitDiamonds" src="../../assets/diamonds_ace.png" alt="">
                <img @click="emitClubs" src="../../assets/clubs_ace.png" alt="">
            </div>
            <button v-if="allowPass" @click="emitPass" class="pass-button">Pass</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ChooseTrumpModal",
        props: {
            allowPass: {
                type: Boolean,
                required: true
            }
        },
        methods: {
            emitHearts() {this.$emit("hearts");},
            emitSpades() {this.$emit("spades");},
            emitDiamonds() {this.$emit("diamonds");},
            emitClubs() {this.$emit("clubs");},
            emitPass() {this.$emit("pass");}
        }
    }
</script>