import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

import fetchQuery from '../detail/fetchQuery';

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

            const isCountQuery = config.type === 'count';
            queryHandles.push(isCountQuery
                ? query.subscribeCount()
                : query.subscribe()
            );

            const rawData = fetchQuery(query, config.type);
            queryData[dataProp] = isCountQuery ? rawData : transform(rawData);

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

