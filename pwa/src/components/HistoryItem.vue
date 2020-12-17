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
                <div :class="gameObj.gamestate == 3 ? 'win' : ''" win>{{gameObj.scoreteam1}}</div>
                <div :class="gameObj.gamestate == 4 ? 'win' : ''">{{gameObj.scoreteam2}}</div>
            </div>
            <div v-else class="gameresult">
                <div><span class="score-placeholder"></span></div>
                <div><span class="score-placeholder"></span></div>
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
            myId: {
                type: Number,
                required: true
            },
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
            isMyIdTeam1() {
                return (this.gameObj.player1.id == this.myId || this.gameObj.player3 == this.myId);
            },
            isMyIdTeam2() {
                return (this.gameObj.player2.id == this.myId || this.gameObj.player4 == this.myId);
            },
            won() {
                return (this.gameObj.gamestate == 3 && this.isMyIdTeam1) || (this.gameObj.gamestate == 4 && this.isMyIdTeam2);
            },
            historyItemClass() {
                let classStr = "";
                switch(this.gameObj.gamestate)
                {
                    case 2: classStr = "playing"; break;
                    case 3: ;
                    case 4: classStr = this.won ? "won" : "lost"; break;
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
                    case 3:
                    case 4: return this.won ? "Won" : "Lost";
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