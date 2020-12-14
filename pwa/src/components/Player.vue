<template>
    <div :class="displayClass" :pos="'pos-'+pos" card-elevation="2">
        <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68" status="playing"/>
        <h3>Luca Laissue</h3>
    </div>
</template>

<script>
    import Avatar from "./Avatar";

    export default {
        name: "Player",
        components: {Avatar},
        props: {
            playerId: {
                type: Number,
                required: false,
            },
            playing: {
                type: Boolean,
                required: true
            },
            pos: {
                type: String,
                required: true
            }
        },
        computed: { 
            displayClass() {
                return `card player${this.playing ? " playing" : ""}`
            }
        }
    }
</script>