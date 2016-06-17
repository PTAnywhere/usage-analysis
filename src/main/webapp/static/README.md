# Front end

## Download dependencies

For your convenience, all the JS dependencies are provided in the _bower\_components_ directory.
However, all the JS code is maintained in other repositories.
These dependencies are defined using [Bower](http://bower.io) in the _bower.json_ file.


To get these libraries from their original repositories, simply use ``bower install`` (or ``bower update``).


## Test it with Karma

You can test this library using [Karma](http://karma-runner.github.io) by following these steps:

 * [Install Karma and the needed plugins](http://karma-runner.github.io/0.13/intro/installation.html)

```
cd js/dashboard
npm install karma karma-jasmine karma-chrome-launcher karma-firefox-launcher --save-dev
```

 * Run it

```
./node_modules/karma/bin/karma start
```

Please, note that before running the tests you __need to download the dependencies__.


## Build it with Grunt

```
cd js/dashboard/scripts
npm install -g grunt-cli
```