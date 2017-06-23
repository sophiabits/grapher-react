aplc:grapher-react
==================

## Installation

In your app's directory:

```
$ meteor add aplc:grapher-react
```

## Usage
### Basic Example

```js
// TaskList.jsx
import React from 'react';
import Tasks from '/imports/api/tasks/collection.js';
import { createQueryContainer } from 'meteor/aplc:grapher-react';

const query = Tasks.createQuery({
    title: 1,
});

const TaskList = ({loading, error, tasks}) => (
  <div>
    {
      _.map(tasks, task => <div key={task._id}>{task.title}</div>)
    }
  </div>
);

export default createQueryContainer(
    {
        data: {
            tasks: {
                query,
                params: { isActive: true },
            }
        }
    },
    TaskList
);
```

### Details

The first parameter passed to `createQueryContainer` should be an options object. The base structure of this is as follows:

```js
{
    data: ...,              // query configuration
    props: () => ({ ... }), // optional, used to provide extra props to the wrapped component
    reactive: true,         // defaults to true
}
```

#### `data` parameter

##### Shorthand

Containers created in this form will pass their data to the 'data' prop on the underlying component.

```js
// /api/tasks/query/tasks.all.js
const query = createNamedQuery('tasks.all', {
    title: 1,
});

if (Meteor.isServer) {
    query.expose();
}

// TaskList.jsx
const TaskList = ({ data, loading }) => {
    // do something with the query data
};

// as a string
export default createQueryContainer(
    { data: 'tasks.all' },
    TaskList
);

// as a query instance
const myQuery = Tasks.createQuery({
    content: 1,
    title: 1,
});

export default createQueryContainer(
    {
        data: myQuery,
    },
    TaskList
);

// alternatively as an array
export default createQueryContainer
    { data: ['tasks.all', { /* params */ }] },
    TaskList
);
```

##### Long form

Alternatively, containers can be created like so:

```js
export default createQueryContainer(
    {
        data: {
            // each key here refers the prop that the query will write to
            tasks: {
                params: {                   // can be either an object or function
                    userId: Meteor.userId,  // function references will be automatically called before setting query parameters
                },

                // if supplied, the query instance used by the container will be passed to the component as this prop
                prop: 'query',

                // can be a named query name or query instance
                query: 'tasks.all',

                // if true, only the first record will be provided to the component (or the transform function)
                single: true,

                // if supplied, the value returned by this function will be supplied to the component instead of the raw query result
                transform: (data) => { /* ... */ },
            }
        },
    },
    TaskList
);
```

#### `props`

`props` is an optional function which can be used to supply extra props to the underlying component (see the `withUser` sample container below)

#### `reactive`

If `reactive` is true, then the container will use Meteor's pub/sub system to reactively update the data supplied to the component. If `reactive` is false, the component's props will not be changed after its initial load.

## Sample Containers
### withUser

```js
// /imports/api/users/query/users.me.js
import { createNamedQuery } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

const query = createNamedQuery('users.me', {
    users: {
        $filter({ filters, params }) {
            filters._id = params.userId;
        },
        _id: 1,
        profile: 1,
        // anything else you might need
    }
});

if (Meteor.isServer) {
    query.expose({
        firewall(userId, params) {
            params.userId = userId;
        },
    });
}

export default query;

// /imports/ui/decorators/withUser.jsx
import { createQueryContainer } from 'meteor/aplc:grapher-react';

export default (Component) => createQueryContainer(
    {
        data: {
            user: {
                params: { userId: Meteor.userId },
                single: true,
                query: 'users.me',
            },
        },
        props: () => ({ loggingIn: Meteor.loggingIn() }),
    },
    Component
);

// /imports/ui/containers/UserProfile.jsx
import PropTypes from 'prop-types';
import React from 'react';
import withUser from '/imports/ui/decorators/withUser';

@withUser
class UserProfile {
    static propTypes = {
        loading: PropTypes.bool,
        loggingIn: PropTypes.bool,  // supplied from the props() function
        user: PropTypes.object,     // from data.user
    };

    // ...
}

export default UserProfile;
```

### UserList
```js
// /imports/api/groups/query/groups.users.get.js
import { createNamedQuery } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

const query = createNamedQuery('groups.users.get', {
    users: {
        $filter({ filters, params }) {
            filters.groupIds = params.groupId;
        },
        _id: 1,
        profile: 1,
        // anything else you might need
    }
});

if (Meteor.isServer) {
    query.expose({
        firewall(userId, params) {
            // check that the user is in the group
        },
    });
}

export default query;

// /imports/ui/containers/UserProfile.jsx
import { createQueryContainer } from 'meteor/aplc:grapher-react';
import PropTypes from 'prop-types';
import React from 'react';

class UserList {
    static propTypes = {
        loading: PropTypes.bool,
        users: PropTypes.arrayOf(PropTypes.object),
    };

    // ...
}

export default createQueryContainer(
    {
        data: {
            users: {
                // read a prop and pass it to the query
                params: (props) => ({ groupId: props.groupId }),
                query: 'groups.users.get',
            },
        },
    },
    UserList
);

// this component would be used elsewhere like so:
//     <UserList groupId="(_id of a group)" />
```