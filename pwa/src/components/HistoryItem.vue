<template>
    <div @click="toggleExpand" :class="historyItemClass" card-elevation="1">
        <div class="score">
            <div class="score-header">
                <div class="gamestatus">{{gameStatusText}}</div>
                <div class="date">
                    <span>{{new Date(gameObj.created_at).toLocaleDateString()}}</span>
                </div>
            </div>
            <div v-if="displayScore" class="gameresult">
                <div class="myscore">{{gameObj.scoreteam1}}</div>
                <div class="theirscore">{{gameObj.scoreteam2}}</div>
            </div>
            <div v-else class="gameresult">
                <div class="myscore"><span class="score-placeholder"></span></div>
                <div class="theirscore"><span class="score-placeholder"></span></div>
            </div>
        </div>
        <div class="hidden-content">
            <h4>Players</h4>
            <div class="players">
                <div @click="load(gameObj.player1.id)" class="player">
                    <Avatar :md5hash="gameObj.player1.gravatar"/>
                    <span>{{gameObj.player1.name}}</span>
                </div><div @click="load(gameObj.player2.id)" class="player">
                    <Avatar :md5hash="gameObj.player2.gravatar"/>
                    <span>{{gameObj.player2.name}}</span>
                </div><div @click="load(gameObj.player3.id)" class="player">
                    <Avatar :md5hash="gameObj.player3.gravatar"/>
                    <span>{{gameObj.player3.name}}</span>
                </div><div @click="load(gameObj.player4.id)" class="player">
                    <Avatar :md5hash="gameObj.player4.gravatar"/>
                    <span>{{gameObj.player4.name}}</span>
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
            },
            opened: {
                type: Boolean,
                required: false
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
                switch(this.gameObj.gamestate)
                {
                    case 2: classStr = "playing"; break;
                    case 3: classStr = "won"; break;
                    case 4: classStr = "lost"; break;
                }
                if(this.expanded || this.opened)
                {
                    classStr += " open";
                }
                return `card history_item ${classStr}`;
            },
            gameStatusText() {
                switch(this.gameObj.gamestate)
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
                return this.gameObj.gamestate >= 2;
            }
        },
        methods: {
            toggleExpand() {
                this.expanded = !this.expanded;
            },
            load(userId) {
                this.$emit("loadUser", userId);
            }
        }
    }
</script>