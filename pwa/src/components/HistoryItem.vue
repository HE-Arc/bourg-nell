<template>
    <div @click="toggleExpand" :class="historyItemClass" card-elevation="1">
        <div class="score">
            <div class="score-header">
                <div class="gamestatus">{{gameStatusText}}</div>
                <div class="date">
                    <span>{{gameObj.creationDate.toLocaleDateString()}}</span>
                </div>
            </div>
            <div v-if="displayScore" class="gameresult">
                <div class="myscore">{{gameObj.scoreTeam1}}</div>
                <div class="theirscore">{{gameObj.scoreTeam2}}</div>
            </div>
            <div v-else class="gameresult">
                <div class="myscore"><span class="score-placeholder"></span></div>
                <div class="theirscore"><span class="score-placeholder"></span></div>
            </div>
        </div>
        <div class="hidden-content">
            <h4>Players</h4>
            <div class="players">
                <div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Luca</span>
                </div><div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Luca</span>
                </div><div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Luca</span>
                </div><div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Luca</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Avatar from "./Avatar";

    // todo: load user informations
    export default {
        name: "HistoryItem",
        components: {
            Avatar
        },
        props: {
            gameObj: {
                type: Object,
                required: true
            }
        },
        data(){
            return {
                expanded: false
            };
        },
        computed: { 
            historyItemClass() {
                let classStr = "";
                switch(this.gameObj.gameState)
                {
                    case 2: classStr = "playing"; break;
                    case 3: classStr = "won"; break;
                    case 4: classStr = "lost"; break;
                }
                if(this.expanded)
                {
                    classStr += " open";
                }
                return `card history_item ${classStr}`;
            },
            gameStatusText() {
                switch(this.gameObj.gameState)
                {
                    case 0: return "Game created";
                    case 1: return "Game aborted";
                    case 2: return "Game in progress";
                    case 3: return "Won team1";
                    case 4: return "Won team2";
                    default: return "Error";
                }
            },
            displayScore() {
                return this.gameObj.gameState > 2;
            }
        },
        methods: {
            toggleExpand() {
                this.expanded = !this.expanded;
            }
        }
    }
</script>