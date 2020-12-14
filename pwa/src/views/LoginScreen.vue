<template>
    <div id="root" class="login screen">
        <div class="login-form">
            <form>
                <h4>Welcome back !</h4>
                <label for="username">Username</label>
                <div class="input-error">
                    <input name="username" tabindex="1" type="text" placeholder="Username" />
                    <span class="error">Invalid username or password</span>
                </div>
                <label for="password">Password</label>
                <input name="password" type="password" tabindex="2" placeholder="Password" />
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
        mounted() {
            this.$store.dispatch("fetchAuthUser", {
                email: "test@gmail.com",
                password: "test"
            });
        }
    }
</script>