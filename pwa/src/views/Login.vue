<template>
    <div id="root" class="login screen hasmaxwidth">
        <div class="login-form">
            <form @submit.prevent="login">
                <h4>Welcome back !</h4>

                <label for="username">Username</label>
                <TextInputWithError v-model="username" :errors="connectErrors" name="username" tabindex="1" type="text" placeholder="Username"/>

                <label for="password">Password</label>
                <TextInputWithError v-model="password" name="password" tabindex="2" type="password" placeholder="Password"/>

                <input tabindex="4" type="submit" name="submit" value="Sign in">
            </form>
        </div>
        <div>
            Dont't have an account ? <router-link to="register">create one now !</router-link>
        </div>
    </div>
</template>

<script>
    import TextInputWithError from "../components/InputWithError";
    export default {
        name: "LoginScreen",
        components: {
            TextInputWithError
        },
        data() {
            return {
                username: "",
                password: "",
                connectErrors: []
            }
        },
        methods: {
            login() {
                this.$store.dispatch("retrieveToken", {
                    email: this.username,
                    password: this.password
                }).then(() => {
                    this.$router.push({ name: "account" })
                }).catch(() => {
                    this.connectErrors = ["Invalid username or password"];
                });
            }
        }
    }
</script>