import parseParamsObject from './parseParamsObject';

const noop = () => ({ });

const extractParams = (config) => {
    if (_.isArray(config)) {
        if (config.length > 1) {
            return extractParams({ params: config[1] });
        }
    } else if (_.isObject(config) && config.params) {
        if (_.isFunction(config.params)) {
            return (props) => config.params(props);
        } else {
            return () => parseParamsObject(config.params);
        }
    }

    return noop;
};

export default extractParams;
