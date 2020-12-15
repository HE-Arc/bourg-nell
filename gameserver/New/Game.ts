import { CARD_COLOR } from "./CardColor";
import {CARDS} from "./Cards";
import { findCardScore } from "./CardScore";
import { Deck } from "./Deck";
import {Player} from "./Player";
import {CARD_VALUE} from "./CardValue";


export class Game
{
    private players = new Array<Player>();
    private currentPlayerIndex = 0;
    
    private scoreTeam1 = 0; // 0 with 2
    private scoreTeam2 = 0; // 1 with 3
    private maxScore = 0;

    private playedCards = new Array<CARDS>();
    private currentTrumpColor = CARD_COLOR.SPADES;

    public constructor(players: Player[], maxScore = 1000)
    {
        this.players = players; 
        this.currentPlayerIndex = 0; 
        this.maxScore = maxScore;
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

        let trumpMakerId = 0;

        while(this.scoreTeam1 < this.maxScore && this.scoreTeam2 < this.maxScore)
        {
            this.currentPlayerIndex = trumpMakerId;
            await this.playRound();
            this.currentPlayerIndex = trumpMakerId;
            this.nextPlayer();
            trumpMakerId = this.currentPlayerIndex;
        }
        const playedCard = await this.players[0].playCard();
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

        // Choose trump
        //this.currentTrumpColor = await this.getCurrentPlayer().chooseTrump();

        for(let i = 0; i < 9; ++i) // Todo remove magic number
        {
            let startId = this.currentPlayerIndex;

            // Play pass
            while(this.playedCards.length < this.players.length)
            {
                // currentPlayer Play
                this.roomBroadcast("playerPlaying", this.currentPlayerIndex);
                const card = await this.getCurrentPlayer().playCard();
                this.roomBroadcast("playCard", this.currentPlayerIndex, card);
                this.playedCards.push(card);
                this.nextPlayer();
            }

            let currentColor = Deck.findCardColor(this.playedCards[0])
            
            // Best card values
            let cardScores = this.playedCards.map((card) => {
                let currentCardColor = Deck.findCardColor(card);
                let currentCardValue = Deck.findCardValue(card);
                
                if(currentCardColor === this.currentTrumpColor)
                {
                    if(currentCardValue == CARD_VALUE.NINE || currentCardValue == CARD_VALUE.JACK) currentCardValue += 0b00100000;
                    return 0b01000000 + currentCardValue;
                }
                if(currentCardColor === currentColor) return 0b00010000 + currentCardValue;
                return currentCardValue
            });

            console.log(this.playedCards);
            console.log(cardScores);

            let bestCardIndex = -1;
            cardScores.reduce((s1, s2, i) => {
                if(s2 > s1)
                {
                    bestCardIndex = i;
                    return s2;
                }
                else
                {
                    return s1;
                }
            }, 0);
            let foldPlayerIndex = (bestCardIndex + startId) % this.players.length;


            // Increment score
            const score = this.playedCards.reduce((s1, s2) => {
                return s1 + findCardScore(s2, this.currentTrumpColor);
            }, 0);
            this.addTeamScoreOfPlayer(foldPlayerIndex, score);
            this.roomBroadcast("fold", foldPlayerIndex);

            // Reset for next round
            this.playedCards = [];
            this.currentPlayerIndex = foldPlayerIndex;
        }
    }

    nextPlayer()
    {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}