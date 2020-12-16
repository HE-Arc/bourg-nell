<template>
    <div id="root" class="login screen hasmaxwidth">
        <div class="login-form">
            <form @submit.prevent="login">
                <h4>Welcome back !</h4>
                <label for="username">Username</label>
                <div v-if="connectError" class="input-error">
                    <input v-model="username" name="username" tabindex="1" type="text" placeholder="Username" />
                    <span class="error">Invalid username or password</span>
                </div>
                <div v-else>
                    <input v-model="username" name="username" tabindex="1" type="text" placeholder="Username" />
                </div>
                <label for="password">Password</label>
                <input v-model="password" name="password" type="password" tabindex="2" placeholder="Password" />
                <input name="remember-me" tabindex="3" type="checkbox">
                <label for="remember-me">Remember Username</label>
                <input tabindex="4" type="submit" name="submit" value="Sign in">
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LoginScreen",
        data() {
            return {
                username: "",
                password: "",
                connectError: false
            }
        },
        methods: {
            login() {
                this.$store.dispatch("retrieveToken", {
                    email: this.username,
                    password: this.password
                }).then(() => {
                    console.log("Connected !");
                    this.$router.push({ name: "account" })
                }).catch(() => {
                    this.connectError = true 
                });
            }
        }
    }
</script>