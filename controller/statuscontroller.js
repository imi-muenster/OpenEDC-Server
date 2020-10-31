import { users } from "./userscontroller.js";

class Status {
    constructor(serverVersion, initialized) {
        this.serverVersion = serverVersion;
        this.initialized = initialized;
    }
}

// TODO: Move to other location
const serverVersion = "1.0";

export const getStatus = context => {
    const isInitialized = users.length > 0;
    const status = new Status(serverVersion, isInitialized);
    
    return context.json(status);
};
