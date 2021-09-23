import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { cors } from "https://deno.land/x/abc@v1.3.3/middleware/cors.ts";

import Endpoint from "./models/endpoint.js";
import { rights } from "./controller/helper/authorizationhelper.js";
import * as storageHelper from "./controller/helper/storagehelper.js";
import * as statusController from "./controller/statuscontroller.js";
import * as usersController from "./controller/userscontroller.js";
import * as metadataController from "./controller/metadatacontroller.js";
import * as admindataController from "./controller/admindatacontroller.js";
import * as clinicaldataController from "./controller/clinicaldatacontroller.js";
import * as jsonController from "./controller/jsoncontroller.js";

const server = new Application();
const port = parseInt(Deno.args[0]);

// Enable CORS
const corsConfig = {
    allowOrigins: ["*"],
    allowMethods: ["GET", "PUT", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"]
  };
server.use(cors(corsConfig));

// Define default request route endpoints
const routes = [
  new Endpoint(Endpoint.methods.GET, "/", context => context.file("./public/index.html"), false),
  new Endpoint(Endpoint.methods.GET, "/status", statusController.getStatus, false),
  new Endpoint(Endpoint.methods.GET, "/lastupdate", statusController.getLastUpdate),
  new Endpoint(Endpoint.methods.GET, "/users", usersController.getUsers, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.GET, "/users/:oid", usersController.getUser, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.GET, "/users/rights", usersController.getRights),
  new Endpoint(Endpoint.methods.GET, "/users/me", usersController.getMe),
  new Endpoint(Endpoint.methods.PUT, "/users/me", usersController.setMe),
  new Endpoint(Endpoint.methods.PUT, "/users/initialize/:oid", usersController.initializeUser, false),
  new Endpoint(Endpoint.methods.PUT, "/users/:oid", usersController.setUser, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.DELETE, "/users/:oid", usersController.deleteUser, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.GET, "/metadata/:fileName", metadataController.getMetadata),
  new Endpoint(Endpoint.methods.PUT, "/metadata/:fileName", metadataController.setMetadata, rights.EDITMETADATA),
  new Endpoint(Endpoint.methods.DELETE, "/metadata/:fileName", metadataController.deleteMetadata, rights.EDITMETADATA),
  new Endpoint(Endpoint.methods.GET, "/admindata/:fileName", admindataController.getAdmindata),
  new Endpoint(Endpoint.methods.PUT, "/admindata/:fileName", admindataController.setAdmindata, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.DELETE, "/admindata/:fileName", admindataController.deleteAdmindata, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.GET, "/clinicaldata", clinicaldataController.getSubjects),
  new Endpoint(Endpoint.methods.GET, "/clinicaldata/:fileName", clinicaldataController.getClinicaldata),
  new Endpoint(Endpoint.methods.PUT, "/clinicaldata/:fileName", clinicaldataController.setClinicaldata, rights.ADDSUBJECTDATA),
  new Endpoint(Endpoint.methods.DELETE, "/clinicaldata/:fileName", clinicaldataController.deleteClinicaldata, rights.ADDSUBJECTDATA),
  new Endpoint(Endpoint.methods.GET, "/json/:fileName", jsonController.getJSON),
  new Endpoint(Endpoint.methods.PUT, "/json/:fileName", jsonController.setJSON, rights.PROJECTOPTIONS),
  new Endpoint(Endpoint.methods.DELETE, "/json/:fileName", jsonController.deleteJSON, rights.PROJECTOPTIONS)
];

// Add requests defined by plugins
// TODO

// Serve static files
server.static("/", "./public");

// Route default and plugin requests
routes.forEach(route => server[route.method](route.path, route.logic, route.middleware));

// Initialize storage
const instance = Deno.args.length > 1 ? Deno.args[1] : null;
storageHelper.init(instance);

// Initialize users
usersController.init();

// Start server
server.start({ port });
console.log("OpenEDC Server started successfully.");
