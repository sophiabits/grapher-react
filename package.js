Package.describe({
    name: 'aplc:grapher-react',
    version: '0.0.3',
    summary: 'Extended React containers for Grapher queries.',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/zwjcarter/grapher-react',
    documentation: 'README.md',
});

Package.onUse(function(api) {
    api.versionsFrom('1.3');

    api.use([
        'ecmascript',
        'underscore',

        'react-meteor-data@0.2.9',
        'cultofcoders:grapher@1.2.9',
    ]);

    api.mainModule('main.js');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('aplc:grapher-react');

    // TODO
});
