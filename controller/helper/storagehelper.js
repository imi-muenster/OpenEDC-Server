const directory = "./data/";
const usersFileName = "users";
const metadataFileName = "metadata";
const admindataFileName = "admindata";

const ensureDirectoryExists = () => {
    // TODO: Might be improved by using the Deno fs standard module
    try {
        Deno.mkdirSync(directory);
    } catch {}
}

const storeJSON = (fileName, data) => {
    ensureDirectoryExists();
    Deno.writeTextFileSync(directory + fileName, JSON.stringify(data));
}

const loadJSON = fileName => {
    return JSON.parse(Deno.readTextFileSync(directory + fileName));
}

const storeXML = (fileName, data) => {
    ensureDirectoryExists();
    Deno.writeTextFileSync(directory + fileName, data);
}

const loadXML = fileName => {
    return Deno.readTextFileSync(directory + fileName);
}

export const storeUsers = users => {
    storeJSON(usersFileName, users);
}

export const getUsers = () => {
    const users = loadJSON(usersFileName);
    return users ? users : [];
}

export const storeMetadata = metadata => {
    storeXML(metadataFileName, metadata);
}

export const getMetadata = () => {
    return loadXML(metadataFileName);
}

export const storeAdmindata = admindata => {
    storeXML(admindataFileName, admindata);
}

export const getAdmindata = () => {
    return loadXML(admindataFileName);
}
