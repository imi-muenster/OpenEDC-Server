import * as storageHelper from "./helper/storagehelper.js";

export const getSubjects = context => {
   return context.json(storageHelper.getClinicaldataFileNames(), 200);
}

export const getClinicaldata = async (context, user) => {
    const fileName = context.params.fileName.replaceAll("%20", " ");

    if (user.site && user.site != getSubjectSiteFromFileName(fileName)) {
        return context.string("You are not allowed to get clinical data from a subject that is assigned to another site than you.", 403);
    }

    const clinicaldata = storageHelper.getClinicaldata(fileName);
    return context.string(clinicaldata, 200);
};

export const setClinicaldata = async (context, user) => {
    const fileName = context.params.fileName.replaceAll("%20", " ");

    if (user.site && user.site != getSubjectSiteFromFileName(fileName)) {
        return context.string("You are not allowed to set clinical data for a subject that is assigned to another site than you.", 403);
    }

    const clinicaldata = await context.body;
    storageHelper.storeClinicaldata(fileName, clinicaldata);
    return context.string("Clinicaldata successfully stored.", 201);
};

export const deleteClinicaldata = async context => {
    const fileName = context.params.fileName.replaceAll("%20", " ");
    storageHelper.removeClinicaldata(fileName);

    return context.string("Clinicaldata successfully deleted.", 200);
};

function getSubjectSiteFromFileName(fileName) {
    // Must match the fileNameSeparator defined in the webapp (defined in the webapp since it must work offline as well)
    const fileNameSeparator = "__";

    const fileNameParts = fileName.split(fileNameSeparator);
    return fileNameParts[1] || null;
}
