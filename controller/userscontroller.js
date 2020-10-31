import { rights } from "./helper/authorizationhelper.js";

export class User {
    constructor(oid, username, password, hasInitialPassword, encryptedDecryptionKey, rights, site) {
        this.oid = oid;
        this.username = username;
        this.password = password;
        this.hasInitialPassword = hasInitialPassword;
        this.encryptedDecryptionKey = encryptedDecryptionKey;
        this.rights = rights;
        this.site = site;
    }
}

const ownerOID = 1;

export let users = [];

export const getUsers = context => {
    return context.json(users);
};

export const getUser = context => {
    const oid = context.params.oid;

    const user = users.find(user => user.oid == oid);
    if (!user) return context.string("User could not be found.", 404);

    return context.json(user);
};

export const getMe = (context, user) => {
    return context.json(user);
}

export const initializeUser = async context => {
    if (users.length > 0) return context.string("The server has already been initialized.", 400);

    const { username, password, encryptedDecryptionKey } = await context.body;
    
    if (!username) return context.string("Username is missing in the request body.", 400);
    if (!password) return context.string("Password is missing in the request body.", 400);
    if (!encryptedDecryptionKey) return context.string("An encrypted decryption key is missing in the request body.", 400);

    const user = new User(ownerOID, username, password, false, encryptedDecryptionKey, [
        rights.PROJECTOPTIONS,
        rights.EDITMETADATA,
        rights.ADDSUBJECTS,
        rights.MANAGESUBJECTS
    ]);
    users.push(user);
    // TODO: Store users array

    return context.json(user, 201);
};

// TODO: setUserCredentials and setUserRights are required instead as well as a setOwnPassword
export const setUser = async context => {
    const oid = context.params.oid;
    const { username, password, rights, site, encryptedDecryptionKey } = await context.body;
    
    if (!username) return context.string("Username is missing in the request body.", 400);
    if (!password) return context.string("Password is missing in the request body.", 400);
    if (!encryptedDecryptionKey) return context.string("An encrypted decryption key is missing in the request body.", 400);
    if (!Array.isArray(rights) || rights.length == 0) return context.string("User rights are missing in the request body.", 400);

    // Test if the username is already occupied
    const existingUser = users.find(user => user.username == username);
    if (existingUser && existingUser.oid != oid) return context.string("There exists another user with the same username.", 400);

    // Remove user if already present
    users = users.filter(user => user.oid != oid);

    const user = new User(oid, username, password, true, encryptedDecryptionKey, rights, site);
    users.push(user);
    // TODO: Store users array

    return context.json(user, 201);
};

export const deleteUser = context => {
    const oid = context.params.oid;

    if (oid == ownerOID) return context.string("The owner of the server cannot be deleted.", 400);

    const user = users.find(user => user.oid == oid);
    if (!user) return context.string("User could not be found.", 404);

    users = users.filter(user => user.oid != oid);
    // TODO: Store users array

    return context.json(user);
};
