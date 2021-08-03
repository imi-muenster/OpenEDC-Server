import { Status } from "../models/statusmodel.js";
import { Update } from "../models/updatemodel.js";
import { users } from "./userscontroller.js";
import { lastUpdate as lastUpdateMetadata } from "./clinicaldatacontroller.js";
import { lastUpdate as lastUpdateAdmindata } from "./clinicaldatacontroller.js";
import { lastUpdate as lastUpdateClinicaldata } from "./clinicaldatacontroller.js";

const serverVersion = "0.2.1";

export const getStatus = context => {
    const isInitialized = users.length > 0;
    const status = new Status(serverVersion, isInitialized);
    
    return context.json(status, 200);
};

export const getLastUpdate = context => {
    const lastUpdate = new Update(lastUpdateMetadata, lastUpdateAdmindata, lastUpdateClinicaldata);

    return context.json(lastUpdate, 200);
}
