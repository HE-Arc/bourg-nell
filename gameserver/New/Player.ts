import {CARDS} from "./Cards";
import {CARD_COLOR} from "./CardColor";
import {Deck} from "./Deck";
import {CARD_VALUE}  from "./CardValue";
import {NetworkManager} from "./NetworkManager";
import {State} from "./State";
import CONFIG from "../config";

export class Player
{
    private socket: SocketIO.Socket;
    private token: string;
    private cards = new Array<CARDS>();

    private id = 0;
    private name = "";

    constructor(socket: SocketIO.Socket, name: string) {
        this.socket = socket;
        this.token = name;
    }

    async fetchInfo() {
        let header = {Authorization: `Bearer ${this.token}`}

        NetworkManager.getInstance().fetchInfo(
            CONFIG.api +'users/me',
            header
        ).then((res) => {
            this.id = res.id;
            this.name = res.name;
        }).catch((error) => {
            console.log(error);
        });
    }

    getID() {
        return this.id;
    }

    getSocket() {
        return this.socket;
    }
    
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    emitID(id: number) {
        this.socket.emit("id", id)
    }

    getCards() {
        return this.cards;
    }

    setCards(cards: CARDS[]) {
        this.cards = cards;
        this.socket.emit("cards", this.cards);
    }

    disconnect() {
        console.log(this.id + " got disconnected");
        this.socket.emit("disconnect");
    }

    async playCard(currentFold: CARDS[], currentTrump: CARD_COLOR): Promise<CARDS> {
        return new Promise((s, r) => {
            this.socket.emit("yourTurn");
            let playedCardCb = (card: CARDS) => {
                if(this.isCardAllowed(card, currentTrump, currentFold))
                {
                    this.socket.off("turnCard", playedCardCb);
                    this.cards.splice(this.cards.indexOf(card), 1);
                    s(card);
                }
            }
            this.socket.on("turnCard", playedCardCb);
        });
    }

    async chooseTrump(passed = false): Promise<CARD_COLOR> {
        return new Promise((s,r) => {
            this.socket.emit(passed ? "passed" : "chooseTrump");
            let trumpCardCb = (color: CARD_COLOR) => {
                this.socket.off("trump", trumpCardCb);
                this.socket.off ("pass", passCb);
                s(color);
            }
            let passCb = () => {
                this.socket.off ("pass", passCb);
                this.socket.off("trump", trumpCardCb);
                r();
            };

            this.socket.on("trump", trumpCardCb);
            if(!passed) { this.socket.on("pass", passCb); }
        });
    }

    private isCardAllowed(card: CARDS, currentTrump: CARD_COLOR, currentFold: CARDS[]) {
        // Player must have the card
        if(!this.cards.includes(card)) return false;
        
        // If it is the first card to play all cards are possible
        if(currentFold.length == 0) return true;

        // Usefull values
        const foldBaseColor = Deck.findCardColor(currentFold[0]);
        const cardColor = Deck.findCardColor(card);
        const foldIsCut = currentFold.some(c => Deck.findCardColor(c) == currentTrump) && foldBaseColor != currentTrump

        // If the card follows the base fold color it is allowed
        if(cardColor == foldBaseColor) return true;

        // Subcut is not allowed
        const currentFoldCardPowers = currentFold.map(c => Deck.findCardPower(c, foldBaseColor, currentTrump));
        const bestFoldCardPower = Math.max(...currentFoldCardPowers);
        const cardIsBetter = bestFoldCardPower < Deck.findCardPower(card, foldBaseColor, currentTrump);
        const hasOnlyTrumpCards = !this.cards.some(c => Deck.findCardColor(c) != currentTrump);
        if(!cardIsBetter && foldIsCut && cardColor == currentTrump && !hasOnlyTrumpCards) return false;

        // Allowed if card is trump
        if(cardColor == currentTrump) return true;

        // Your are allowed to play an other card if the only trump you have is the jack and the basecolor is the trump color
        const onlyTrumpIsJack = !this.cards.filter(c => Deck.findCardColor(c) == currentTrump).some(c => Deck.findCardValue(c) != CARD_VALUE.JACK);
        const didNotFollow = this.cards.some(c => Deck.findCardColor(c) == foldBaseColor);
        if(didNotFollow && onlyTrumpIsJack && foldBaseColor == currentTrump) return true;

        // If you have a card from the base color it is not allowed since you did not follow
        if(didNotFollow) return false;

        // You don't have a card from the base color, your card is allowed
        return true;
    }
}