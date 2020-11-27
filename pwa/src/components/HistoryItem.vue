<template>
    <div :class="historyItemClass" card-elevation="1">
        <div class="score">
            <div class="score-header">
                <div class="gamestatus">{{gameStatusText}}</div>
                <div class="date">
                    <span>{{gameObj.creationDate}}</span>
                </div>
            </div>
            <div class="gameresult">
                <div class="myscore">{{gameObj.scoreTeam1}}</div>
                <div class="theirscore">{{gameObj.scoreTeam2}}</div>
            </div>
        </div>
        <div class="hidden-content">
            <h4>Players</h4>
            <div class="players">
                <div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Username placeholder</span>
                </div><div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Username placeholder</span>
                </div><div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Username placeholder</span>
                </div><div class="player">
                    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68"/>
                    <span>Username placeholder</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Avatar from "./Avatar";

    // todo: load user informations
    export default {
        components: {
            Avatar
        },
        props: {
            gameObj: {
                type: Object,
                required: true
            }
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
            }
        }
    }
</script>