export const enableCORS = next => context => {
    context.response.headers.set("Access-Control-Allow-Origin", "*");
    return next(context);
};
