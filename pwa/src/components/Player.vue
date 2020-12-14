<template>
    <div :class="displayClass" :pos="'pos-'+pos" card-elevation="2">
        <Avatar :md5hash="imgPath" status="playing"/>
        <h3>{{name}}</h3>
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
            },
            name: {
                type: String,
                required: true
            },
            imgPath: {
                type: String,
                required: false
            }
        },
        computed: { 
            displayClass() {
                return `card player${this.playing ? " playing" : ""}`
            }
        }
    }
</script>