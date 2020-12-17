<template>
    <div class="gamewin modal">
        <div class="game-recap card" card-elevation="4">
            <h2>You {{win ? "won" : "lost"}} the match</h2>
            <h4>{{scoreTeam1}} / {{scoreTeam2}}</h4>
            <button @click="$router.push({name: 'account'})">Go back to your account</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GameWinModal",
        props: {
            win: {
                type: Boolean,
                required: true
            },
            scoreTeam1: {
                type: Number,
                required: true
            },
            scoreTeam2: {
                type: Number,
                required: true
            }
        }
    }
</script>