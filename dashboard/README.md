# Front end application

This folder contains an Angular JS application for the dashboard.

However, at it is highly coupled with the webapp in this project, I have both together.

When you compile the code using Maven, you will execute all the necessary scripts.

## Install

Install it via npm:

    $ npm install

Install dependencies via bower:

    $ bower install  # Or bower update

## Build

    $ gulp

## Run tests

Use one of the following alternatives:

    $ npm test
    $ gulp test

Or if you want to execute them while you develop:

    $ npm run watch
    $ gulp watch

## Bump version

__Version-type__ can be "major", "minor", "patch" or "prerelease".

    $ npm run release [version-type]

(Do not forget to tag the version after committing it)

    $ git tag "v0.0.1" -m "Description"
    $ git push origin --tags

## Dependencies

For your convenience, all the JS dependencies are provided in the _scripts/bower\_components_ directory.
However, all the JS code is maintained in other repositories.
These dependencies are defined using [Bower](http://bower.io) in the _bower.json_ file.

To get these libraries from their original repositories, simply use ``bower install`` (or ``bower update``).

These depedencies are also copied by _Gulp_ to _scripts/tmp/vendors_ so they can be included by Maven in the _war_.
