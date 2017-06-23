import { createQuery } from 'meteor/cultofcoders:grapher';

const extractQuery = (config) => {
    if (_.isString(config)) {
        return createQuery({
            [config]: { },
        });
    } else if (_.isArray(config)) {
        // [query|queryName, params?]
        return extractQuery(config[0]);
    } else if (config.constructor && config.setParams) {
        // assume this is a query instance
        return config;
    } else if (_.isObject(config)) {
        // {
        //  params,
        //  single,
        // }
        return extractQuery(config.query);
    } else {
        throw new Error('Could not extract query from: ', config);
    }
};

export default extractQuery;
