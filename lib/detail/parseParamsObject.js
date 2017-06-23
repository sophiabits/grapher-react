export default (params) => {
    const newParams = {};
    for (const param of Object.keys(params)) {
        const value = params[param];
        if (_.isFunction(value)) {
            newParams[param] = value();
        } else {
            newParams[param] = value;
        }
    }

    return newParams;
};
