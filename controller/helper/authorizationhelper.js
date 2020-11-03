import { users } from "../userscontroller.js";

export const rights = {
    PROJECTOPTIONS: "Project options",
    EDITMETADATA: "Edit metadata",
    ADDSUBJECTDATA: "Add subject data",
    MANAGESUBJECTS: "Manage subjects"
};

export const requireAuthorization = next => context => {
    const authentication = context.request.headers.get("Authorization");
    if (!authentication || !authentication.split(" ")[0] == "Basic") return noAuthentication(context);

    const basicAuthParts = atob(authentication.split(" ")[1]).split(":");
    const username = basicAuthParts[0];
    const hashedPassword = basicAuthParts[1];

    const user = users.find(user => user.username == username);
    if (!user || user.hashedPassword != hashedPassword) return badAuthentication(context);

    // TODO: Maybe replace by function.name;
    switch (next.name) {
        case "getUsers":
        case "getUser":
        case "setUser":
        case "deleteUser":
        case "setAdmindata":
            if (!user.rights || !user.rights.includes(rights.PROJECTOPTIONS)) return noAuthorization(context);
            break;
        case "setMetadata":
            if (!user.rights || !user.rights.includes(rights.EDITMETADATA)) return noAuthorization(context);
            break;
        case "setClinicaldata":
            if (!user.rights || !user.rights.includes(rights.ADDSUBJECTDATA)) return noAuthorization(context);
            break;
    }

    return next(context, user);
};

const noAuthentication= context => context.string("No authorization header present in the request.", 401);

const badAuthentication = context => context.string("User not found or wrong password entered.", 401);

const noAuthorization = context => context.string("Not authorized for the requested resource.", 403);
