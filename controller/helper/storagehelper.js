import { User } from "../../models/usermodel.js";

const directories = {
    userdata: "./data/",
    metadata: "./data/metadata/",
    admindata: "./data/admindata/",
    clinicaldata: "./data/clinicaldata/",
}

const usersFileName = "users";

// TODO: Will probably be replaced by an fileName parameter such as for clinicaldata to be able to store versioned meta- and admindata
const metadataFileName = "metadata";
const admindataFileName = "admindata";

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
    storeJSON(directories.userdata + usersFileName, users);
}

export const getUsers = () => {
    const users = loadJSON(directories.userdata + usersFileName);
    
    // TODO: Transform into user class instances

    return users ? users : [];
}

export const storeMetadata = metadata => {
    storeXML(directories.metadata + metadataFileName, metadata);
}

export const getMetadata = () => {
    return loadXML(directories.metadata + metadataFileName);
}

export const storeAdmindata = admindata => {
    storeXML(directories.admindata + admindataFileName, admindata);
}

export const getAdmindata = () => {
    return loadXML(directories.admindata + admindataFileName);
}

export const storeClinicaldata = (fileName, clinicaldata) => {
    storeXML(directories.clinicaldata + fileName, clinicaldata);
}

export const getClinicaldata = fileName => {
    return loadXML(directories.clinicaldata + fileName);
}

// TODO: Naming -- __getSubjectFileNames?__ or getSubjectdataFileName? getSubjectDataFileName? Would be consistent with app's iohelper
export const getClinicaldataFileNames = () => {
    const clinicaldataFileNames = [];
    for (const file of Deno.readDirSync(directories.clinicaldata)) {
        clinicaldataFileNames.push(file.name);
    }

    return clinicaldataFileNames;
}

export const removeClinicaldata = fileName => {
    Deno.removeSync(directories.clinicaldata + fileName);
}
