import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

import extractParams from './detail/extractParams';
import extractQuery from './detail/extractQuery';

import createReactiveContainer from './factories/reactiveContainer';
import createStaticContainer from './factories/staticContainer';

/**
 * @typedef  {Object}   IContainerOptions
 * @property {Array|Object.<string, IQueryConfig>|String} data
 * @property {Function} [props]
 * @property {Boolean}  [reactive=true]
 */

/**
 * @typedef {Object} IQueryConfig
 * @property {IParamsGetter|Object|Array} [params]  A function or object which generates the query's parameters
 * @property {String}          [prop]               If supplied, the query instance used will be passed to the component as this prop
 * @property {Object|String}   query                Either a query instance, or the name of a named query
 * @property {Boolean}         [single=false]       If true, only the first record returned by the query will be passed to the component
 * @property {function(Object|Array):*} [transform] Takes the data retrieved by the query as a parameter. The component will be passed the return value of this function (defaults to _.identity)
 */

/**
 * @callback IParamsGetter
 * @param {Object} props   The props passed to the container
 */

/**
 * @param {IContainerOptions}           options
 * @param {React.Component|Function}    Component   React component to wrap
 */
const createQueryContainer = (options, Component) => {
    options = options || { };
    _.defaults(options, {
        props: () => undefined,
        reactive: true,
    });

    if (!options.data) {
        throw new Error('createQueryContainer: options must have a data key');
    }

    const queries = [];

    // Handle shorthand queries
    const data = _.isObject(options.data)
        ? options.data
        : { data: options.data };

    // normalize configuration
    for (const prop of Object.keys(data)) {
        const config = data[prop];

        queries.push({
            dataProp: prop,
            params: extractParams(config),
            single: config.single || false,
            query: extractQuery(config),
            queryProp: config.prop || null,
            transform: config.transform || _.identity,
        });
    }

    if (options.reactive) {
        return createReactiveContainer(queries, options.props, Component);
    } else {
        return createStaticContainer(queries, options.props, Component);
    }
};

export default createQueryContainer;
