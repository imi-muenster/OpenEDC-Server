import * as storageHelper from "./helper/storagehelper.js";
import { lastUpdate } from "./statuscontroller.js";

export const getMetadata = async context => {
    const fileName = context.params.fileName;

    const metadata = storageHelper.loadXML(storageHelper.directories.METADATA, fileName);
    return context.string(metadata, 200);
};

export const setMetadata = async context => {
    const fileName = context.params.fileName;

    // Metadata with the exact same modified date cannot be overwritten
    if (storageHelper.fileExist(fileName)) return context.string("Metadata instance already exists.", 400);

    const metadata = await context.body;
    storageHelper.storeXML(storageHelper.directories.METADATA, fileName, metadata);
    lastUpdate.metadata = storageHelper.getMetadataModifiedFromFileName(fileName);
    return context.string("Metadata successfully stored.", 201);
};

export const deleteMetadata = async context => {
    const fileName = context.params.fileName;

    storageHelper.removeFile(storageHelper.directories.METADATA, fileName);
    return context.string("Metadata successfully deleted.", 201);
};
