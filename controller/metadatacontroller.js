export const setMetadata = async context => {
    const metadata = await context.body;

    console.log(metadata);

    return context.string("Metadata successfully stored.", 201);
};
