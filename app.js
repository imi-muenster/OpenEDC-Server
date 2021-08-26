import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { cors } from "https://deno.land/x/abc@v1.3.3/middleware/cors.ts";
import { requireAuthorization } from "./controller/helper/authorizationhelper.js";
import * as storageHelper from "./controller/helper/storagehelper.js";
import * as statusController from "./controller/statuscontroller.js";
import * as usersController from "./controller/userscontroller.js";
import * as metadataController from "./controller/metadatacontroller.js";
import * as admindataController from "./controller/admindatacontroller.js";
import * as clinicaldataController from "./controller/clinicaldatacontroller.js";
import * as jsonController from "./controller/jsoncontroller.js";

const server = new Application();
const port = parseInt(Deno.args[0]);
const apiPrefix = "/api";

// Enable CORS
const corsConfig = {
    allowOrigins: ["*"],
    allowMethods: ["GET", "PUT", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"]
  };
server.use(cors(corsConfig));

// Serve static files
server.static("/", "./public");

// Route requests
server
    .get("/", context => context.file("./public/index.html"))
    .get(apiPrefix + "/status", statusController.getStatus)
    .get(apiPrefix + "/lastupdate", statusController.getLastUpdate, requireAuthorization)
    .get(apiPrefix + "/users", usersController.getUsers, requireAuthorization)
    .get(apiPrefix + "/users/:oid", usersController.getUser, requireAuthorization)
    .get(apiPrefix + "/users/rights", usersController.getRights)
    .get(apiPrefix + "/users/me", usersController.getMe, requireAuthorization)
    .put(apiPrefix + "/users/me", usersController.setMe, requireAuthorization)
    .put(apiPrefix + "/users/initialize/:oid", usersController.initializeUser)
    .put(apiPrefix + "/users/:oid", usersController.setUser, requireAuthorization)
    .delete(apiPrefix + "/users/:oid", usersController.deleteUser, requireAuthorization)
    .get(apiPrefix + "/metadata/:fileName", metadataController.getMetadata, requireAuthorization)
    .put(apiPrefix + "/metadata/:fileName", metadataController.setMetadata, requireAuthorization)
    .delete(apiPrefix + "/metadata/:fileName", metadataController.deleteMetadata, requireAuthorization)
    .get(apiPrefix + "/admindata/:fileName", admindataController.getAdmindata, requireAuthorization)
    .put(apiPrefix + "/admindata/:fileName", admindataController.setAdmindata, requireAuthorization)
    .delete(apiPrefix + "/admindata/:fileName", admindataController.deleteAdmindata, requireAuthorization)
    .get(apiPrefix + "/clinicaldata", clinicaldataController.getSubjects, requireAuthorization)
    .get(apiPrefix + "/clinicaldata/:fileName", clinicaldataController.getClinicaldata, requireAuthorization)
    .put(apiPrefix + "/clinicaldata/:fileName", clinicaldataController.setClinicaldata, requireAuthorization)
    .delete(apiPrefix + "/clinicaldata/:fileName", clinicaldataController.deleteClinicaldata, requireAuthorization)
    .get(apiPrefix + "/json/:fileName", jsonController.getJSON, requireAuthorization)
    .put(apiPrefix + "/json/:fileName", jsonController.setJSON, requireAuthorization)
    .delete(apiPrefix + "/json/:fileName", jsonController.deleteJSON, requireAuthorization);

// Initialize storage
const instance = Deno.args.length > 1 ? Deno.args[1] : null;
storageHelper.init(instance);

// Initialize users
usersController.init();

// Start server
server.start({ port });
console.log("OpenEDC Server started successfully.");
