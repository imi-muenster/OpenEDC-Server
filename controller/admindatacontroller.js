import * as storageHelper from "./helper/storagehelper.js";

// Keep last update to be fetched from the client
export let lastUpdate;

// Must match the fileNameSeparator defined in the webapp (defined in the webapp since it must work offline as well)
const fileNameSeparator = "__";

export const getAdmindata = async context => {
    const fileName = context.params.fileName;

    const admindata = storageHelper.getAdmindata(fileName);
    return context.string(admindata, 200);
};

export const setAdmindata = async context => {
    const fileName = context.params.fileName;

    // Admindata with the exact same modified date cannot be overwritten
    if (storageHelper.getAdmindata(fileName)) return context.string("Admindata instance already exists.", 400);

    const admindata = await context.body;
    storageHelper.storeAdmindata(admindata);
    lastUpdate = getAdmindataModifiedFromFileName(fileName);
    return context.string("Admindata successfully stored.", 201);
};

export const deleteAdmindata = async context => {
    const fileName = context.params.fileName;

    storageHelper.removeAdmindata(fileName);
    return context.string("Admindata successfully deleted.", 201);
};

function getAdmindataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return fileNameParts[1] || null;
}
