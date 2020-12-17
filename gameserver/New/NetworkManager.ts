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

    /**
     * @function checkToken
     * Check if there is a current token, if not, create it
     */
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
        const response = await fetch(CONFIG.api +'users/login', {
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
        return this.token = body.token;
    }

    /**
     * @function updateDatas
     * @param route the route you want to fetch
     * @param methodType the type of method (get, post, patch, ..)
     * @param body the body you need to send, please be sure that the body is a Json
     * update datas in database, if the response is 401, recreate the gameserver token
     */
    async updateDatas(route: string, methodType: string,  body: object) {
        await this.checkToken();
        const res = await fetch(CONFIG.api + route, {
            method: methodType,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body : JSON.stringify(body),
        });

        if (res.status == 401) { // if the status is 401, authentificate the server again
            this.authentification();
        } else if (methodType.toLowerCase() == 'post') {
            const body = await res.json();
            return body.game.id;
        }
    }

    /**
     * @function fetchInfo
     * @param route the route where you need to fetch the informations
     * @param header the header that contain a user token
     * fetch user informations from a send token
     */
    async fetchInfo(route: string, header: any) {
        await this.checkToken();
        let res = await fetch(CONFIG.api + route, {
            headers: header
        });

        if (!res.ok) throw new Error("Invalid token");

        if (res.status == 401) {
            this.authentification();
            console.log("error 401");
        } else {
            const body = await res.json();
            return body;
        }
    }
}