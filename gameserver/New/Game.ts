import { CARD_COLOR } from "./CardColor";
import {CARDS} from "./Cards";
import { findCardScore } from "./CardScore";
import { Deck } from "./Deck";
import {Player} from "./Player";
import { State } from "./State";
import {NetworkManager} from "./NetworkManager";

const ROUND_SIZE = 9;
const BONUS_POINTS_LAST_FOLD = 5;
const BONUS_POINTS_MATCH = 100;
const PLAYERS_PER_GAME = 4;
const OPPOSITE_PLAYER_OFFSET = 2;
const TEAM_COUNT = 2;

const FOLD_DELAY_MS = 2500;
const NEW_ROUND_DELAY_MS = 1500;

/**
 * @class Game
 * Representation of a current game session
 */
export class Game
{
    private players = new Array<Player>();
    private currentPlayerIndex = 0;
    
    private scoreTeam1 = 0; // 0 with 2
    private scoreTeam2 = 0; // 1 with 3
    private maxScore = 0;

    private playedCards = new Array<CARDS>();
    private firstTrump = true;
    private currentTrumpColor = CARD_COLOR.SPADES;
    private id: string = "";

    public constructor(players: Player[], maxScore = 1000)
    {
        this.players = players; 
        this.currentPlayerIndex = 0; 
        this.maxScore = maxScore;
    }

    /**
     * @function createGame
     * create a game entry in database with all the players in game and the score limit 
     */
    async createGame()
    {
        let datas = {
            player1: this.players[0].getID(), 
            player2: this.players[1].getID(),
            player3: this.players[2].getID(),
            player4: this.players[3].getID(),
            scorelimit: 1000,
        }
        let network = NetworkManager.getInstance();

        network.updateDatas(
            'games',
            'post',
            datas
            ).then((res) => {
                this.id = res;
            }).catch((error) => {
                console.log(error);
            }
        );
    }

    /**
     * @function patchData
     * @param state state of the game when this function is called
     * Update database entrys at each turn, to update the scores and the state during a match
     */
    async patchData(state: State) {
        let datas = {
            scoreteam1: this.scoreTeam1,
            scoreteam2: this.scoreTeam2,
            gamestate: state
        };
        
        NetworkManager.getInstance().updateDatas(
            this.id,
            "patch",
            datas
        )
    }

    /**
     * @function setID
     * @param id id of the game
     * set the id of the game
     */
    public setId(id: string) {
        this.id = id;
    }

    /**
     * @function wait
     * @param timems duration in ms
     * make a pause for a given amount of time
     */
    async wait(timems: number): Promise<void>
    {
        return new Promise((s, r) => {
            setTimeout(() => {
                s();
            }, timems);
        });
    }
    
    /**
     * @function roomBroadcast
     * @param event event you want to broadcast
     * @param args all other param to send in function of the event
     * broadcast to all players in game a event
     */
    private roomBroadcast(event: string, ...args: any[])
    {
        this.players.forEach(p => p.getSocket().emit(event, ...args));
    }

    /**
     * @function playGame
     * create and run a game until the end
     */
    async playGame()
    {
        
        await this.createGame();

        this.patchData(State.Created);

        for(let i = 0; i < this.players.length; ++i)
        {
            this.players[i].emitID();
        }

        for(let i = 0; i < this.players.length; ++i)
        {
            this.roomBroadcast("player", i, this.players[i].getName());
        }
        this.roomBroadcast("gameStart");

        let trumpMakerId = 0;

        this.patchData(State.Playing)

        while(this.scoreTeam1 < this.maxScore && this.scoreTeam2 < this.maxScore)
        {
            this.currentPlayerIndex = trumpMakerId;
            await this.playRound();
            this.currentPlayerIndex = trumpMakerId;
            this.nextPlayer();
            trumpMakerId = this.currentPlayerIndex;
        }
        // when the game is finished, set the game as finished
        let wonState = (this.scoreTeam1 >= this.maxScore ? State.WonTeam1 : State.WonTeam2);
        
        this.patchData(wonState);
        
        this.roomBroadcast("gameWin", wonState)

    }
    
