<template>
    <nav class="navigation">
        <router-link to="/play" class="navigation-tab">
            <div class="icon">
                <font-awesome-icon :icon="['far', 'play-circle']" />
            </div>
            <span>Play</span> 
        </router-link>
        <router-link to="/" class="navigation-tab selected">
            <div class="icon">
                <font-awesome-icon :icon="['far', 'user']"/>
            </div>
            <span>Account</span> 
        </router-link>
    </nav>
</template>

<script>

export default {
    name: "Navigation"
}
</script>