import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

export default (queries, getProps, Component) => (
    createContainer((props) => {
        const queryData = {};
        const queryHandles = [];
        const queryProps = {};

        for (const config of queries) {
            const {
                dataProp,
                query,
                queryProp,
                transform,
            } = config;

            const params = config.params(props);
            if (Object.keys(params).length > 0) {
                query.setParams(params);
            }

            queryHandles.push(query.subscribe());

            const rawData = config.single
                ? _.first(query.fetch())
                : query.fetch();

            queryData[dataProp] = transform(rawData);

            if (_.isString(queryProp)) {
                queryProps[queryProp] = query;
            }
        }

        return {
            loading: _.some(queryHandles, handle => !handle.ready()),
            ...queryProps,
            ...queryData,
            ...getProps(),
            ...props,
        };
    }, Component)
);