    /**
     * @function getCurrentPlayer
     * @returns current player's turn
     * return the current player's turn
     */
    private getCurrentPlayer()
    {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * @function addTeamScoreOfPlayer
     * @param playerIndex index of the winner
     * @param score score to add
     * increment the score of the team that won the fold in function of the player index
     */
    addTeamScoreOfPlayer(playerIndex: number, score: number)
    {
        // Player in team 1
        if(playerIndex % TEAM_COUNT == 0)
        {
            this.scoreTeam1 += score;
        }
        // Player in team 2
        else
        {
            this.scoreTeam2 += score;
        }
    }

    /**
     * @function playRound
     * play a round: give cards to players and is executing until no more cards are in the game
     */
    async playRound()
    {
        // Distribute new cards
        let deck = new Deck();
        deck.shuffleDeck();
        let cardNumber = deck.getDeck().length / this.players.length;
        this.players.forEach(player => {
            player.setCards(deck.getDeck().splice(0, cardNumber));
        });                

        // First round, player that has seven of diamonds chooses trump
        if(this.firstTrump)
        {
            this.firstTrump = false;
            this.players.forEach((player, index) => {
                if(player.getCards().includes(CARDS.SEVEN_DIAMONDS))
                {
                    this.currentPlayerIndex = index;
                }
            });
        }

        // Choose trump
        try
        {
            this.currentTrumpColor = await this.getCurrentPlayer().chooseTrump();
        }
        catch
        {
            this.roomBroadcast("playerPassed", this.currentPlayerIndex);
            this.currentTrumpColor = await this.players[(this.currentPlayerIndex + OPPOSITE_PLAYER_OFFSET) % PLAYERS_PER_GAME].chooseTrump(true);
        }
        
        this.roomBroadcast("currentTrump", this.currentTrumpColor);

        let allFoldsFromTeam1 = true;
        let allFoldsFromTeam2 = true;
        for(let roundIndex = 0; roundIndex < ROUND_SIZE; ++roundIndex)
        {
            let startId = this.currentPlayerIndex;

            // Play pass
            while(this.playedCards.length < this.players.length)
            {
                // currentPlayer Play
                this.roomBroadcast("playerPlaying", this.currentPlayerIndex);
                const card = await this.getCurrentPlayer().playCard(this.playedCards, this.currentTrumpColor);
                this.roomBroadcast("playCard", this.currentPlayerIndex, card);
                this.playedCards.push(card);
                this.nextPlayer();
            }

            let currentColor = Deck.findCardColor(this.playedCards[0])
            
            // Best card values
            let cardScores = this.playedCards.map(c => Deck.findCardPower(c, currentColor, this.currentTrumpColor));
            let bestCardIndex = cardScores.indexOf(Math.max(...cardScores));
            let foldPlayerIndex = (bestCardIndex + startId) % this.players.length;

            // Increment score
            const score = this.playedCards.reduce((s1, s2) => {
                return s1 + findCardScore(s2, this.currentTrumpColor);
            }, 0);

            await this.wait(FOLD_DELAY_MS);

            this.addTeamScoreOfPlayer(foldPlayerIndex, score);

            // Check Match
            if(foldPlayerIndex % TEAM_COUNT == 0)
            {
                allFoldsFromTeam2 = false;
            }
            else
            {
                allFoldsFromTeam1 = false;
            }

            if(roundIndex == ROUND_SIZE - 1)
            {
                // Last fold winner wins 5 more points
                this.addTeamScoreOfPlayer(foldPlayerIndex, BONUS_POINTS_LAST_FOLD);

                // Add bonus points in case of match
                if(allFoldsFromTeam1) this.scoreTeam1 += BONUS_POINTS_MATCH;
                if(allFoldsFromTeam2) this.scoreTeam2 += BONUS_POINTS_MATCH;
            }

            this.patchData(State.Playing)

            // Notify score and winner of current fold
            this.roomBroadcast("scoreTeam1", this.scoreTeam1);
            this.roomBroadcast("scoreTeam2", this.scoreTeam2);
            this.roomBroadcast("fold", foldPlayerIndex);

            // Reset for next round
            this.playedCards = [];
            this.currentPlayerIndex = foldPlayerIndex;
        }

        await this.wait(NEW_ROUND_DELAY_MS);
    }

    /**
     * @function nextPlayer
     * give the next player index 
     */
    nextPlayer()
    {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}