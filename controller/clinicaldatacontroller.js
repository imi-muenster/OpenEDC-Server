import * as storageHelper from "./helper/storagehelper.js";

export const getSubjects = (context, user) => {
   // TODO: Filter by user site

   return context.json(storageHelper.getClinicaldataFileNames(), 200);
}

// TODO: Naming -- clinicaldata or subjectdata?
export const getClinicaldata = async context => {
    const fileName = context.params.fileName;
    const clinicaldata = storageHelper.getClinicaldata(fileName);

    return context.string(clinicaldata, 200);
};

export const setClinicaldata = async context => {
    const fileName = context.params.fileName;
    const clinicaldata = await context.body;
    storageHelper.storeClinicaldata(fileName, clinicaldata);

    return context.string("Metadata successfully stored.", 201);
};

export const deleteClinicaldata = async context => {
    const fileName = context.params.fileName;
    storageHelper.removeClinicaldata(fileName);

    return context.string("Clinicaldata successfully deleted.");
};
