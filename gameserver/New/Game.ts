import { CARD_COLOR } from "./CardColor";
import {CARDS} from "./Cards";
import { findCardScore } from "./CardScore";
import { Deck } from "./Deck";
import {Player} from "./Player";
import {CARD_VALUE} from "./CardValue";

const ROUND_SIZE = 9;

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

    public constructor(players: Player[], maxScore = 1000)
    {
        this.players = players; 
        this.currentPlayerIndex = 0; 
        this.maxScore = maxScore;
    }

    async wait(timems: number): Promise<void>
    {
        return new Promise((s, r) => {
            setTimeout(() => {
                s();
            }, timems);
        });
    }
    
    private roomBroadcast(event: string, ...args: any[])
    {
        this.players.forEach(p => p.getSocket().emit(event, ...args));
    }

    async playGame()
    {
        for(let i = 0; i < this.players.length; ++i)
        {
            this.players[i].emitID(i);
        }

        for(let i = 0; i < this.players.length; ++i)
        {
            this.roomBroadcast("player", i, this.players[i].getName());
        }

        this.roomBroadcast("gameStart");

        let trumpMakerId = 0;

        while(this.scoreTeam1 < this.maxScore && this.scoreTeam2 < this.maxScore)
        {
            this.currentPlayerIndex = trumpMakerId;
            await this.playRound();
            this.currentPlayerIndex = trumpMakerId;
            this.nextPlayer();
            trumpMakerId = this.currentPlayerIndex;
        }
    }
    
    private getCurrentPlayer()
    {
        return this.players[this.currentPlayerIndex];
    }

    addTeamScoreOfPlayer(playerIndex: number, score: number)
    {
        if(playerIndex % 2 == 0)
        {
            this.scoreTeam1 += score;
        }
        else
        {
            this.scoreTeam2 += score;
        }
    }

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
                if(player.getCards().includes(CARDS.SEVEN_DIAMOND))
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
            this.currentTrumpColor = await this.players[(this.currentPlayerIndex + 2) % 4].chooseTrump(true);
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

            await this.wait(2000);

            this.addTeamScoreOfPlayer(foldPlayerIndex, score);

            // Check Match
            if(foldPlayerIndex % 2 == 0)
            {
                allFoldsFromTeam2 = false;
            }
            else
            {
                allFoldsFromTeam1 = false;
            }

            if(roundIndex == ROUND_SIZE - 1)
            {
                this.addTeamScoreOfPlayer(foldPlayerIndex, 5);
                if(allFoldsFromTeam1) this.scoreTeam1 += 100;
                if(allFoldsFromTeam2) this.scoreTeam2 += 100;
            }

            // Notify score and winner of current fold
            this.roomBroadcast("scoreTeam1", this.scoreTeam1);
            this.roomBroadcast("scoreTeam2", this.scoreTeam2);
            this.roomBroadcast("fold", foldPlayerIndex);

            // Reset for next round
            this.playedCards = [];
            this.currentPlayerIndex = foldPlayerIndex;
        }

        await this.wait(1000);
    }

    nextPlayer()
    {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}