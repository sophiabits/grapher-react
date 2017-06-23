import React from 'react';

export default (queries, getProps, Component) => {
    class MethodQueryComponent extends React.Component {
        constructor() {
            super();

            this.state = {
                data: {},
                queries: {},
                pendingQueries: queries.length,
            };
        }

        componentDidMount() {
            this._fetchQueries();
        }

        _fetchQueries() {
            for (const config of queries) {
                const {
                    dataProp,
                    query,
                    queryProp,
                    transform,
                } = config;

                const params = config.params(this.props);
                if (Object.keys(params).length > 0) {
                    query.setParams(params);
                }

                query.fetch((error, result) => {
                    const data = config.single
                        ? transform(_.first(result))
                        : transform(result);

                    this.setState((state) => {
                        const partialState = {
                            data: {
                                [dataProp]: data,
                            },
                            pendingQueries: state.pendingQueries - 1
                        };

                        if (queryProp) {
                            partialState.queries[queryProp] = query;
                        }

                        return partialState;
                    });
                });
            }
        }

        render() {
            const props = {
                loading: this.state.pendingQueries !== 0,
                ...this.state.queries,
                ...this.state.data,
                ...getProps(),
                ...this.props,
            };

            return React.createElement(Component, props);
        }
    }

    return MethodQueryComponent;
};
