import fetch from "node-fetch";

export class NetworkManager {

    private static instance: NetworkManager;

    constructor() {

    }

    static getInstance() {
        if (!NetworkManager.instance)
            NetworkManager.instance = new NetworkManager();
        
        return NetworkManager.instance;
    }

    async updateDatas(url: string, methodType: string, token: string, body: object) {
        const res = await fetch(url, {
            method: methodType,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body : JSON.stringify(body),
        });

        if (methodType.toLowerCase() == 'post') {
            const body = await res.json();
            return body.game.id;
        }
    }

    async fetchInfo(url: string, header: any) {
        let res = await fetch(url, {
            headers: header
        });

        if (!res.ok) throw new Error("Invalid token");

        const body = await res.json();
        return body;
    }

}