import { User } from "../../models/usermodel.js";
import { lastUpdate } from "../statuscontroller.js";

// Must match the fileNameSeparator defined in the webapp (defined in the webapp since it must work offline as well)
const fileNameSeparator = "__";

const fileNames = {
    users: "users",
    settings: "settings"
}

let directories;

export const init = instance => {
    // Set file storage directories
    const root = instance ? "./data_" + instance : "./data";
    directories = {
        userdata: root + "/",
        metadata: root + "/metadata/",
        admindata: root + "/admindata/",
        clinicaldata: root + "/clinicaldata/",
        archive: root + "/archive/"
    }

    // Ensures that all directories exist
    Array.from(Object.values(directories)).forEach(directory => {
        try {
            Deno.mkdirSync(directory);
        } catch {}
    });

    // Get the last updated date for metadata, admindata, and clinicaldata
    lastUpdate.metadata = getFileNamesOfDirectory(directories.metadata).reduce((lastUpdated, fileName) => {
        const modifiedDate = getMetadataModifiedFromFileName(fileName);
        modifiedDate > lastUpdated ? modifiedDate : lastUpdated;
    }, 0);
    lastUpdate.admindata = getFileNamesOfDirectory(directories.admindata).reduce((lastUpdated, fileName) => {
        const modifiedDate = getAdmindataModifiedFromFileName(fileName);
        modifiedDate > lastUpdated ? modifiedDate : lastUpdated;
    }, 0);
    lastUpdate.clinicaldata = getFileNamesOfDirectory(directories.clinicaldata).reduce((lastUpdated, fileName) => {
        const modifiedDate = getSubjectModifiedFromFileName(fileName);
        modifiedDate > lastUpdated ? modifiedDate : lastUpdated;
    }, 0);
}

const storeJSON = (fileName, data) => {
    Deno.writeTextFileSync(fileName, JSON.stringify(data, null, 2));
}

const loadJSON = fileName => {
    return JSON.parse(Deno.readTextFileSync(fileName));
}

const storeXML = (fileName, data) => {
    Deno.writeTextFileSync(fileName, data);
}

const loadXML = fileName => {
    try {
        return Deno.readTextFileSync(fileName);
    } catch {}
}

export const storeUsers = users => {
    storeJSON(directories.userdata + fileNames.users, users);
}

export const getUsers = () => {
    let users = [];

    try {
        const usersJSON = loadJSON(directories.userdata + fileNames.users);
        for (const userJSON of usersJSON) {
            users.push(new User(
                userJSON.oid,
                userJSON.username,
                userJSON.authenticationKey,
                userJSON.hasInitialPassword,
                userJSON.encryptedDecryptionKey,
                userJSON.rights,
                userJSON.site
            ));
        }
    } catch {}

    return users;
}

export const storeMetadata = (fileName, metadata) => {
    storeXML(directories.metadata + fileName, metadata);
    lastUpdate.metadata = getMetadataModifiedFromFileName(fileName);
}

export const getMetadata = fileName => {
    return loadXML(directories.metadata + fileName);
}

export const removeMetadata = fileName => {
    try {
        Deno.renameSync(directories.metadata + fileName, directories.archive + fileName);
    } catch {}
}

export const storeAdmindata = (fileName, admindata) => {
    storeXML(directories.admindata + fileName, admindata);
    lastUpdate.admindata = getAdmindataModifiedFromFileName(fileName);
}

export const getAdmindata = fileName => {
    return loadXML(directories.admindata + fileName);
}

export const removeAdmindata = fileName => {
    try {
        Deno.renameSync(directories.admindata + fileName, directories.archive + fileName);
    } catch {}
}

export const storeClinicaldata = (fileName, clinicaldata) => {
    storeXML(directories.clinicaldata + fileName, clinicaldata);
    lastUpdate.clinicaldata = getSubjectModifiedFromFileName(fileName);
}

export const getClinicaldata = fileName => {
    return loadXML(directories.clinicaldata + fileName);
}

export const getClinicaldataFileNames = () => {
    return getFileNamesOfDirectory(directories.clinicaldata);
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
    } catch {}
}

function getFileNamesOfDirectory(directory) {
    const fileNames = [];
    for (const file of Deno.readDirSync(directory)) {
        fileNames.push(file.name);
    }

    return fileNames;
}

function getMetadataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return parseInt(fileNameParts[1]) || null;
}

function getAdmindataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return parseInt(fileNameParts[1]) || null;
}

function getSubjectModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return parseInt(fileNameParts[3]) || null;
}
