<template>
    <div id="root" class="login screen hasmaxwidth">
        <div class="login-form">
            <form @submit.prevent="register">
                <h4>Create your account now !</h4>

                <label for="username">Username</label>
                <TextInputWithError v-model="username" :errors="nameErrors" name="username" tabindex="1" type="text" placeholder="Username"/>

                <label for="email">Email</label>
                <TextInputWithError v-model="email" :errors="emailErrors" name="email" tabindex="2" type="email" placeholder="test@test.com"/>

                <label for="password">Password</label>
                <TextInputWithError v-model="password" :errors="passwordErrors" name="password" tabindex="3" type="password" placeholder="Password"/>

                <label for="password">Repeat Password</label>
                <TextInputWithError v-model="passwordRepeat" :errors="passwordRepeatErrors" name="password-repeat" tabindex="4" type="password" placeholder="Repeat password"/>

                <input tabindex="4" type="submit" name="submit" value="Sign up">
            </form>
        </div>
        <div>
            Already have an account ? <router-link to="login">Sign in !</router-link>
        </div>
    </div>
</template>

<script>
    import TextInputWithError from "../components/InputWithError";

    const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g

    export default {
        name: "LoginScreen",
        components: {
            TextInputWithError
        },
        data() {
            return {
                username: "",
                email: "",
                password: "",
                passwordRepeat: "",
                emailTaken: false,
                nameErrors: []
            }
        },
        methods: {
            register() {
                if(this.registerButtonDisabled) return;

                this.$store.dispatch("registerUser", {
                    name: this.username,
                    email: this.email,
                    password: this.password
                }).then(() => {
                    console.log("ok")
                    this.$router.push({ name: "login" })
                }).catch(() => {
                    console.log("ko")
                    this.emailTaken = true 
                });
            }
        },
        computed: {
            hasPasswordRepeatError() {
                return (this.password != this.passwordRepeat && this.password && this.passwordRepeat);
            },
            hasEmailParseErrors() {
                return (this.email && !this.email.match(EMAIL_REGEXP));
            },
            emailErrors() {
                let errors = [];
                if(this.hasEmailParseErrors) errors.push("Enter a valid email");
                if(this.emailTaken) errors.push("Email already used");
                return errors;
            },
            passwordErrors() {
                if(this.passwordRepeatErrors.length) return [""];
                return [];
            },
            passwordRepeatErrors() {
                let errors = [];
                if(this.hasPasswordRepeatError) errors.push("Passwords do not match");
                return errors;
            },
            registerButtonDisabled() {
                return  this.hasPasswordRepeatError || this.hasEmailParseErrors ||
                        !this.email || !this.password || !this.passwordRepeat ||
                        !this.username;
            }
        }
    }
</script>