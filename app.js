import { Application } from "https://deno.land/x/abc@v1.2.0/mod.ts";
import { cors } from "https://deno.land/x/abc@v1.2.0/middleware/cors.ts";
import { requireAuthorization } from "./controller/helper/authorizationhelper.js";
import * as statusController from "./controller/statuscontroller.js";
import * as usersController from "./controller/userscontroller.js";
import * as metadataController from "./controller/metadatacontroller.js";
import * as admindataController from "./controller/admindatacontroller.js";
import * as clinicaldataController from "./controller/clinicaldatacontroller.js";

const server = new Application();
const port = parseInt(Deno.args[0]);
const apiPrefix = "/api";

// Enable CORS
const corsConfig = {
    allowOrigins: ["*"],
    allowMethods: ["GET, POST, PUT, DELETE"],
    allowHeaders: ["Content-Type, Authorization"]
  };
server.use(cors(corsConfig));

// Serve static files
server.static("/", "./public");

// Route requests
server
    .get("/", context => context.file("./public/index.html"))
    .get(apiPrefix + "/status", statusController.getStatus)
    .get(apiPrefix + "/users", usersController.getUsers, requireAuthorization)
    .get(apiPrefix + "/users/:oid", usersController.getUser, requireAuthorization)
    .get(apiPrefix + "/users/me", usersController.getMe, requireAuthorization)
    .put(apiPrefix + "/users/me", usersController.setMe, requireAuthorization)
    .post(apiPrefix + "/users/initialize", usersController.initializeUser)
    .put(apiPrefix + "/users/:oid", usersController.setUser, requireAuthorization)
    .delete(apiPrefix + "/users/:oid", usersController.deleteUser, requireAuthorization)
    .get(apiPrefix + "/metadata", metadataController.getMetadata, requireAuthorization)
    .put(apiPrefix + "/metadata", metadataController.setMetadata, requireAuthorization)
    .get(apiPrefix + "/admindata", admindataController.getAdmindata, requireAuthorization)
    .put(apiPrefix + "/admindata", admindataController.setAdmindata, requireAuthorization)
    .get(apiPrefix + "/clinicaldata", clinicaldataController.getSubjects, requireAuthorization)
    .get(apiPrefix + "/clinicaldata/:fileName", clinicaldataController.getClinicaldata, requireAuthorization)
    .put(apiPrefix + "/clinicaldata/:fileName", clinicaldataController.setClinicaldata, requireAuthorization);

// Start server
server.start({ port });
console.log("OpenEDC Server started successfully.");
