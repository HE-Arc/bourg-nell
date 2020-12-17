<template>
    <div id="root" class="login screen hasmaxwidth">
        <h2>You'r beeing disconnected</h2>
    </div>
</template>

<script>
    import TextInputWithError from "../components/InputWithError";
    export default {
        name: "LoginScreen",
        created() {
            this.$store.dispatch("destroyToken").finally(() => {
                this.$router.push({name: "login"});
            });
        }
    }
</script>