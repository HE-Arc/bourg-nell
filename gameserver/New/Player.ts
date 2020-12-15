import {CARDS} from "./Cards";
import { CARD_COLOR } from "./CardColor";

export class Player
{
    private socket: SocketIO.Socket;
    private name: string;
    private cards = new Array<Number>();

    constructor(socket: SocketIO.Socket, name: string)
    {
        this.socket = socket;
        this.name = name;
    }

    getSocket() {
        return this.socket;
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

    setCards(cards: Number[]) {
        this.cards = cards;
        this.socket.emit("cards", this.cards);
    }

    async playCard(): Promise<CARDS>
    {
        return new Promise((s, r) => {
            this.socket.emit("yourTurn");
            let playedCardCb = (card: CARDS) => {
                this.socket.off("turnCard", playedCardCb);
                s(card);
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
}