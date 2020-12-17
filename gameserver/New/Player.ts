import {CARDS} from "./Cards";
import {CARD_COLOR} from "./CardColor";
import {Deck} from "./Deck";
import {CARD_VALUE}  from "./CardValue";
import {NetworkManager} from "./NetworkManager";

/**
 * @class Player
 * Representation of an ingame player
 */
export class Player
{
    private socket: SocketIO.Socket;
    private token: string;
    private cards = new Array<CARDS>();

    private id = 0;
    private name = "";
    private gravatar = "";

    constructor(socket: SocketIO.Socket, name: string) {
        this.socket = socket;
        this.token = name;
    }

    /**
     * @function fetchInfo
     * retrieve the name and the id of the player if his token is authorized
     */
    async fetchInfo() {
        let header = {Authorization: `Bearer ${this.token}`}
        let res = await NetworkManager.getInstance().fetchInfo(
            'users/me',
            header
        );
        this.id = res.me.id;
        this.name = res.me.name;
        this.gravatar = res.me.gravatar;
    }

    /**
     * @function getGravatar
     * @returns return the md5 hash linked to the player avatar
     */
    getGravatar() {
        return this.gravatar;
    }

    /**
     * @function getID
     * @returns return the player's id
     */
    getID() {
        return this.id;
    }

    /**
     * @function getSocket
     * @returns return the socket linked to the player
     */
    getSocket() {
        return this.socket;
    }

    /**
     * @function getName
     * @returns return the player's name
     */
    getName() {
        return this.name;
    }

    /**
     * @function emitID
     * Emit the current player id to the client
     */
    emitID(id: number) {
        this.socket.emit("id", id)
    }

    /**
     * @function getCards
     * @returns return actual player's cards
     */
    getCards() {
        return this.cards;
    }

    /**
     * @function setCards
     * @param cards player's cards
     * give new cards to the player, emit these cards to the client
     */
    setCards(cards: CARDS[]) {
        this.cards = cards;
        this.socket.emit("cards", this.cards);
    }

    disconnect() {
        console.log(this.id + " got disconnected");
        this.socket.emit("disconnect");
    }

    /**
     * @function playCard
     * @param currentFold current card on the "table"
     * @param currentTrump current trump color
     * Emit a played card to the client, pop the played card of player's deck
     */
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

    /**
     * @function chooseTrump
     * @param passed boolean that check if the trump was already passed
     * Permit the player to choose the raw trumpCard, if the player want, he can pass to his mate, but only one time per raw
     */
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

    /**
     * @function isCardAllowed
     * @param card current played card
     * @param currentTrump current trump card
     * @param currentFold fold of played card
     * Check if in function of the precedent card, the move is allowed
     */
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