import * as storageHelper from "./helper/storagehelper.js";

export const getAdmindata = async context => {
    const admindata = storageHelper.getAdmindata();
    return context.string(admindata, 200);
};

export const setAdmindata = async context => {
    const admindata = await context.body;
    storageHelper.storeAdmindata(admindata);
    
    return context.string("Admindata successfully stored.", 201);
};
