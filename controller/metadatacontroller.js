import * as storageHelper from "./helper/storagehelper.js";

export const getMetadata = async context => {
    const metadata = storageHelper.getMetadata();
    return context.string(metadata, 200);
};

export const setMetadata = async context => {
    storageHelper.storeMetadata(await context.body);
    return context.string("Metadata successfully stored.", 201);
};
