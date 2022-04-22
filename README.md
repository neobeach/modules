# neobeach/modules

Modules that are used to make the @neobeach experience even better.

## What are modules
Modules are packages that can be included in the @neobeach/core application.
These modules are created to simplify certain tasks with packages.
We initialize the package inside the Server.js folder in the @neobeach/core.
After the package is initialized it can be used all throughout the project BE/FE.
Inside every module there is documentation written with JSDocs to show example and types of the parameters.

## How to implement modules in neobeach
This is an example how graylog is implemented. But other modules are implemented the same just with other parameters.

**Server.js**
```javascript

const {Runtime, Server} = require('@neobeach/core');
const graylog = require('@neobeach/modules-graylog');

Runtime(() => {
    graylog.init('log.example.com', '12201', 'example-project-name', 'local');
});

```

**anyFile.js**
```javascript
const graylog = require('@neobeach/modules-graylog');

graylog.send('There was an error that happened.', 'This is the error', 'error', {test: 123});
```

## Create modules by yourself
If you have a package that can we include as module look at the other packages as template.
When you are done with them, and they are tested create a pull request in @neobeach/modules.

### Structure
The base structure of the modules is as follows.

```text
module/
    package.json            <- Package.json containing metadata + dependencies needed.
    index.js                <- Export of all the function that are inside the module.
```
### JSDocs
Inside the modules we follow the JSDocs documentation. Reason for this is that we write the documentation while we write our code.
The JSDocs need to contain types on function parameters and an example on how to implement the code.

https://jsdoc.app/

## License
MIT
