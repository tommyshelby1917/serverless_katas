'use strict';

const queryString = require('querystring');

// GET REQUEST
module.exports.hello = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: `Hola ${event.pathParameters.name}`,
                input: event.name,
            },
            null,
            2
        ),
    };
};

// POST REQUEST
module.exports.showUser = async (event) => {
    const body = queryString.parse(event['body']);
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: `THIS IS A POST REQUEST`,
                input: `Hola ${body.name} ${body.lastName}`,
            },
            null,
            2
        ),
    };
};
