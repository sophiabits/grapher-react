import { _ } from 'meteor/underscore';

export default (query, type) => {
    if (type === 'count') {
        return query.getCount();
    } else if (type === 'single') {
        return _.first(query.fetch());
    }

    return query.fetch();
};