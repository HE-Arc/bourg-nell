import fetch from "node-fetch";
import CONFIG from "../config";

/**
 * @class NetworkManager
 * A singleton that permit the gestion of network connection on the server
 */
export class NetworkManager {

    private static instance: NetworkManager;
    private token = "";

    static getInstance() {
        if (!NetworkManager.instance)
            NetworkManager.instance = new NetworkManager();
        
        return NetworkManager.instance;
    }

    async checkToken()
    {
        if(!this.token)
        {
            await this.authentification();
        }
    }

    /**
     * @function authentification
     * @returns gameserver's token
     * Connect the server to the database.
     */
    async authentification() {
        const response = await fetch(CONFIG.api +'login', {
            method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": CONFIG.email,
                    "password": CONFIG.password
                }),
        });
        if(!response.ok) throw Error("Invalid Credentials");
        const body = await response.json();
        return body.token;
    }

    /**
     * @function updateDatas
     * @param url the route you want to fetch
     * @param methodType the type of method (get, post, patch, ..)
     * @param body the body you need to send, please be sure that the body is a Json
     * update datas in database, if the response is 401, recreate the gameserver token
     */
    async updateDatas(url: string, methodType: string,  body: object) {
        await this.checkToken();
        const res = await fetch(url, {
            method: methodType,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
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
        await this.checkToken();
        let res = await fetch(url, {
            headers: header
        });

        if (!res.ok) throw new Error("Invalid token");

        if (res.status == 401) {
            this.authentification();
        } else {
            const body = await res.json();
            return body.me;
        }
    }

}