import { User } from "../../models/usermodel.js";

const directories = {
    userdata: "./data/",
    metadata: "./data/metadata/",
    admindata: "./data/admindata/",
    clinicaldata: "./data/clinicaldata/",
    clinicaldataArchive: "./data/clinicaldata-archive/"
}

const fileNames = {
    users: "users",
    settings: "settings",
    metadata: "metadata",
    admindata: "admindata"
}

// Ensures that all directories exist
Array.from(Object.values(directories)).forEach(directory => {
    try {
        Deno.mkdirSync(directory);
    } catch {}
});

const storeJSON = (fileName, data) => {
    Deno.writeTextFileSync(fileName, JSON.stringify(data));
}

const loadJSON = fileName => {
    return JSON.parse(Deno.readTextFileSync(fileName));
}

const storeXML = (fileName, data) => {
    Deno.writeTextFileSync(fileName, data);
}

const loadXML = fileName => {
    return Deno.readTextFileSync(fileName);
}

export const storeUsers = users => {
    storeJSON(directories.userdata + fileNames.users, users);
}

export const getUsers = () => {
    let users = [];

    try {
        const usersJSON = loadJSON(directories.userdata + fileNames.users);
        for (let userJSON of usersJSON) {
            users.push(new User(
                userJSON.oid,
                userJSON.username,
                userJSON.hashedPassword,
                userJSON.hasInitialPassword,
                userJSON.encryptedDecryptionKey,
                userJSON.rights,
                userJSON.site
            ));
        }
    } catch {}

    return users;
}

export const storeMetadata = metadata => {
    storeXML(directories.metadata + fileNames.metadata, metadata);
}

export const getMetadata = () => {
    return loadXML(directories.metadata + fileNames.metadata);
}

export const storeAdmindata = admindata => {
    storeXML(directories.admindata + fileNames.admindata, admindata);
}

export const getAdmindata = () => {
    return loadXML(directories.admindata + fileNames.admindata);
}

export const storeClinicaldata = (fileName, clinicaldata) => {
    storeXML(directories.clinicaldata + fileName, clinicaldata);
}

export const getClinicaldata = fileName => {
    return loadXML(directories.clinicaldata + fileName);
}

export const getClinicaldataFileNames = () => {
    const clinicaldataFileNames = [];
    for (const file of Deno.readDirSync(directories.clinicaldata)) {
        clinicaldataFileNames.push(file.name);
    }

    return clinicaldataFileNames;
}

export const removeClinicaldata = fileName => {
    try {
        Deno.renameSync(directories.clinicaldata + fileName, directories.clinicaldataArchive + fileName);
    } catch {}
}

export const storeSettings = settings => {
    storeJSON(directories.userdata + fileNames.settings, settings);
}

export const getSettings = () => {
    try {
        return loadJSON(directories.userdata + fileNames.settings);
    } catch {
        return null;
    }
}
