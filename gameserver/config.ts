const confFile: any = require("../config.json");

export const CONFIG = 
{
    email: confFile.server.email || "",
    password: confFile.server.password || "",
    port: confFile.server.port || 3000,
    api: confFile.api || "https://bourgnell.srvz-webapp.he-arc.ch/"
};

export default CONFIG;