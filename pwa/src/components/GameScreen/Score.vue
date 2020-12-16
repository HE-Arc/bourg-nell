<template>
    <div class="score card" card-elevation="1">
        <h3>Score</h3>
        <div>
            <h6>You &amp; <br/> {{partnerName.substr(0, 10)}}</h6>
            <div>{{myTeamScore}}</div>
        </div>
        <div>
            <h6>{{opponentPlayer1Name.substr(0, 10)}} &amp; <br/> {{opponentPlayer2Name.substr(0, 10)}}</h6>
            <div>{{theirTeamScore}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Score",
        props: {
            partnerName: {
                type: String,
                required: true
            },
            opponentPlayer1Name: {
                type: String,
                required: true
            },
            opponentPlayer2Name: {
                type: String,
                required: true
            },
            myTeamScore: {
                type: Number,
                required: true
            },
            theirTeamScore: {
                type: Number,
                required: true
            }
        }
    }
</script>