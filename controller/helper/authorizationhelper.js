import { users } from "../userscontroller.js";

// Must match the userRights defined in the webapp (defined in the webapp since it must work offline as well)
export const rights = {
    PROJECTOPTIONS: "project-options",
    EDITMETADATA: "edit-metadata",
    MANAGESUBJECTS: "manage-subjects",
    VALIDATEFORMS: "validate-forms",
    ADDSUBJECTDATA: "add-subject-data"
};

export const requireAuthorization = next => context => {
    const authentication = context.request.headers.get("Authorization");
    if (!authentication || !authentication.split(" ")[0] == "Basic") return noAuthentication(context);

    const basicAuthParts = atob(authentication.split(" ")[1]).split(":");
    const username = basicAuthParts[0];
    const authenticationKey = basicAuthParts[1];

    const user = users.find(user => user.username.toLowerCase() == username.toLowerCase());
    if (!user || user.authenticationKey != authenticationKey) return badAuthentication(context);

    switch (next.name) {
        case "getUsers":
        case "getUser":
        case "setUser":
        case "deleteUser":
        case "setAdmindata":
        case "deleteAdmindata":
        case "setSettings":
            if (!user.hasAuthorizationFor(rights.PROJECTOPTIONS)) return noAuthorization(context);
            break;
        case "setClinicaldata":
        case "deleteClinicaldata":
            if (!user.hasAuthorizationFor(rights.ADDSUBJECTDATA)) return noAuthorization(context);
            break;
        case "setMetadata":
        case "deleteMetadata":
            if (!user.hasAuthorizationFor(rights.EDITMETADATA)) return noAuthorization(context);
    }

    return next(context, user);
};

const noAuthentication= context => context.string("No authorization header present in the request.", 401);

const badAuthentication = context => context.string("User not found or wrong password entered.", 401);

const noAuthorization = context => context.string("Not authorized for the requested resource.", 403);
