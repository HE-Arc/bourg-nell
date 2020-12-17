<template>
    <div class="no-games">
        <font-awesome-icon :icon="['far', 'sad-cry']" />
        <h4>
            You have not played any games yet
        </h4>
    </div>
</template>

<script>
    import {faSadCry} from "@fortawesome/free-solid-svg-icons";
    export default {
        name: "noGames",
        components: {
            faSadCry
        }
    }
</script>