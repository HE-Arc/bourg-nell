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

    async chooseTrump(): Promise<CARD_COLOR> {
        return new Promise((s,r) => {
            this.socket.emit("chooseTrump");
            let trumpCardCb = (card: CARD_COLOR) => {
                this.socket.off("chooseTrump", trumpCardCb);
                s(card);
            }
            this.socket.on("chooseTrump", trumpCardCb)
        });
    }
}