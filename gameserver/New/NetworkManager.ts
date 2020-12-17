import fetch, { Response } from "node-fetch";

export class NetworkManager {

    private static instance: NetworkManager;
    private token = "";

    constructor() {
        this.authentification();
    }

    getToken() {
        return this.token;
    }

    async authentification() {
        const response = await fetch('https://bourgnell.srvz-webapp.he-arc.ch/users/login', {
            method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": "robin",
                    "password": "test"
                }),
        });
        
        if(!response.ok) throw Error("Invalid Credentials");
        const body = await response.json();
        this.token = body.token;
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
        })

        if (res.status == 401) {
            this.authentification();
        } else if (methodType.toLowerCase() == 'post') {
            const body = await res.json();
            return body.game.id;
        }
    }

    async fetchInfo(url: string, header: any) {
        let res = await fetch(url, {
            headers: header
        });

        if (!res.ok) throw new Error("Invalid token");

        if (res.status == 401) {
            this.authentification();
        } else {
            const body = await res.json();
            return body;
        }
    }

}