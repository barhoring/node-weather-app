
const http = require('http');

/* add here your api key for https://www.wunderground.com */
const apikey = require('./api.json').apikey;


function printError(e) {
    console.error(e.message);
}

function printMessage(city, country, temp) {
    const msg = `current temprature in ${city}, ${country} is ${temp}`
    console.log(msg);
};

function get(location) {
    const readble_query = location.replace('/', ' ');
    const uri = `http://api.wunderground.com/api/${apikey}/geolookup/conditions/q/${location}.json`;
    try {
        const request = http.get(uri, response => {
            if (response.statusCode === 200) {
                let body = "";
                response.on('data', data => {
                    body += data.toString();
                });

                response.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        if(data.location){
                            const country = data.location.country_name;
                            const city = data.location.city;
                            const tmp = data.current_observation.temperature_string;
                            printMessage(city, country, tmp);
                        } else {
                            const msg = `the location: "${readble_query}" was not found`;
                            const error = new Error(msg);
                            printError(error);
                        }
                        
                    } catch (e) {
                        printError(e);
                    }
                });
            } else {
                const msg = `There was an error getting the weather for ${location} (${http.STATUS_CODES[response.statusCode]})`;
                const statusCodeError = new Error(msg);
                printError(statusCodeError);
            }
        });

        request.on('error', printError);
    } catch (e) {
        // bad url
        printError(e);
    }
}

module.exports.get = get;
