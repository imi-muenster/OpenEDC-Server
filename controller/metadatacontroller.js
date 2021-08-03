import * as storageHelper from "./helper/storagehelper.js";

// Keep last update to be fetched from the client
export let lastUpdate;

// Must match the fileNameSeparator defined in the webapp (defined in the webapp since it must work offline as well)
const fileNameSeparator = "__";

export const getMetadata = async context => {
    const fileName = context.params.fileName;

    const metadata = storageHelper.getMetadata(fileName);
    return context.string(metadata, 200);
};

export const setMetadata = async context => {
    const fileName = context.params.fileName;

    // Metadata with the exact same modified date cannot be overwritten
    if (storageHelper.getMetadata(fileName)) return context.string("Metadata instance already exists.", 400);

    const metadata = await context.body;
    storageHelper.storeMetadata(fileName, metadata);
    lastUpdate = getMetadataModifiedFromFileName(fileName);
    return context.string("Metadata successfully stored.", 201);
};

export const deleteMetadata = async context => {
    const fileName = context.params.fileName;

    storageHelper.removeMetadata(fileName);
    return context.string("Metadata successfully deleted.", 201);
};

function getMetadataModifiedFromFileName(fileName) {
    const fileNameParts = fileName.split(fileNameSeparator);
    return fileNameParts[1] || null;
}
