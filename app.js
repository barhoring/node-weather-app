const weather = require('./weather.js');
location = process.argv.slice(2).join('/');
weather.get(location);