import { Application } from "https://deno.land/x/abc@v1.2.0/mod.ts";
import { requireAuthorization } from "./controller/helper/authorizationhelper.js";
import * as statusController from "./controller/statuscontroller.js";
import * as usersController from "./controller/userscontroller.js";

const server = new Application();
const port = parseInt(Deno.args[0]);
const apiPrefix = "/api";

// Serve static files
server.static("/", "./public");

// Route requests
server
    .get("/", context => context.file("./public/index.html"))
    .get(apiPrefix + "/status", statusController.getStatus)
    .get(apiPrefix + "/users", usersController.getUsers, requireAuthorization)
    .get(apiPrefix + "/users/:oid", usersController.getUser, requireAuthorization)
    .get(apiPrefix + "/users/me", usersController.getMe, requireAuthorization)
    .post(apiPrefix + "/users/initialize", usersController.initializeUser)
    .put(apiPrefix + "/users/:oid", usersController.setUser, requireAuthorization)
    .delete(apiPrefix + "/users/:oid", usersController.deleteUser, requireAuthorization);

// Start server
server.start({ port });
console.log("OpenEDC Server started successfully.");
