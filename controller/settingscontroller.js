import * as storageHelper from "./helper/storagehelper.js";

export const getSettings = async context => {
    const settings = storageHelper.getSettings();

    if (settings) {
        return context.json(settings, 200);
    } else {
        return context.string("Settings have not yet been stored.", 204);
    }
};

export const setSettings = async context => {
    const settings = await context.body;
    storageHelper.storeSettings(settings);

    return context.string("Settings successfully stored.", 201);
};
