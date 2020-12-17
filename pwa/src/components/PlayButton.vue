<template>
    <div class="fab-container">
        <div @click="$emit('play')" class="play-button">
            <font-awesome-icon :icon="['far', 'play-circle']"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PlayButton"
    }
</script>