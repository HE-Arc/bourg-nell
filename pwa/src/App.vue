<template>
    <div id="root" class="account screen">
        <div class="account-header">
            <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68" status="online"/>
            <h2>Luca Laissue</h2>
        </div>
        <h3>Games</h3>
        <HistoryItem v-for="item in games" :key="item.gameId" :gameObj="item"/>
    </div>
</template>

<script>
import Avatar from './components/Avatar';
import HistoryItem from './components/HistoryItem';

export default {
    name: 'App',
    components: {
        Avatar,
        HistoryItem
    },
    data() {
        return {
            games: [
                {
                    gameId: "123712947123908",
                    player1: "12398712893789",
                    player2: "123897128937",
                    player3: "123897128937",
                    player4: "123897128937",
                    scoreLimit: 1000,
                    scoreTeam1: 560,
                    scoreTeam2: 1012,
                    gameState: 3,
                    creationDate: new Date(Date.now())
                }
            ]
        }
    }
}
</script>
