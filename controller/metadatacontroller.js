import * as storageHelper from "./helper/storagehelper.js";

export const getMetadata = async context => {
    const fileName = context.params.fileName;

    const metadata = storageHelper.getMetadata(fileName);
    return context.string(metadata, 200);
};

export const setMetadata = async context => {
    const fileName = context.params.fileName;

    // Metadata with the exact same modified date cannot be overwritten
    if (storageHelper.fileExist(fileName)) return context.string("Metadata instance already exists.", 400);

    const metadata = await context.body;
    storageHelper.storeMetadata(fileName, metadata);
    return context.string("Metadata successfully stored.", 201);
};

export const deleteMetadata = async context => {
    const fileName = context.params.fileName;

    storageHelper.removeMetadata(fileName);
    return context.string("Metadata successfully deleted.", 201);
};
