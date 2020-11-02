export const getMetadata = async context => {
    const metadata = Deno.readTextFileSync("metadata");

    return context.string(metadata, 200);
};

export const setMetadata = async context => {
    const metadata = await context.body;

    // TODO: Where to store the files?
    Deno.writeTextFileSync("metadata", metadata);

    return context.string("Metadata successfully stored.", 201);
};
