import { lastUpdate } from "../statuscontroller.js";

// Must match the fileNameSeparator defined in the webapp (defined in the webapp since it must work offline as well)
const fileNameSeparator = "__";

export let directories;

export const init = instance => {
    // Set file storage directories
    const root = instance ? "./data_" + instance : "./data";
    directories = {
        ROOT: root + "/",
        METADATA: root + "/metadata/",
        ADMINDATA: root + "/admindata/",
        CLINICALDATA: root + "/clinicaldata/",
        MISC: root + "/misc/",
        ARCHIVE: root + "/archive/"
    }

    // Ensures that all directories exist
    Array.from(Object.values(directories)).forEach(directory => {
        try {
            Deno.mkdirSync(directory);
        } catch {}
    });

    // Get the last updated date for metadata, admindata, and clinicaldata
    lastUpdate.metadata = getFileNamesOfDirectory(directories.METADATA).reduce((lastUpdated, fileName) => {
        const modifiedDate = getMetadataModifiedFromFileName(fileName);
        return modifiedDate > lastUpdated ? modifiedDate : lastUpdated;
    }, 0);
    lastUpdate.admindata = getFileNamesOfDirectory(directories.ADMINDATA).reduce((lastUpdated, fileName) => {
        const modifiedDate = getAdmindataModifiedFromFileName(fileName);
        return modifiedDate > lastUpdated ? modifiedDate : lastUpdated;
    }, 0);
    lastUpdate.clinicaldata = getFileNamesOfDirectory(directories.CLINICALDATA).reduce((lastUpdated, fileName) => {
        const modifiedDate = getClinicaldataModifiedFromFileName(fileName);
        return modifiedDate > lastUpdated ? modifiedDate : lastUpdated;
    }, 0);
}

export const storeJSON = (directory, fileName, data) => {
    Deno.writeTextFileSync(directory + fileName, JSON.stringify(data, null, 2));
}

export const loadJSON = (directory, fileName) => {
    try {
        return JSON.parse(Deno.readTextFileSync(directory + fileName));
    } catch {}
}

export const storeXML = (directory, fileName, data) => {
    Deno.writeTextFileSync(directory + fileName, data);
}

export const loadXML = (directory, fileName) => {
    return Deno.readTextFileSync(directory + fileName);
}

export const removeFile = (directory, fileName) => {
    try {
        Deno.renameSync(directory + fileName, directories.ARCHIVE + fileName);
    } catch {}
}

export const fileExist = (directory, fileName) => {
    try {
        return Deno.readTextFileSync(directory + fileName) ? true : false;
    } catch {}
}

export function getFileNamesOfDirectory(directory) {
    const fileNames = [];
    for (const file of Deno.readDirSync(directory)) {
        fileNames.push(file.name);
    }

    return fileNames;
}

export function getMetadataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return parseInt(fileNameParts[1]) || null;
}

export function getAdmindataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return parseInt(fileNameParts[1]) || null;
}

export function getClinicaldataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return parseInt(fileNameParts[3]) || null;
}
